
// Runtime guard: surface unexpected errors so a broken interaction is diagnosable.
window.addEventListener('error', function(event){
  try {
    const t=document.getElementById('toast');
    if(t){
      const detail=(event.message||'不明なエラー')+(event.lineno?' ('+event.lineno+'行目)':'');
      t.textContent='動作エラー：'+detail;
      t.classList.add('show');
      t.style.zIndex='999999';
      t.style.maxWidth='min(92vw,700px)';
      t.style.whiteSpace='normal';
    }
  } catch(_) {}
  console.error('Étoile Academy runtime error:', event.error || event.message, event.filename, event.lineno);
});
window.addEventListener('unhandledrejection', function(event){
  try {
    const t=document.getElementById('toast');
    if(t){t.textContent='動作エラー：'+String(event.reason&&event.reason.message||event.reason||'非同期処理に失敗');t.classList.add('show');t.style.zIndex='999999';}
  } catch(_) {}
  console.error('Étoile Academy unhandled rejection:',event.reason);
});
const KEY='etoile-academy-save-v2';
const initial={name:'',fairyName:'',chosenIdol:'mirai',setupDone:false,prologueSeen:false,color:'pink',type:'努力家',vocal:12,dance:10,charm:14,bond:5,day:1,lessonDone:false,storyDone:false,liveDone:false,storyChoice:'',sessionActive:false,actionsLeft:0,friendBond:0,friendTalks:0,costumeTickets:5,costumeOwned:['school'],equippedCostume:'school',costumeMedals:0,budget:500,fans:0,skillMaterials:2,costumeLevels:{}};
let state={...initial};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object')state={...initial,...saved}}catch(e){}
const $=id=>document.getElementById(id);

// --- Synthesized sound effects (no external audio files required) ---
const SFX_KEY='etoile-academy-sfx';
let sfxEnabled=true, sfxContext=null;
try { sfxEnabled=localStorage.getItem(SFX_KEY)!=='off'; } catch(e) {}
function syncSoundToggle(){
 const b=$('soundToggle'); if(!b)return;
 b.textContent=sfxEnabled?'🔊 SE ON':'🔇 SE OFF';
 b.setAttribute('aria-pressed',String(sfxEnabled));
 b.title=sfxEnabled?'効果音をオフにする':'効果音をオンにする';
}
syncSoundToggle();
function playTone(freq, start, duration, type='sine', volume=.045, endFreq=null){
 if(!sfxEnabled)return;
 try{
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx)return;
  if(!sfxContext)sfxContext=new AudioCtx();
  if(sfxContext.state==='suspended')sfxContext.resume();
  const now=sfxContext.currentTime+(start||0), osc=sfxContext.createOscillator(), gain=sfxContext.createGain();
  osc.type=type;osc.frequency.setValueAtTime(freq,now);
  if(endFreq)osc.frequency.exponentialRampToValueAtTime(Math.max(1,endFreq),now+duration);
  gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.012);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  osc.connect(gain);gain.connect(sfxContext.destination);osc.start(now);osc.stop(now+duration+.02);
 }catch(e){}
}
function playSfx(kind='tap'){
 if(!sfxEnabled)return;
 if(kind==='tap'){playTone(620,0,.055,'sine',.025,480);return}
 if(kind==='card'){playTone(520,0,.10,'triangle',.045,760);playTone(780,.065,.13,'sine',.035,1040);return}
 if(kind==='success'){playTone(523,0,.18,'sine',.045);playTone(659,.12,.18,'sine',.045);playTone(784,.24,.28,'sine',.05);return}
 if(kind==='gacha'){
  playTone(330,0,.14,'triangle',.035,440);playTone(440,.10,.14,'triangle',.04,660);
  playTone(880,.22,.24,'sine',.05,1320);return;
 }
 if(kind==='rare'){playTone(660,0,.16,'sine',.04);playTone(880,.12,.18,'sine',.045);playTone(1175,.24,.35,'sine',.055);return}
}
document.addEventListener('click',e=>{
 const button=e.target.closest('button');
 if(!button)return;
 if(button.id==='soundToggle'){
  sfxEnabled=!sfxEnabled;
  try{localStorage.setItem(SFX_KEY,sfxEnabled?'on':'off')}catch(e){}
  syncSoundToggle();
  if(sfxEnabled)playSfx('success');
  return;
 }
 if(button.matches('[data-battle-card]'))playSfx('card');
 else if(button.id==='startLive'||button.id==='beginPrologue'||button.id==='startProduce')playSfx('success');
 else if(button.id==='pullCostume'||button.id==='pullCostumeTen'||button.matches('[data-pull-costume]'))playSfx('gacha');
 else playSfx('tap');
});
const names={vocal:'歌唱力',dance:'ダンス',charm:'表現力'};

