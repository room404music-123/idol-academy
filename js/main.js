
// Runtime guard: surface unexpected errors so a broken interaction is diagnosable.
window.addEventListener('error', function(event){
  try { const t=document.getElementById('toast'); if(t){t.textContent='動作エラーが発生しました。ページを再読み込みしてください。';t.classList.add('show');} } catch(_) {}
  console.error('Étoile Academy runtime error:', event.error || event.message);
});
const KEY='etoile-academy-save-v2';
const initial={name:'',fairyName:'',chosenIdol:'mirai',setupDone:false,prologueSeen:false,color:'pink',type:'努力家',vocal:12,dance:10,charm:14,bond:5,day:1,lessonDone:false,storyDone:false,liveDone:false,storyChoice:'',sessionActive:false,actionsLeft:0,friendBond:0,friendTalks:0};
let state={...initial};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved==='object')state={...initial,...saved}}catch(e){}
const $=id=>document.getElementById(id);
const names={vocal:'歌唱力',dance:'ダンス',charm:'表現力'};
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));$('saveStatus').textContent='PROGRESS AUTO-SAVED'}catch(e){$('saveStatus').textContent='SAVE UNAVAILABLE'}}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2400)}
function refresh(){
 $('topName').textContent=state.name||'見習いプロデューサー';$('dayLabel').textContent=state.day+'日目';
 const idolLabel=state.name||({mirai:'星降 未来',reika:'如月 麗華',komugi:'日高 こむぎ'}[state.chosenIdol]||'見習いアイドル');
 if($('homeGreetingName'))$('homeGreetingName').textContent=idolLabel;
 if($('homeIdolName'))$('homeIdolName').textContent=idolLabel;
 const sessionNote=$('homeSessionNote');if(sessionNote){sessionNote.querySelector('span:last-child').textContent=state.sessionActive?'今日のプロデュース進行中 · 残り '+state.actionsLeft+' 行動': '今日のプロデュースはまだ始まっていません';sessionNote.classList.toggle('is-active',!!state.sessionActive);}
 document.querySelectorAll('[data-start-produce]').forEach(b=>{b.textContent=state.sessionActive?'今日の活動をつづける　→':'プロデュース画面へ　→';});

 ['vocal','dance','charm','bond'].forEach(k=>{ $(k).textContent=state[k];$('bar-'+k).style.width=state[k]+'%'});
 ['lesson','story','live'].forEach(k=>{$('task-'+k).classList.toggle('done',!!state[k+'Done'])});
 if(state.name)$('idolName').value=state.name;
 document.querySelectorAll('[data-color]').forEach(b=>b.classList.toggle('selected',b.dataset.color===state.color));
 document.querySelectorAll('[data-type]').forEach(b=>b.classList.toggle('selected',b.dataset.type===state.type));
 const title=state.name?state.name+'の FIRST LIGHT':'FIRST LIGHT';$('stageName').textContent=title;
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
 const target=$('view-'+name);if(!target)return;
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v===target));
 document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
 const main=document.querySelector('main.main');if(main)main.scrollTop=0;
}
document.querySelectorAll('.nav').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.goto)));
document.querySelectorAll('[data-train]').forEach(b=>b.addEventListener('click',()=>{
 if(!state.sessionActive){showView('produce');toast('まず「プロデュースを開始する」を押してね');return}
 const k=b.dataset.train;const before=state[k];state[k]=Math.min(100,state[k]+5);state.bond=Math.min(100,state.bond+2);state.lessonDone=true;
 const msg=names[k]+'が '+(state[k]-before)+' アップ！ 親愛度 +2。行動を1回使ったよ。';
 $('lessonResult').textContent=msg;$('lessonResult').classList.add('show');$('produceResult').textContent=msg;$('produceResult').classList.add('show');spendAction(msg);
}));
$('saveName').addEventListener('click',()=>{const value=$('idolName').value.trim();if(!value){toast('アイドルの名前を入力してね');return}state.name=value;refresh();toast('「'+value+'」の名前を登録したよ')});
document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{state.color=b.dataset.color;refresh()}));
document.querySelectorAll('[data-type]').forEach(b=>b.addEventListener('click',()=>{state.type=b.dataset.type;refresh()}));
$('saveProfile').addEventListener('click',()=>{if(!$('idolName').value.trim()&&!state.name){$('profileResult').textContent='まずはアイドルの名前を入力してね。';$('profileResult').classList.add('show');return}state.name=$('idolName').value.trim()||state.name;save();refresh();$('profileResult').textContent=state.name+'、プロフィール登録完了！ '+state.type+'なアイドルとして、'+({pink:'桜色',blue:'空色',purple:'ラベンダー',gold:'星明かり'}[state.color])+'の輝きをまとって歩き出そう。';$('profileResult').classList.add('show');toast('プロフィールを保存したよ')});
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
 let combo='';
 if(battle.lastType===c.type){points+=8+battle.combo*3;battle.combo++;combo=' 同タイプ連続！コンボ +'+(8+(battle.combo-1)*3)+'pt！';}
 else if(battle.lastType){points+=5;battle.combo=0;combo=' タイプチェンジ・ブレイク +5pt！';}
 battle.lastType=c.type;battle.player+=points;
 const rival=10+Math.floor(Math.random()*12)+Math.floor((state.vocal+state.dance+state.charm)/30);
 battle.rival+=rival;battle.turn++;battle.waiting=true;battle.hand=[];
 $('battleLog').textContent=c.name+'！ '+points+'pt獲得。ライバルは '+rival+'pt。'+combo;
 if(battle.turn>=3){battle.done=true;battle.waiting=false;const win=battle.player>=battle.rival;const reward=win?30:12;state.fans=(state.fans||0)+reward;state.bond=Math.min(100,state.bond+(win?5:2));$('liveResult').innerHTML=(win?'🏆 合格！':'✦ 惜しい結果…')+'<br>最終スコア '+battle.player+' 対 '+battle.rival+'<br>ファン +'+reward+' / 親愛度 +'+(win?5:2);state.liveDone=true;refresh();spendAction((win?'オーディション合格！':'オーディション終了。')+' ファン +'+reward);}
 else {battle.waiting=true;$('battleNext').style.display='inline-block';$('battleNext').textContent='次のターンへ　→';}
 renderBattle();
}
$('startLive').addEventListener('click',()=>{
 if(!state.sessionActive){toast('まず今日のプロデュースを開始してね');showView('produce');return}
 battle={turn:0,player:0,rival:0,lastType:null,combo:0,hand:drawHand(),done:false,waiting:false};
 $('liveResult').textContent='';$('battleLog').textContent='手札が配られた！ 3ターンでライバルを上回ろう。';renderBattle();
});
$('battleNext').addEventListener('click',()=>{if(!battle||battle.done)return;battle.hand=drawHand();battle.waiting=false;$('battleNext').style.display='none';renderBattle()});