// --- Costume gacha and wardrobe ---
const costumeCatalog=[
 {id:'school',name:'スクール制服',rarity:'N',label:'ノーマル',icon:'🎀',desc:'学園生活の定番。初めての一着。',skill:{name:'はじめの一歩',desc:'ライブ開始時にスコア +8pt',kind:'start',amount:8}},
 {id:'after',name:'放課後カジュアル',rarity:'N',label:'ノーマル',icon:'🧥',desc:'放課後のお出かけにぴったり。',skill:{name:'リラックス',desc:'毎ターン +2pt',kind:'flat',amount:2}},
 {id:'sporty',name:'スポーティーウェア',rarity:'N',label:'ノーマル',icon:'👟',desc:'動きやすさ抜群のレッスンウェア。',skill:{name:'レッスンの成果',desc:'ダンスカードのスコア +5%',kind:'stat',stat:'dance',amount:5}},
 {id:'classic',name:'クラシックワンピース',rarity:'N',label:'ノーマル',icon:'👗',desc:'上品で落ち着いたクラシカルな一着。',skill:{name:'クラシカルスマイル',desc:'表現カードのスコア +5%',kind:'stat',stat:'charm',amount:5}},
 {id:'summer',name:'サマーカジュアル',rarity:'N',label:'ノーマル',icon:'🌻',desc:'夏の日差しに似合う爽やかな装い。',skill:{name:'サマーブリーズ',desc:'毎ターン +2pt',kind:'flat',amount:2}},
 {id:'winter',name:'ウィンターニット',rarity:'N',label:'ノーマル',icon:'🧶',desc:'あたたかいニットで冬も元気に。',skill:{name:'ぬくもり',desc:'ライブ開始時にスコア +8pt',kind:'start',amount:8}},
 {id:'pastel',name:'パステルステージ',rarity:'R',label:'レア',icon:'🩰',desc:'淡いピンクとリボンがかわいいステージ衣装。',skill:{name:'スイートスマイル',desc:'表現カードのスコア +8%',kind:'stat',stat:'charm',amount:8}},
 {id:'marine',name:'マリン・シンフォニー',rarity:'R',label:'レア',icon:'🫧',desc:'爽やかなブルーのマリンステージ衣装。',skill:{name:'ブルーウェーブ',desc:'ボーカルカードのスコア +8%',kind:'stat',stat:'vocal',amount:8}},
 {id:'lemon',name:'レモンソーダポップ',rarity:'R',label:'レア',icon:'🍋',desc:'明るい黄色が弾けるポップな衣装。',skill:{name:'ポップフィーバー',desc:'毎ターン +3pt',kind:'flat',amount:3}},
 {id:'berry',name:'スイート・ベリー',rarity:'R',label:'レア',icon:'🍓',desc:'ベリーカラーが甘くきらめく衣装。',skill:{name:'ベリーキュート',desc:'表現カードのスコア +8%',kind:'stat',stat:'charm',amount:8}},
 {id:'mint',name:'ミント・フロート',rarity:'R',label:'レア',icon:'🍈',desc:'ミントグリーンの軽やかなステージ衣装。',skill:{name:'ミントステップ',desc:'ダンスカードのスコア +8%',kind:'stat',stat:'dance',amount:8}},
 {id:'cherry',name:'チェリーブロッサム',rarity:'R',label:'レア',icon:'🌺',desc:'鮮やかな花色がステージに映える。',skill:{name:'花咲くコンボ',desc:'コンボボーナス +4pt',kind:'combo',amount:4}},
 {id:'midnight',name:'ミッドナイト・ジャズ',rarity:'R',label:'レア',icon:'🎷',desc:'夜のステージを彩る大人っぽい装い。',skill:{name:'リズムに乗って',desc:'コンボボーナス +8pt',kind:'combo',amount:8}},
 {id:'snowdrop',name:'スノードロップ',rarity:'R',label:'レア',icon:'❄️',desc:'雪の結晶を思わせる透明感のある衣装。',skill:{name:'スノーグレイス',desc:'ライブ開始時にスコア +12pt',kind:'start',amount:12}},
 {id:'starry',name:'星降るナイトドレス',rarity:'SR',label:'スーパーレア',icon:'🌙',desc:'星の刺繍がきらめく夜空のドレス。',skill:{name:'スターダスト',desc:'ライブ開始時にスコア +20pt',kind:'start',amount:20}},
 {id:'sakura',name:'桜色プリンセス',rarity:'SR',label:'スーパーレア',icon:'🌸',desc:'春の花びらをまとった華やかな衣装。',skill:{name:'花びらの祝福',desc:'表現カードのスコア +12%',kind:'stat',stat:'charm',amount:12}},
 {id:'crystal',name:'クリスタル・セレナーデ',rarity:'SR',label:'スーパーレア',icon:'💎',desc:'クリスタルの輝きをまとった舞台衣装。',skill:{name:'クリスタルボイス',desc:'ボーカルカードのスコア +12%',kind:'stat',stat:'vocal',amount:12}},
 {id:'angel',name:'エンジェル・ウィング',rarity:'SR',label:'スーパーレア',icon:'🪽',desc:'羽のように軽やかな天使のドレス。',skill:{name:'エンジェルコール',desc:'3ターン目のスコア +15%',kind:'final',amount:15}},
 {id:'rose',name:'ローズ・ノクターン',rarity:'SR',label:'スーパーレア',icon:'🥀',desc:'深紅の薔薇が印象的な夜会の衣装。',skill:{name:'ローズノクターン',desc:'毎ターン +5pt',kind:'flat',amount:5}},
 {id:'stardust',name:'スターダスト・パレード',rarity:'SR',label:'スーパーレア',icon:'🎆',desc:'星屑が舞う華やかなパレード衣装。',skill:{name:'スターダストパレード',desc:'コンボボーナス +10pt',kind:'combo',amount:10}},
 {id:'royal',name:'ロイヤル・パープル',rarity:'SSR',label:'スーパースペシャルレア',icon:'👑',desc:'紫と金の装飾が輝く特別なドレス。',skill:{name:'ロイヤルステージ',desc:'全カードのスコア +8%',kind:'all',amount:8}},
 {id:'moon',name:'ムーンライト・ベル',rarity:'SSR',label:'スーパースペシャルレア',icon:'✨',desc:'月明かりを閉じ込めた幻想的な衣装。',skill:{name:'月光の奇跡',desc:'3ターン目のスコア +20%',kind:'final',amount:20}},
 {id:'eternal',name:'エターナル・スター',rarity:'SSR',label:'スーパースペシャルレア',icon:'🌟',desc:'永遠の星をイメージした究極のステージ衣装。',skill:{name:'永遠の輝き',desc:'コンボボーナス +15pt',kind:'combo',amount:15}},
 {id:'prism',name:'プリズム・レガリア',rarity:'SSR',label:'スーパースペシャルレア',icon:'🌈',desc:'七色の光が集まる最上級の衣装。',skill:{name:'プリズムフィーバー',desc:'全カードのスコア +10%',kind:'all',amount:10}}
];
function costumeById(id){return costumeCatalog.find(c=>c.id===id)||costumeCatalog[0]}
function costumeLevel(id){if(!state.costumeLevels||typeof state.costumeLevels!=='object')state.costumeLevels={};return Math.max(1,Number(state.costumeLevels[id])||1)}
function effectiveCostumeSkill(costume){const level=costumeLevel(costume.id);return {...costume.skill,amount:costume.skill.amount+(level-1)*2,level}}
function renderAuditionSkill(){if(!$('auditionSkillName'))return;const c=costumeById(state.equippedCostume||'school'),s=effectiveCostumeSkill(c);$('auditionSkillName').textContent=s.name+' · Lv.'+s.level;$('auditionSkillDesc').textContent=c.skill.desc+'（現在効果：'+s.amount+(s.kind==='stat'||s.kind==='all'||s.kind==='final'?'%':'pt')+'）';const conditions={start:'発動条件：オーディション開始時に自動発動',flat:'発動条件：カードをプレイするたび',stat:'発動条件：'+({vocal:'ボーカル',dance:'ダンス',charm:'表現'}[s.stat]||'指定')+'カードをプレイしたとき',all:'発動条件：すべてのカードをプレイしたとき',combo:'発動条件：同じタイプのカードを連続で出したとき',final:'発動条件：第3ターンにカードをプレイしたとき'};$('auditionSkillCondition').textContent=conditions[s.kind]||'発動条件：ライブ中'}
function renderCostumes(){
 if(!$('costumeTickets'))return;
 state.costumeTickets=Math.max(0,Number(state.costumeTickets)||0);
 if(!Array.isArray(state.costumeOwned)||!state.costumeOwned.length)state.costumeOwned=['school'];
 if(!state.costumeOwned.includes('school'))state.costumeOwned.unshift('school');
 if(!state.costumeOwned.includes(state.equippedCostume))state.equippedCostume='school';
 if(!state.costumeLevels||typeof state.costumeLevels!=='object')state.costumeLevels={};
 const equipped=costumeById(state.equippedCostume);
 $('costumeTickets').textContent=state.costumeTickets;$('costumeMedals').textContent=Number(state.costumeMedals)||0;
 if($('skillMaterials'))$('skillMaterials').textContent=Number(state.skillMaterials)||0;
 $('equippedCostumeArt').textContent=equipped.icon;$('equippedCostumeName').textContent=equipped.name;
 $('equippedCostumeDesc').textContent=equipped.desc+' スキル「'+equipped.skill.name+'」：'+equipped.skill.desc+'（Lv.'+costumeLevel(equipped.id)+'）';
 $('costumeOwnedCount').textContent=state.costumeOwned.length+'着';$('costumeFeature').className='costume-feature rarity-'+equipped.rarity.toLowerCase();
 const sort=$('costumeSort')?$('costumeSort').value:'rarity',rarityOrder={SSR:0,SR:1,R:2,N:3},owned=state.costumeOwned.map(id=>costumeById(id));
 owned.sort((a,b)=>sort==='name'?a.name.localeCompare(b.name,'ja'):sort==='level'?costumeLevel(b.id)-costumeLevel(a.id)||rarityOrder[a.rarity]-rarityOrder[b.rarity]:rarityOrder[a.rarity]-rarityOrder[b.rarity]||a.name.localeCompare(b.name,'ja'));
 $('costumeGrid').innerHTML=owned.map(c=>{const isEquipped=c.id===state.equippedCostume,lv=costumeLevel(c.id),cost=lv*100,skill=effectiveCostumeSkill(c);return '<article class="costume-card rarity-'+c.rarity.toLowerCase()+' '+(isEquipped?'is-equipped':'')+'"><div class="costume-card-art">'+c.icon+'</div><span class="costume-rarity">'+c.label+'</span><strong>'+c.name+'</strong><span class="costume-level-badge">COSTUME Lv.'+lv+'</span><p>'+c.desc+'</p><div class="costume-skill-mini">✦ '+c.skill.name+'<small>'+c.skill.desc+' · 現在効果 '+skill.amount+(c.skill.kind==='stat'||c.skill.kind==='all'||c.skill.kind==='final'?'%':'pt')+'</small></div><div class="costume-card-actions"><button class="'+(isEquipped?'secondary':'primary')+'" data-equip-costume="'+c.id+'" '+(isEquipped?'disabled':'')+'>'+(isEquipped?'着用中':'着替える')+'</button><button class="secondary levelup-costume" data-level-costume="'+c.id+'">Lv.UP 💎'+cost+' +✨1</button></div></article>'}).join('');
 document.querySelectorAll('[data-equip-costume]').forEach(b=>b.addEventListener('click',()=>{state.equippedCostume=b.dataset.equipCostume;save();renderCostumes();renderAuditionSkill();toast(costumeById(state.equippedCostume).name+'に着替えたよ！')}));
 document.querySelectorAll('[data-level-costume]').forEach(b=>b.addEventListener('click',()=>levelUpCostume(b.dataset.levelCostume)));
 renderAuditionSkill();
}
function pullCostume(times){
 times=times===10?10:1;
 if(state.costumeTickets<times){toast('チケットが足りないよ！ 今日のプロデュースを終えてチケットをもらおう');return}
 state.costumeTickets-=times;
 const results=[];
 for(let i=0;i<times;i++){
  const roll=Math.random()*100;
  const rarity=roll<3?'SSR':roll<15?'SR':roll<45?'R':'N';
  const pool=costumeCatalog.filter(c=>c.rarity===rarity);
  const item=pool[Math.floor(Math.random()*pool.length)];
  if(state.costumeOwned.includes(item.id)){const medals=({N:1,R:2,SR:4,SSR:8}[item.rarity]||1);state.costumeMedals=(Number(state.costumeMedals)||0)+medals;results.push({item,duplicate:true,medals})}
  else{state.costumeOwned.push(item.id);results.push({item,duplicate:false})}
 }
 save();renderCostumes();
 $('costumePullResult').innerHTML='<h3>ガチャ結果 ✨</h3><div class="costume-result-grid">'+results.map(r=>'<div class="costume-result-item rarity-'+r.item.rarity.toLowerCase()+'"><span>'+r.item.icon+'</span><small>'+r.item.rarity+' · '+r.item.label+'</small><strong>'+r.item.name+'</strong><em>'+(r.duplicate?'所持済み → 衣装メダル +'+r.medals:'NEW！衣装を獲得')+'</em></div>').join('')+'</div><p class="notice">所持衣装 '+state.costumeOwned.length+'着 ／ 衣装メダル '+(state.costumeMedals||0)+'枚</p>';
 playSfx(results.some(r=>r.item.rarity==='SSR')?'rare':'gacha');
 toast('衣装ガチャを引いたよ！');
}
function levelUpCostume(id){
 const item=costumeById(id),level=costumeLevel(id),cost=level*100;
 if(level>=10){toast('この衣装は最大レベルだよ！');return}
 if((Number(state.budget)||0)<cost){toast('ジュエルが足りないよ（必要：'+cost+'）');return}
 if((Number(state.skillMaterials)||0)<1){toast('スキル強化素材が足りないよ。メダル交換所で交換できるよ！');return}
 state.budget-=cost;state.skillMaterials-=1;state.costumeLevels[id]=level+1;
 save();renderCostumes();refresh();toast(item.name+'が Lv.'+(level+1)+'にアップ！ スキル効果も強化されたよ');
}
function exchangeCostume(kind){
 const costs={R:10,SR:30,SSR:80};
 if(kind==='tickets'){
  if((Number(state.costumeMedals)||0)<8){toast('衣装メダルが足りないよ（必要：8枚）');return}
  state.costumeMedals-=8;state.costumeTickets=(Number(state.costumeTickets)||0)+3;save();renderCostumes();toast('ガチャチケットを3枚交換したよ！');return;
 }
 if(kind==='material'){
  if((Number(state.costumeMedals)||0)<5){toast('衣装メダルが足りないよ（必要：5枚）');return}
  state.costumeMedals-=5;state.skillMaterials=(Number(state.skillMaterials)||0)+1;save();renderCostumes();toast('スキル強化素材 +1！ 所持数 '+state.skillMaterials);return;
 }
 const cost=costs[kind];if(!cost)return;
 if((Number(state.costumeMedals)||0)<cost){toast('衣装メダルが足りないよ（必要：'+cost+'枚）');return}
 const pool=costumeCatalog.filter(c=>c.rarity===kind&&!state.costumeOwned.includes(c.id));
 if(!pool.length){toast('このレアリティの未所持衣装はないよ！');return}
 const item=pool[Math.floor(Math.random()*pool.length)];state.costumeMedals-=cost;state.costumeOwned.push(item.id);save();renderCostumes();
 $('costumePullResult').innerHTML='<h3>メダル交換 ✨</h3><div class="costume-result-grid"><div class="costume-result-item rarity-'+item.rarity.toLowerCase()+'"><span>'+item.icon+'</span><small>'+item.rarity+' · '+item.label+'</small><strong>'+item.name+'</strong><em>交換で獲得！</em></div></div>';
 toast(item.name+'を交換したよ！');
}
document.querySelectorAll('[data-costume-exchange]').forEach(b=>b.addEventListener('click',()=>exchangeCostume(b.dataset.costumeExchange)));
if($('costumeSort'))$('costumeSort').addEventListener('change',renderCostumes);
$('pullCostume').addEventListener('click',()=>pullCostume(1));
$('pullCostumeTen').addEventListener('click',()=>pullCostume(10));
renderCostumes();

function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$('saveStatus').textContent='PROGRESS AUTO-SAVED'}catch(e){$('saveStatus').textContent='SAVE UNAVAILABLE'}}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2400)}
function refresh(){
 $('topName').textContent=state.name||'見習いプロデューサー';$('dayLabel').textContent=state.day+'日目';
 if($('budgetValue'))$('budgetValue').textContent=(Number(state.budget)||0).toLocaleString();if($('fansValue'))$('fansValue').textContent=(Number(state.fans)||0).toLocaleString();
 const idolLabel=state.name||({mirai:'星降 未来',reika:'如月 麗華',komugi:'日高 こむぎ'}[state.chosenIdol]||'見習いアイドル');
 if($('homeGreetingName'))$('homeGreetingName').textContent=idolLabel;
 if($('homeIdolName'))$('homeIdolName').textContent=idolLabel;
 const sessionNote=$('homeSessionNote');if(sessionNote){sessionNote.querySelector('span:last-child').textContent=state.sessionActive?'今日のプロデュース進行中 · 残り '+state.actionsLeft+' 行動': '今日のプロデュースはまだ始まっていません';sessionNote.classList.toggle('is-active',!!state.sessionActive);}
 document.querySelectorAll('[data-start-produce]').forEach(b=>{b.textContent=state.sessionActive?'今日の活動をつづける　→':'プロデュース画面へ　→';});

 ['vocal','dance','charm','bond'].forEach(k=>{ $(k).textContent=state[k];$('bar-'+k).style.width=state[k]+'%'});
 ['lesson','story','live'].forEach(k=>{$('task-'+k).classList.toggle('done',!!state[k+'Done'])});



 const title=state.name?state.name+'の FIRST LIGHT':'FIRST LIGHT';if($('stageName')) $('stageName').textContent=title; // optional legacy element; current home layout no longer includes it
 save();
}
const prologues={"mirai":["星降 未来","ナレーション「放課後。入学式の緊張が少しだけほどけて、未来は校舎の出口で立ち止まった。」\n\n未来「ねえ、妖精さん。今日、友達を誘って寄り道してみてもいいかな？」\n\nあなた「もちろん。未来が一緒にいたいって思う人に、声をかけてみようよ。」\n\n未来「うん……ちょっとドキドキするけど、行ってくる！」\n\nナレーション「未来は同じクラスの子に駆け寄り、勇気を出して声をかけた。」\n\n未来「ねえ、よかったら一緒に帰らない？ 途中でお茶もしようよ！」\n\nナレーション「相手は笑顔でうなずいた。未来の表情がぱっと明るくなる。」\n\n未来「やった！ 明日も学校で会おうね。約束だよ！」\n\nあなた「よかったね。最初の一歩、ちゃんと踏み出せたね。」\n\n未来「えへへ。明日からも、いろんな人と仲良くなりたいな！」\n\nナレーション「小さな約束を胸に、未来の学園生活が始まった。」"],"reika":["如月 麗華","ナレーション「放課後。麗華は本を閉じ、静かな廊下をゆっくり歩いていた。」\n\n麗華「……せっかくだし、誰かと帰ってみようかな。」\n\nあなた「気になる人がいるの？」\n\n麗華「同じクラスの子。話してみたいとは思ってたけど、きっかけがなくて。」\n\nあなた「それなら、今がちょうどいいかも。」\n\nナレーション「麗華は少し考えてから、相手のそばへ歩いていった。」\n\n麗華「ねえ、もしよかったら一緒に帰らない？ 急いでなければ、お茶でも。」\n\nナレーション「相手はうれしそうにうなずいた。麗華はほっとしたように微笑む。」\n\n麗華「……誘ってみてよかった。こういうのも、悪くないね。」\n\nあなた「明日も会う約束、してみたら？」\n\n麗華「そうね。……明日も一緒に帰ろうって、約束。」\n\nナレーション「自分のペースで踏み出した一歩が、麗華の新しい毎日につながった。」"],"komugi":["日高 こむぎ","ナレーション「放課後。こむぎは元気いっぱいに廊下を走りかけて、あわてて立ち止まった。」\n\nこむぎ「そうだ！ めるちゃんを誘って、一緒に帰ろう！」\n\nあなた「いいね。でも、廊下は歩こうね。」\n\nこむぎ「はーい！ うち、ちゃんと歩いて誘ってくる！」\n\nナレーション「こむぎはめるを見つけると、にこにこしながら駆け寄った。」\n\nこむぎ「めるちゃん！ よかったら一緒に帰らない？ クレープ食べていこうよ！」\n\nめる「べ、別にいいけど！ ちょうど寄り道したかっただけだからね！」\n\nナレーション「二人は顔を見合わせて笑い、並んで校門へ向かった。」\n\nこむぎ「明日も一緒に帰ろうね！ 約束だよ！」\n\nめる「はいはい、約束。……楽しみにしてるから。」\n\nあなた「素敵な放課後になったね。」\n\nこむぎ「うん！ 明日も楽しみだなー！」\n\nナレーション「新しい友達との小さな約束が、こむぎの胸をいっぱいにした。」"]};
let selectedStartIdol='mirai';
document.querySelectorAll('[data-idol]').forEach(b=>b.addEventListener('click',()=>{selectedStartIdol=b.dataset.idol;document.querySelectorAll('[data-idol]').forEach(x=>x.classList.toggle('selected',x.dataset.idol===selectedStartIdol));}));
function showPrologue(){
 const p=prologues[state.chosenIdol]||prologues.mirai;
 const pages=p[1].replaceAll('＋FAIRY＋',state.fairyName).split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
 let pageIndex=0;
 $('setupOverlay').classList.remove('show');
 $('storyScreen').classList.add('show');
 $('storyScreen').setAttribute('aria-hidden','false');
 $('storyScreen').innerHTML='<header class="story-topbar"><div class="story-brand"><span class="story-brandmark">✧</span><span>Étoile Academy<small>EPISODE 01</small></span></div><div class="story-chapter">EPISODE 01 · 放課後の約束</div><button class="story-skip" id="storySkip">スキップ ×</button></header><main class="story-stage"><div class="story-bg-orb"></div><div class="story-bg-stars">✦ <span>✧</span> ✦ <span>·</span> ✧</div><div class="story-scene-label">MEMORIES · '+p[0]+'</div><div class="story-scene-space"><div class="story-emblem">✧</div><div class="story-scene-name">'+p[0]+'</div><div class="story-scene-note">あなたとアイドルの物語</div></div><section class="story-dialogue" aria-live="polite"><div class="story-dialogue-inner"><div class="story-speaker" id="vnSpeaker">ナレーション</div><div class="story-text" id="vnText"></div></div><div class="story-bottom"><span id="vnCount"></span><span class="story-track"><i id="vnTrackFill"></i></span><button class="story-prev" id="vnPrev">← 前へ</button><button class="story-next" id="vnNext">次へ　→</button></div></section></main>';
 const finish=()=>{state.prologueSeen=true;save();$('storyScreen').classList.remove('show');$('storyScreen').setAttribute('aria-hidden','true');$('appShell').classList.add('game-ready');showView('home');toast(p[0]+'との学園生活が始まったよ');};
 function renderPage(){
  const raw=pages[pageIndex]||'';
  const speakerMatch=raw.match(/^([^「\n]+)「([\s\S]*)」$/);
  const speaker=$('vnSpeaker'), body=$('vnText');
  if(raw.startsWith('＊')){
   speaker.textContent='— 時が流れて —';body.textContent='✦　✦　✦';body.classList.add('story-divider');
  }else if(speakerMatch){
   speaker.textContent=speakerMatch[1].trim();body.classList.remove('story-divider');body.textContent=speakerMatch[2].trim();
  }else{
   speaker.textContent='ナレーション';body.classList.remove('story-divider');body.textContent=raw;
  }
  $('vnCount').textContent=String(pageIndex+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');
  $('vnTrackFill').style.width=((pageIndex+1)/pages.length*100)+'%';
  $('vnPrev').disabled=pageIndex===0;
  $('vnNext').textContent=pageIndex===pages.length-1?'学園生活を始める　→':'次へ　→';
 }
 $('vnPrev').addEventListener('click',()=>{if(pageIndex>0){pageIndex--;renderPage()}});
 $('vnNext').addEventListener('click',()=>{if(pageIndex<pages.length-1){pageIndex++;renderPage()}else finish()});
 $('storySkip').addEventListener('click',finish);
 renderPage();
}
$('beginPrologue').addEventListener('click',()=>{const fairy=$('fairyName').value.trim();if(!fairy){$('setupError').textContent='妖精の名前を入力してね。';$('setupError').classList.add('show');return;}state.fairyName=fairy;state.name=prologues[selectedStartIdol][0];state.chosenIdol=selectedStartIdol;updateFriendRoster();state.setupDone=true;state.prologueSeen=false;state.vocal=12;state.dance=10;state.charm=14;state.bond=5;save();refresh();showPrologue();});

function showView(name){
 if(!state.prologueSeen){
  if(state.setupDone){showPrologue();}
  else {$('setupOverlay').classList.add('show');}
  return;
 }
 if(name==='live'&&!state.sessionActive){
  toast('オーディションに参加するには、先にプロデュースを開始してね');
  name='produce';
 }
 if(document.getElementById('appShell'))document.getElementById('appShell').classList.toggle('produce-mode',(name==='produce'||name==='live')&&!!state.sessionActive);
 const target=$('view-'+name);if(!target)return;
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v===target));
 document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
 const main=document.querySelector('main.main');if(main)main.scrollTop=0;
}
document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.goto)));
document.querySelectorAll('[data-train]').forEach(b=>b.addEventListener('click',()=>{
 if(!state.sessionActive){showView('produce');toast('まず「プロデュースを開始する」を押してね');return}
 const k=b.dataset.train;const trainingCost=20;if((Number(state.budget)||0)<trainingCost){toast('ジュエルが足りないよ（レッスン費用：20）');return}state.budget-=trainingCost;const before=state[k];state[k]=Math.min(100,state[k]+5);state.bond=Math.min(100,state.bond+2);state.lessonDone=true;
 const msg=names[k]+'が '+(state[k]-before)+' アップ！ 親愛度 +2。行動を1回使ったよ。';
 $('lessonResult').textContent=msg;$('lessonResult').classList.add('show');$('produceResult').textContent=msg;$('produceResult').classList.add('show');spendAction(msg);
}));
document.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{
 if(state.storyDone){toast('このエピソードはクリア済みだよ');return}
 const choice=b.dataset.choice;state.storyChoice=choice;state.storyDone=true;state.bond=Math.min(100,state.bond+8);
 const texts={kind:'「うん……！ ひとりじゃないって思ったら、少し勇気が出てきた」彼女はほっとしたように笑った。一歩ずつでいい。その約束が、ふたりの最初の絆になった。',bold:'「信じてくれるの？ ……じゃあ、私も自分を信じてみたい」彼女の瞳に、小さな光がともる。期待に応えたいという気持ちが、新しい力に変わっていく。',honest:'「ほんとはね、失敗するのが怖いんだ」彼女は胸の内を少しずつ話し始めた。弱さを見せても大丈夫。安心できる場所が、夢への最初の一歩になった。'};
 $('storyText').textContent=texts[choice];$('storyTitle').textContent='小さな勇気、大きな一歩';$('storyResult').textContent='エピソードクリア！ 親愛度 +8。彼女との距離が少し近づいた。';$('storyResult').classList.add('show');$('nextStory').style.display='inline-block';refresh();toast('エピソードクリア！ 親愛度 +8');
}));
$('nextStory').addEventListener('click',()=>{showView('home');toast('次のエピソードもお楽しみに')});
// --- Three-turn strategic card audition ---
let battle=null;
const cardPool=[
 {name:'サビで勝負！',type:'vocal',icon:'♫',base:12,desc:'歌唱力を活かす'},
 {name:'キレキレターン',type:'dance',icon:'♧',base:12,desc:'ダンスで魅せる'},
 {name:'視線を独り占め',type:'charm',icon:'✧',base:12,desc:'表現力で惹きつける'},
 {name:'ハーモニー',type:'vocal',icon:'♪',base:9,desc:'安定した歌声'},
 {name:'フォーメーション',type:'dance',icon:'❖',base:9,desc:'息の合った動き'},
 {name:'ファンサービス',type:'charm',icon:'♡',base:9,desc:'観客の心をつかむ'}
];
const typeName={vocal:'ボーカル',dance:'ダンス',charm:'表現'};
function drawHand(){return Array.from({length:3},()=>cardPool[Math.floor(Math.random()*cardPool.length)])}
function renderBattle(){
 $('playerScore').textContent=battle.player;$('rivalScore').textContent=battle.rival;
 $('battleTurn').textContent=battle.done?'FINAL':('TURN '+(battle.turn+1)+' / 3');
 $('battleHeading').textContent=battle.done?'オーディション結果':('第'+(battle.turn+1)+'ターン：カードを選ぼう');
 $('battleHand').innerHTML=battle.done?'':battle.hand.map((c,i)=>'<button class="lesson" data-battle-card="'+i+'" style="display:block;text-align:left;min-height:125px;border:1px solid #e6dcf4;padding:13px"><span style="font-size:24px">'+c.icon+'</span><strong style="display:block;margin:8px 0;font-size:12px">'+c.name+'</strong><small style="color:#827d9a;line-height:1.6">'+typeName[c.type]+' / '+c.desc+'</small><b style="display:block;color:#8e80df;margin-top:8px">基礎 '+(c.base+Math.floor(state[c.type]*.35))+' pt</b></button>').join('');
 document.querySelectorAll('[data-battle-card]').forEach(b=>b.addEventListener('click',()=>playBattleCard(Number(b.dataset.battleCard))));
 $('startLive').style.display=battle&&!battle.done?'none':'inline-block';
 $('startLive').textContent=battle&&battle.done?'もう一度挑戦':'オーディション開始　→';
 $('battleNext').style.display=battle&&!battle.done&&battle.waiting?'inline-block':'none';
}
function playBattleCard(i){
 if(!battle||battle.done||battle.waiting)return;
 const c=battle.hand[i];if(!c)return;
 const stat=state[c.type]||0;let points=c.base+Math.floor(stat*.35);
 const activeCostume=costumeById(state.equippedCostume||'school'),skill=effectiveCostumeSkill(activeCostume);
 if(skill.kind==='all'||(skill.kind==='stat'&&skill.stat===c.type))points+=Math.floor(points*skill.amount/100);
 if(skill.kind==='flat')points+=skill.amount;
 if(skill.kind==='final'&&battle.turn===2)points+=Math.floor(points*skill.amount/100);
 let combo='';
 if(battle.lastType===c.type){const comboBonus=8+battle.combo*3+(skill.kind==='combo'?skill.amount:0);points+=comboBonus;battle.combo++;combo=' 同タイプ連続！コンボ +'+comboBonus+'pt！';}
 else if(battle.lastType){points+=5;battle.combo=0;combo=' タイプチェンジ・ブレイク +5pt！';}
 battle.lastType=c.type;battle.player+=points;
 const rival=10+Math.floor(Math.random()*12)+Math.floor((state.vocal+state.dance+state.charm)/30);
 battle.rival+=rival;battle.turn++;battle.waiting=true;battle.hand=[];
 $('battleLog').textContent=c.name+'！ '+points+'pt獲得。ライバルは '+rival+'pt。'+combo;
 if(battle.turn>=3){battle.done=true;battle.waiting=false;const win=battle.player>=battle.rival;const reward=win?30:12;state.fans=(state.fans||0)+reward;const budgetReward=win?150:40;state.budget=(Number(state.budget)||0)+budgetReward;state.bond=Math.min(100,state.bond+(win?5:2));$('liveResult').innerHTML=(win?'🏆 合格！':'✦ 惜しい結果…')+'<br>最終スコア '+battle.player+' 対 '+battle.rival+'<br>ファン +'+reward+' / ジュエル +'+budgetReward+' / 親愛度 +'+(win?5:2);state.liveDone=true;refresh();spendAction((win?'オーディション合格！':'オーディション終了。')+' ファン +'+reward);}
 else {battle.waiting=true;$('battleNext').style.display='inline-block';$('battleNext').textContent='次のターンへ　→';}
 renderBattle();
}
$('backToProduce').addEventListener('click',()=>showView('produce'));
$('goAudition').addEventListener('click',()=>{if(!state.sessionActive){toast('先に今日のプロデュースを開始してね');return}showView('live')});
$('startLive').addEventListener('click',()=>{
 if(!state.sessionActive){toast('まず今日のプロデュースを開始してね');showView('produce');return}
 const auditionCost=50;if((Number(state.budget)||0)<auditionCost){toast('オーディション参加費が足りないよ（50）');return}state.budget-=auditionCost;
 const liveCostume=costumeById(state.equippedCostume||'school'),liveSkill=effectiveCostumeSkill(liveCostume);
 const startBonus=liveSkill.kind==='start'?liveSkill.amount:0;
 battle={turn:0,player:startBonus,rival:0,lastType:null,combo:0,hand:drawHand(),done:false,waiting:false};
 $('liveResult').textContent='';$('battleLog').textContent='手札が配られた！ 着用スキル「'+liveSkill.name+'」Lv.'+liveSkill.level+'発動！'+(startBonus?' 開始ボーナス +'+startBonus+'pt。':'')+' 3ターンでライバルを上回ろう。';renderBattle();
});
$('battleNext').addEventListener('click',()=>{if(!battle||battle.done)return;battle.hand=drawHand();battle.waiting=false;$('battleNext').style.display='none';renderBattle()});