// --- Daily produce session: 3 actions, explicitly started by the player ---
function renderProduce(){
 const active=!!state.sessionActive;
 $('produceHeading').textContent=active?'今日の活動、あと少し！':(state.actionsLeft===0&&state.day>1?'今日の活動は終了しました':'まだ今日の活動を始めていません');
 $('actionsLeft').textContent='行動 '+(active?state.actionsLeft:3)+' / 3';
 $('produceDescription').textContent=active?'何をするか選ぼう。行動回数を使い切ると今日の活動は終了。':(state.actionsLeft===0&&state.day>1?'今日の活動はおしまい。休んで、次の日にまた始めよう。':'開始ボタンを押すまでは、レッスンや会話で行動回数は消費されません。');
 $('startProduce').style.display=active?'none':'inline-block';
 $('produceActions').style.display=active?'grid':'none';
 $('finishProduce').style.display=active?'inline-block':'none';
}
function endProduce(message){
 state.sessionActive=false;state.actionsLeft=0;state.day+=1;
 $('produceResult').textContent=message||'今日の活動は終了！ 頑張った自分をほめてあげよう。';
 $('produceResult').classList.add('show');renderProduce();refresh();toast('今日のプロデュースが終了したよ');
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
refresh=function(){originalRefresh();renderProduce();$('topName').textContent=state.name||'学園生活 '+state.day+'日目';};

refresh();
if(!state.setupDone){$('setupOverlay').classList.add('show');}else if(!state.prologueSeen){$('setupOverlay').classList.add('show');showPrologue();}else{$('appShell').classList.add('game-ready');showView('home');}