// --- Daily produce session: 3 actions, explicitly started by the player ---
function renderProduce(){
 const active=!!state.sessionActive;
 $('produceHeading').textContent=active?'今日の活動、あと少し！':(state.actionsLeft===0&&state.day>1?'今日の活動は終了しました':'まだ今日の活動を始めていません');
 $('actionsLeft').textContent='行動 '+(active?state.actionsLeft:3)+' / 3';
 $('produceDescription').textContent=active?'何をするか選ぼう。行動回数を使い切ると今日の活動は終了。':(state.actionsLeft===0&&state.day>1?'今日の活動はおしまい。休んで、次の日にまた始めよう。':'開始ボタンを押すまでは、レッスンや会話で行動回数は消費されません。');
 $('startProduce').style.display=active?'none':'inline-block';
 $('goAudition').style.display=active?'inline-block':'none';
 $('produceActions').style.display=active?'grid':'none';
 $('finishProduce').style.display=active?'inline-block':'none';
}
function endProduce(message){
 state.sessionActive=false;state.actionsLeft=0;state.day+=1;state.costumeTickets=(Number(state.costumeTickets)||0)+1;
 $('appShell').classList.remove('produce-mode');
 $('produceResult').textContent=message||'今日の活動は終了！ 頑張った自分をほめてあげよう。';
 $('produceResult').classList.add('show');renderProduce();refresh();showView('home');toast('今日のプロデュースが終了！ 衣装ガチャチケット +1');
}
function spendAction(message){
 if(!state.sessionActive)return;
 state.actionsLeft=Math.max(0,state.actionsLeft-1);
 $('produceResult').textContent=message+' 残り行動：'+state.actionsLeft;
 $('produceResult').classList.add('show');
 if(state.actionsLeft===0){endProduce('今日の行動をすべて使い切ったよ！ 今日の頑張りはきっと明日の自信になる。');}
 else{renderProduce();refresh();}
}
$('startProduce').addEventListener('click',()=>{
 if(state.sessionActive){toast('今日のプロデュースは始まっているよ');return}
 state.sessionActive=true;state.actionsLeft=3;state.lessonDone=false;state.liveDone=false;
 $('appShell').classList.add('produce-mode');showView('produce');
 $('produceResult').classList.remove('show');renderProduce();refresh();toast('今日のプロデュース開始！ 行動は3回までだよ');
});
$('finishProduce').addEventListener('click',()=>{if(state.sessionActive)endProduce('今日はここまで！ 使わなかった時間も大切な休息。');});
document.querySelectorAll('[data-start-produce]').forEach(b=>b.addEventListener('click',()=>{showView('produce');if(!state.sessionActive)toast('「プロデュースを開始する」で今日の活動を始めよう');}));
document.querySelectorAll('[data-friend-talk]').forEach(b=>b.addEventListener('click',()=>{
 if(!state.sessionActive){showView('produce');toast('まずプロデュースを開始してね');return}
 state.bond=Math.min(100,state.bond+5);state.friendBond=Math.min(100,(state.friendBond||0)+8);state.friendTalks=(state.friendTalks||0)+1;
 $('friendResult').textContent='みんな「話せてよかった！ また一緒に過ごそうね」 親愛度 +5。';$('friendResult').classList.add('show');
 $('friendText').textContent='相手はうれしそうに笑った。「アイドルのあなたも好きだけど、普通に話してるあなたも大好きだよ」';
 spendAction('仲間とおしゃべりした。友情が深まった！');
}));
let activeFriend='meru';
const castTalk={
 meru:{name:'夢見 める',tag:'DREAM-KAKE ROSETTA',title:'「ねえ、放課後ちょっと付き合ってよ」',intro:'めるは少し照れたように、あなたの顔をのぞき込んだ。',answers:{cafe:['「べ、別にあなたと寄り道したいわけじゃないけど！」めるは頬を赤くしながら歩き出した。','めると放課後の寄り道をすることになった。'],practice:['「いいよ。ちゃんと見ててあげる！」めるは得意げに胸を張った。','めるがレッスンを見守ってくれることになった。'],talk:['「なによ、改まっちゃって。……ちゃんと聞くから話してみなよ」めるはまっすぐこちらを見た。','めるに悩みを聞いてもらった。']}},
 tsukiyo:{name:'願掛 月夜',tag:'DREAM-KAKE ROSETTA',title:'「少し、お話ししてもよろしいですか」',intro:'月夜は静かに会釈して、あなたが話し始めるのを待っている。',answers:{cafe:['「では、カフェテリアで温かいお茶でもいただきましょう」月夜は穏やかに微笑んだ。','月夜とお茶を飲む約束をした。'],practice:['「努力する姿は素敵ですね。私も見学させてください」月夜はうなずいた。','月夜がレッスンを見に来てくれることになった。'],talk:['「急がなくても大丈夫です。あなたの言葉で聞かせてください」月夜は静かに寄り添った。','月夜に話を聞いてもらった。']}},
 arashi:{name:'朝比奈 嵐',tag:'AMORPHOUS',title:'「おい、今日は何に挑戦するんだ？」',intro:'嵐は自信たっぷりに笑い、あなたの返事を待っている。',answers:{cafe:['「よし、腹ごしらえも大事だな！行こう！」嵐は元気よく歩き出した。','嵐とカフェテリアへ向かった。'],practice:['「いい心がけだ！オレも付き合うぞ！」嵐は気合十分だ。','嵐と練習する約束をした。'],talk:['「悩みがあるなら話してみろ。仲間だろ！」嵐は真剣にうなずいた。','嵐に相談して、気持ちが少し軽くなった。']}},
 setsuna:{name:'夜永 セツナ',tag:'AMORPHOUS',title:'「……なんだよ。話なら聞くけど」',intro:'セツナはそっぽを向いているが、ちゃんとこちらの話を待っている。',answers:{cafe:['「別に暇だっただけだ。……ほら、行くぞ」セツナは少しだけ歩調を合わせた。','セツナと寄り道をすることになった。'],practice:['「仕方ねえな。少しだけ付き合ってやるよ」セツナは腕を組んだ。','セツナが練習に付き合ってくれることになった。'],talk:['「……言ってみろよ。茶化したりしねえから」セツナは小さく息をついた。','セツナに悩みを聞いてもらった。']}},
 reika:{name:'如月 麗華',tag:'TRICOLORE PALETTE',title:'「少し休憩しない？」',intro:'麗華は本を閉じて、あなたにゆっくりと微笑みかけた。',answers:{cafe:['「甘いものでも食べようか。たまには休むのも大事だよ」麗華は立ち上がった。','麗華と休憩することにした。'],practice:['「頑張りすぎないようにね。私も見ているから」麗華は優しくうなずいた。','麗華がレッスンを見守ってくれることになった。'],talk:['「うん、聞くよ。無理に答えを出さなくてもいいからね」麗華は静かに話を聞いた。','麗華に相談した。']}},
 mirai:{name:'星降 未来',tag:'TRICOLORE PALETTE',title:'「ねえねえ、一緒に頑張ろう！」',intro:'未来はぱっと笑顔になって、あなたの手を取った。',answers:{cafe:['「やったー！放課後の寄り道ってわくわくするね！」未来は笑顔で歩き出した。','未来と寄り道をする約束をした。'],practice:['「もちろん！あたしももっと上手になりたいんだ！」未来はやる気いっぱいだ。','未来と一緒に練習することになった。'],talk:['「うん、何でも言って！一緒に考えよう！」未来は真剣にうなずいた。','未来に相談して、前向きな気持ちになった。']}},
 komugi:{name:'日高 こむぎ',tag:'TRICOLORE PALETTE',title:'「ねえねえ、放課後クレープ食べに行こ！」',intro:'こむぎは楽しそうにぴょんぴょん跳ねながら誘ってきた。',answers:{cafe:['「やったあ！どの味にする？こむぎ、いちご！」こむぎはうれしそうにはしゃいだ。','こむぎとクレープを食べに行く約束をした。'],practice:['「じゃあ練習のあとね！こむぎ、待ってる！」こむぎは大きくうなずいた。','こむぎが練習後に待っていてくれることになった。'],talk:['「もちろん！こむぎでよければ、なんでも聞くよ！」こむぎはやさしく笑った。','こむぎに話を聞いてもらった。']}}
};
function selectFriend(id){activeFriend=id;const c=castTalk[id];$('friendTag').textContent=c.tag+' · AFTER SCHOOL';$('friendTitle').textContent=c.title;$('friendText').textContent=c.intro;$('friendResult').textContent='';$('friendResult').classList.remove('show');document.querySelectorAll('[data-character-chat]').forEach(b=>b.classList.toggle('selected',b.dataset.characterChat===id));}
function updateFriendRoster(){const ownIdol=state.chosenIdol;document.querySelectorAll('[data-character-chat]').forEach(b=>{b.hidden=b.dataset.characterChat===ownIdol;});if(activeFriend===ownIdol){const next=document.querySelector('[data-character-chat]:not([hidden])');if(next)selectFriend(next.dataset.characterChat);}}
document.querySelectorAll('[data-character-chat]').forEach(b=>b.addEventListener('click',()=>selectFriend(b.dataset.characterChat)));
updateFriendRoster();
document.querySelectorAll('[data-friend-choice]').forEach(b=>b.addEventListener('click',()=>{
 const c=castTalk[activeFriend],a=c.answers[b.dataset.friendChoice];$('friendText').textContent=a[0];$('friendResult').textContent=a[1];$('friendResult').classList.add('show');
 if(state.sessionActive){state.friendBond=Math.min(100,(state.friendBond||0)+3);state.bond=Math.min(100,state.bond+3);spendAction(c.name+'と会話した。親愛度 +3。');}
 else{toast('会話を楽しめるよ。親愛度アップはプロデュース中だけ！');}
 refresh();
}));
const roam={x:48,y:57,dx:0,dy:0,moving:false,last:0,near:null};
const mapCast=[
 {id:'mapMeru',x:61,y:45,name:'夢見 める',key:'meru',line:'める「ちょっと、そんなに見ないでよ！……せっかく会ったんだから、少しぐらい話していきなさいよね」'},
 {id:'mapArashi',x:31,y:58,name:'朝比奈 嵐',key:'arashi',line:'嵐「おっ、来たな！今日も全力でいこうじゃないか！」'},
 {id:'mapSetsuna',x:72,y:70,name:'夜永 セツナ',key:'setsuna',line:'セツナ「なんだよ。……まあ、少しなら付き合ってやる」'},
 {id:'mapTsukiyo',x:23,y:34,name:'願掛 月夜',key:'tsukiyo',line:'月夜「こんにちは。学園の中でお困りのことはありませんか？」'}
];
function renderMap(){const p=$('mapPlayer');p.style.left=roam.x+'%';p.style.top=roam.y+'%';$('mapPlayerName').textContent=state.name||'あなた';let best=null,bd=999;mapCast.forEach(n=>{const d=Math.hypot((roam.x-n.x)*.8,roam.y-n.y);$(n.id).classList.toggle('nearby',d<12);if(d<12&&d<bd){best=n;bd=d}});roam.near=best;$('mapInteract').style.opacity=best?'1':'.55';$('mapInteract').textContent=best?best.name+'と話す':'近くの人と話す';$('mapLocation').textContent=roam.y<37?(roam.x<38?'教室前':'レッスン室前'):roam.y>68?(roam.x<38?'カフェテリア前':'中庭'):'中央通路'}
function mapFrame(t){if(roam.moving){let dt=Math.min(32,t-(roam.last||t));roam.x=Math.max(5,Math.min(95,roam.x+roam.dx*dt*.035));roam.y=Math.max(6,Math.min(93,roam.y+roam.dy*dt*.035));renderMap()}roam.last=t;requestAnimationFrame(mapFrame)}requestAnimationFrame(mapFrame);const joy=$('joyBase'),knob=$('joyKnob');function joyMove(e){const r=joy.getBoundingClientRect();let x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2,max=r.width*.31,len=Math.hypot(x,y);if(len>max){x=x/len*max;y=y/len*max}knob.style.transform='translate('+x+'px,'+y+'px)';roam.dx=x/max;roam.dy=y/max;roam.moving=true;e.preventDefault()}function joyStop(){roam.moving=false;roam.dx=roam.dy=0;knob.style.transform='translate(0,0)'}joy.addEventListener('pointerdown',e=>{joy.setPointerCapture(e.pointerId);joyMove(e)});joy.addEventListener('pointermove',e=>{if(e.buttons||e.pressure>0)joyMove(e)});joy.addEventListener('pointerup',joyStop);joy.addEventListener('pointercancel',joyStop);document.addEventListener('keydown',e=>{let k=e.key.toLowerCase();if(!['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(k))return;roam.moving=true;roam.dx=k==='a'||k==='arrowleft'?-1:k==='d'||k==='arrowright'?1:0;roam.dy=k==='w'||k==='arrowup'?-1:k==='s'||k==='arrowdown'?1:0});document.addEventListener('keyup',e=>{if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(e.key.toLowerCase()))joyStop()});$('mapInteract').addEventListener('click',()=>{if(!roam.near){toast('人の近くまで歩いてみてね');return}const n=roam.near;$('mapDialogTitle').textContent=n.name;$('mapDialogText').textContent=n.line;$('mapDialog').classList.add('show');if(state.sessionActive){state.bond=Math.min(100,state.bond+2);refresh()}});
$('mapDialogClose').addEventListener('click',()=>$('mapDialog').classList.remove('show'));renderMap();
const originalRefresh=refresh;
refresh=function(){originalRefresh();renderProduce();renderCostumes();$('topName').textContent=state.name||'学園生活 '+state.day+'日目';};

refresh();
if(!state.setupDone){$('setupOverlay').classList.add('show');}else if(!state.prologueSeen){$('setupOverlay').classList.add('show');showPrologue();}else{$('appShell').classList.add('game-ready');if(state.sessionActive){$('appShell').classList.add('produce-mode');showView('produce');}else{showView('home');}}
