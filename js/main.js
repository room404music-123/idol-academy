(() => {
'use strict';
const $ = id => document.getElementById(id);
const SAVE_KEY = 'etoile-academy-rebuild-save-v1';
const ACTIVE_IDOL_KEY = SAVE_KEY + '-active-idol';
const idolSaveKey = idol => SAVE_KEY + '-idol-' + idol;
const SOUND_KEY = 'etoile-academy-sfx';
const HOME_IDOL_KEY = SAVE_KEY + '-home-idol';
let preparation = { idol: 'mirai', item: 'vocal', costume: 'uniform' };
const idols = {
 mirai:{name:'星降 未来',emoji:'🍒',role:'歌が大好きで、まっすぐ夢を追いかける努力家。',special:'vocal',voice:'「失敗したって、次はもっと輝けるよ！」'},
 reika:{name:'如月 麗華',emoji:'🦋',role:'気品あふれる表現力を持つ、芯の強いアイドル。',special:'charm',voice:'「私らしい輝きで、必ず認めさせてみせるわ。」'},
 komugi:{name:'日高 こむぎ',emoji:'🌻',role:'明るさとキレのあるダンスで、みんなを笑顔にする。',special:'dance',voice:'「いっくよー！ みんなで最高のステージにしよう！」'}
};
const initialCostumeByIdol = {mirai:'starter-mirai',reika:'starter-reika',komugi:'starter-komugi'};
const costumes = [
 {id:'uniform',name:'はじまりの制服',emoji:'🎀',rarity:'N',desc:'基本の衣装。どんな一日にも似合う。',bonus:0},
 {id:'starter-mirai',name:'淡恋チェリー',emoji:'🍒',rarity:'SSR',desc:'星降 未来の初期固有衣装。衣装のみで、スキルカードは付属しない。',bonus:7,owner:'mirai'},
 {id:'starter-reika',name:'蝶の舞',emoji:'🦋',rarity:'SSR',desc:'如月 麗華の初期固有衣装。衣装のみで、スキルカードは付属しない。',bonus:7,owner:'reika'},
 {id:'starter-komugi',name:'輝く向日葵ワンピース',emoji:'🌻',rarity:'SSR',desc:'日高 こむぎの初期固有衣装。衣装のみで、スキルカードは付属しない。',bonus:7,owner:'komugi'},
 {id:'starlight',name:'スターライト',emoji:'🌟',rarity:'R',desc:'歌の評価が少し上がるステージ衣装。',bonus:2},
 {id:'moon',name:'ムーンリット',emoji:'🌙',rarity:'SR',desc:'集中力が増す夜色の衣装。',bonus:4},
 {id:'crown',name:'プリズムクラウン',emoji:'👑',rarity:'SSR',desc:'大舞台で伝説を作る特別な衣装。',bonus:7},
 {id:'bloom',name:'ブルームドレス',emoji:'🌸',rarity:'SR',desc:'ファンの心をつかむ華やかなドレス。',bonus:4},
 {id:'neon',name:'ネオンビート',emoji:'💜',rarity:'R',desc:'ダンスの勢いを引き出す衣装。',bonus:2}
];
const eventPool = [
 {icon:'📱',title:'謎の匿名メッセージ',body:'「フェスのセンターは、あなたじゃない方がいい」知らないアカウントから届いた。どうする？',choices:[['仲間に相談する','bond',3,'ひとりで抱えないことにした。仲間との信頼が深まった。'],['練習で見返す','vocal',3,'悔しさを練習にぶつけた。歌唱力が伸びた。'],['送り主を探る','charm',2,'冷静に情報を集めた。表現力が磨かれた。']]},
 {icon:'🎤',title:'突然の代役オファー',body:'先輩が体調不良で、校内ステージの代役が必要らしい。準備時間はほとんどない。',choices:[['勇気を出して引き受ける','fans',12,'急きょステージに立った。新しいファンが増えた！'],['仲間と一緒なら、と提案','bond',4,'仲間と一緒に挑戦することに。絆が強まった。'],['今回は見送って練習する','dance',3,'基礎を固める時間にした。ダンスが上達。']]},
 {icon:'☕',title:'ライバルの意外な一面',body:'ライバルの凛音が、誰もいない練習室で何度も同じ振りを練習していた。声をかける？',choices:[['アドバイスを交換する','bond',3,'互いの努力を認め合った。絆が少し深まった。'],['勝負を申し込む','fans',8,'次のステージで勝負する約束をした。気合が入る！'],['静かに自分の練習へ','charm',2,'相手の努力に刺激を受けた。表現力が上がった。']]},
 {icon:'🌧️',title:'雨の日の帰り道',body:'練習帰り、落ち込んでいる後輩を見かけた。予定より帰りが遅くなりそう。',choices:[['話を聞いてあげる','bond',4,'誰かを支えることも、アイドルの大切な仕事。絆が深まった。'],['一緒にダンスを練習','dance',3,'雨音に合わせてステップを踏んだ。ダンスが上達！'],['励ましの歌を贈る','vocal',3,'歌に気持ちを込めた。歌唱力が上がった。']]},
 {icon:'📸',title:'バズるチャンス！',body:'あなたの練習動画が少し話題に。今なら発信次第で注目を集められそう。',choices:[['歌のワンフレーズを投稿','fans',15,'動画が広がり、ファンが増えた！'],['仲間との裏側を投稿','bond',3,'飾らない姿が好評。仲間との絆も深まった。'],['次の完成度を優先する','charm',3,'焦らず作品を磨くことにした。表現力が上がった。']]},
 {icon:'🧁',title:'差し入れ争奪戦',body:'練習室に限定スイーツが届いた。最後のひとつをめぐって仲間と目が合う。',choices:[['半分こしよう','bond',4,'分け合ったおいしさで、場が和んだ。絆が深まった。'],['早食い勝負をする','fans',5,'なぜか見ていた後輩にウケた。ファンが少し増えた。'],['糖分を補給して練習','vocal',2,'元気を取り戻した。歌唱力が上がった。']]},
 {icon:'📰',title:'根も葉もないうわさ',body:'校内掲示板に、あなたについての妙なうわさが書かれている。',choices:[['事実を落ち着いて説明','charm',3,'誠実な対応で誤解が解けた。表現力が上がった。'],['仲間に支えてもらう','bond',4,'味方がいると実感できた。絆が深まった。'],['ステージで実力を示す','fans',10,'パフォーマンスで空気を変えた。ファンが増えた！']]}
];
let state;
let pendingEvent = null;
let battle = null;
let toastTimer;
function freshState(name='ルミ', idol='mirai') {
 const stats={vocal:12,dance:12,charm:12,bond:10};
 stats[idols[idol].special]+=7;
 const starter=initialCostumeByIdol[idol]||'starter-mirai';
 return {name:name||'ルミ',idol,fairyName:name||'ルミ',prologueSeen:false,productionActive:false,day:1,stats,fans:0,jewels:100,money:500,tickets:1,lessonLevels:{vocal:1,dance:1,charm:1},costumeLevels:{uniform:0,[starter]:0},runCount:0,actions:2,doneActions:[],sessionStarted:false,storyIndex:0,storySeen:[],logs:[],eventDays:[],closet:['uniform'],equipped:'uniform',pendingStarter:starter,ending:false,won:false,liveAttempted:false,liveScore:0,sfx:localStorage.getItem(SOUND_KEY)!=='off'};
}
function loadState(){try{const activeIdol=localStorage.getItem(ACTIVE_IDOL_KEY);const raw=(activeIdol&&localStorage.getItem(idolSaveKey(activeIdol)))||localStorage.getItem(SAVE_KEY);if(!raw)return null;const s=JSON.parse(raw);if(!s||!s.stats||!Number.isFinite(s.day))return null;if(s.idol==='meru')s.idol='reika';if(s.idol==='setsuna')s.idol='komugi';if(!idols[s.idol])s.idol='mirai';s.closet=Array.isArray(s.closet)?s.closet:['uniform'];const starter=initialCostumeByIdol[s.idol]||'starter-mirai';s.closet=Array.isArray(s.closet)?s.closet.filter(id=>id==='uniform'||!String(id).startsWith('starter-')||id===starter):['uniform'];if(!s.equipped||!s.closet.includes(s.equipped))s.equipped='uniform';s.costumeLevels=s.costumeLevels||{uniform:0};if(!(starter in s.costumeLevels))s.costumeLevels[starter]=0;s.money=Number.isFinite(s.money)?s.money:500;s.tickets=Number.isFinite(s.tickets)?s.tickets:1;s.fairyName=typeof s.fairyName==='string'&&s.fairyName?s.fairyName:(s.name||'ルミ');s.name=s.fairyName;s.prologueSeen=!!s.prologueSeen;s.productionActive=!!s.productionActive;s.lessonLevels=s.lessonLevels||{vocal:1,dance:1,charm:1};s.costumeLevels=s.costumeLevels||{uniform:0};s.runCount=Number.isFinite(s.runCount)?s.runCount:0;s.lifetimeFans=Number.isFinite(s.lifetimeFans)?s.lifetimeFans:s.fans||0;return s;}catch(e){return null;}}
function save(){try{if(state&&state.idol){localStorage.setItem(SAVE_KEY,JSON.stringify(state));localStorage.setItem(idolSaveKey(state.idol),JSON.stringify(state));localStorage.setItem(ACTIVE_IDOL_KEY,state.idol);}}catch(e){}}

const prologuePages = {
 mirai:[
  '私が未来と出会ったのは、10年以上前のことだった。\n\n未来（幼少期）「あたしのようせいさん、まだかなぁ？」\n\n私が姿を現すと、未来はぱっと笑顔になった。\n\n未来（幼少期）「わあ！ ようせいさんだあ！」',
  '未来（幼少期）「ねえねえ、おなまえは？」\n\nあなた「私は「＋FAIRY＋」だよ。」\n\n未来（幼少期）「＋FAIRY＋！ これからよろしくね！」\n\nそれから、私は未来のそばで、たくさんの時間を過ごしてきた。',
  '＊　＊　＊\n\nそして今日。アイドル養成学園の入学式を終えた未来は、椅子に座るなり机に突っ伏した。\n\n未来「スピーチ、めっちゃ緊張したー！！」\n\nあなた「でも、ちゃんとできてたよ。」\n\n未来「そうかな？」\n\nあなた「うん。中学でも頑張ってたじゃん！」\n\n未来は照れくさそうに笑った。',
  '未来「でも、これからが本番だよね！ ここには夢を叶えようって頑張ってる人がたくさんいるんだもん。」\n\nあなた「ゆっくり頑張ればいいんだよ。」\n\n未来「うん。でも、誰かの期待を裏切りたくない。頑張るね！」\n\n未来はいつもの明るい笑顔を見せた。それでも、私は少し心配だった。\n\nあなた（心配だな……。）\n\n未来が自分の気持ちを置き去りにしてしまわないように。私はこれからも、そばで見守っていこう。\n\n――星降 未来の、新しい毎日が始まる。'
 ],
 reika:[
  '私が麗華と出会ったのは、10年以上前のことだった。\n\n麗華（幼少期）「物音……だれ？」\n\nあなた「あ、えーっと……」\n\n麗華は不思議そうに私を見つめた。怖がるでもなく、ただ静かに私を見極めようとしているようだった。',
  'あなた「私は妖精だよ。これから麗華のそばにいるんだ。」\n\n麗華（幼少期）「……ふうん。あなたの名前は？」\n\nあなた「＋FAIRY＋だよ。」\n\n麗華（幼少期）「そう。よろしく。」\n\nあまりにもあっさりした返事に、私は少し拍子抜けした。けれど、しばらくして麗華は本から顔を上げた。\n\n麗華（幼少期）「……そこにいてもいいよ。」\n\nそれが麗華なりの歓迎だったのかもしれない。',
  '＊　＊　＊\n\n長い時間が過ぎ、麗華もアイドル養成学園に入学した。\n\n麗華「入学式って案外疲れるね。」\n\nあなた「お疲れさま。緊張した？」\n\n麗華「別に。……ねえ、私は明日から何すればいいの？」\n\nあなた「まだ始まったばかりだし、ゆっくり過ごせばいいよ。友達もいるでしょ？」',
  '麗華「……別にトップアイドルとか目指してないんだけど。」\n\nあなた「うん。麗華がどうしたいかは、麗華が決めればいいんだよ。」\n\n麗華は黙って窓の外を見た。\n\n麗華「……不安だな。」\n\nあなた「そっか。分からないことだらけだもんね。」\n\n麗華「まあ、少しずつ慣れればいいのかな。」\n\n私は麗華の隣に並んだ。夢に向かってまっすぐ走る必要はない。麗華には麗華の歩き方がある。\n\nあなた（明日から楽しみだ！）\n\n――如月 麗華の、新しい毎日が始まる。'
 ],
 komugi:[
  '私がこむぎと出会ったのは、10年以上前のことだった。\n\nあなた「こむぎの夢？」\n\nこむぎ（幼少期）「うん！ うち、アイドルになる！」\n\nこむぎは迷うことなく、目をきらきらさせて答えた。',
  'こむぎ（幼少期）「歌って踊って、みんなを笑顔にするんだ！ うち、絶対アイドルになるからね！」\n\nあなた「素敵な夢だね。応援してるよ。」\n\nこむぎ（幼少期）「約束だよ！」\n\n差し出された小さな指に、私は自分の指を重ねた。\n\nあなた「約束！」',
  '＊　＊　＊\n\nそして今日。入学式を終えたこむぎは、やる気いっぱいに拳を握った。\n\nこむぎ「ふー！ 明日から頑張らなきゃ！」\n\nあなた「頑張りすぎには注意だね。」\n\nこむぎ「えー？ だって、やっとアイドルへの第一歩なんだよ！ 歌もダンスも、もっと上手になりたいもん！」',
  'あなた「うん。でも、ちゃんと休むのも大切だよ。」\n\nこむぎ「よし！ いっぱい頑張って、いっぱい休む！」\n\nこむぎ「ねえ、明日からも一緒だよね？」\n\nあなた「もちろん。私は＋FAIRY＋。ずっとこむぎのそばにいるよ。」\n\nこむぎ「うおおおお！ うちの底力見せてやる！」\n\nあなた「わっ！？ 急に大声出さないでよ！」\n\nこむぎ「あははっ！ ごめんごめん！」\n\nあなた（元気なのはいいこと！）\n\nこむぎの明るさは、これから出会う誰かの背中も押すのだろう。楽しいことばかりではないかもしれない。それでも、私はこむぎの隣で一緒に歩いていく。\n\n――日高 こむぎの、新しい毎日が始まる。'
 ]
};
function showPrologue(returnTo='home'){
 const idol=state.idol||'mirai', sourcePages=prologuePages[state.idol]||prologuePages.mirai, char=idols[idol].name, fairyName=state.name||state.fairyName||'ルミ';
 // Keep the original wording, but show only one sentence at a time.
 const pages=sourcePages.flatMap(page=>page.split(/\n\n+/).flatMap(paragraph=>paragraph.match(/[^。！？]+(?:。|！|？)(?:」)?|[^。！？]+$/g)||[]).map(line=>line.trim()).filter(Boolean));
 let index=0;
 $('setupOverlay').classList.remove('show');
 const screen=$('storyScreen');screen.classList.add('show');screen.setAttribute('aria-hidden','false');
 screen.innerHTML='<header class="fairy-story-top"><div class="fairy-story-brand">✦ Étoile Academy <small>PROLOGUE · はじまりの約束</small></div><button id="prologueSkip" class="fairy-story-skip">スキップ ×</button></header><main class="fairy-story-main"><div class="fairy-story-stars">✧　✦　⋆　✦　✧</div><div class="fairy-story-chapter">PROLOGUE · '+esc(char)+' とあなたの物語</div><div class="fairy-story-art">'+idols[idol].emoji+'</div><div class="fairy-story-name">'+esc(char)+' ＆ '+esc(state.name||state.fairyName||'ルミ')+'（あなた／妖精）</div><div class="fairy-story-dialogue"><div id="prologueCount"></div><p id="prologueText"></p></div><div class="fairy-story-controls"><button id="prologuePrev" class="secondary">← 前へ</button><button id="prologueNext" class="primary">次へ　→</button></div></main>';
 const finish=()=>{state.prologueSeen=true;save();screen.classList.remove('show');screen.setAttribute('aria-hidden','true');if(state.ending){showFestivalEnding();return;}renderHome();renderPlan();renderStory();renderLive();renderCloset();showScreen(returnTo==='story'?'story':'home');toast(returnTo==='story'?'プロローグを読み直したよ。':'アイドルとの約束を胸に、学園生活が始まったよ！');};
 const render=()=>{$('prologueCount').textContent='PAGE '+String(index+1).padStart(2,'0')+' / '+String(pages.length).padStart(2,'0');$('prologueText').textContent=pages[index].replaceAll('＋FAIRY＋',fairyName);$('prologuePrev').disabled=index===0;$('prologueNext').textContent=index===pages.length-1?'学園生活へ　✦':'次へ　→';};
 $('prologuePrev').addEventListener('click',()=>{if(index>0){index--;render();}});$('prologueNext').addEventListener('click',()=>{if(index<pages.length-1){index++;render();}else finish();});$('prologueSkip').addEventListener('click',finish);render();
}
function prepareIntro(){
 const saved=state&&state.stats;
 const storedName=localStorage.getItem(SAVE_KEY+'-fairy-name');
 const nameLabel=document.querySelector('label[for="playerName"]');
 const nameInput=$('playerName');
 const nameNote=nameInput.nextElementSibling;
 const showName=!storedName;
 if(nameLabel)nameLabel.hidden=!showName;
 nameInput.hidden=!showName;
 if(nameNote&&nameNote.classList.contains('tiny-note'))nameNote.hidden=!showName;
 nameInput.value=saved?(state.fairyName||state.name||storedName||'ルミ'):(storedName||'ルミ');
 document.querySelectorAll('.idol-pick').forEach(b=>b.classList.toggle('selected',b.dataset.idol===(saved?state.idol:(localStorage.getItem(ACTIVE_IDOL_KEY)||'mirai'))));renderCostumeChoices();$('beginGame').textContent='物語を始める →';
 $('setupError').textContent='';$('setupOverlay').classList.add('show');
}

function clamp(v,min=0,max=100){return Math.max(min,Math.min(max,Number(v)||0));}
function statName(key){return ({vocal:'歌唱力',dance:'ダンス',charm:'表現力',bond:'絆'})[key]||key;}
function toast(msg){const el=$('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400);}
let audioCtx=null;
function sfx(kind='tap'){if(!state?.sfx)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;audioCtx=audioCtx||new C();if(audioCtx.state==='suspended')audioCtx.resume();const now=audioCtx.currentTime;const seq=kind==='win'?[660,830,990]:kind==='event'?[440,660]:kind==='live'?[523,659,784]:[kind==='rare'?880:kind==='card'?590:440];seq.forEach((hz,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=kind==='rare'?'triangle':'sine';o.frequency.setValueAtTime(hz,now+i*.1);g.gain.setValueAtTime(.0001,now+i*.1);g.gain.exponentialRampToValueAtTime(.09,now+i*.1+.015);g.gain.exponentialRampToValueAtTime(.0001,now+i*.1+.16);o.connect(g);g.connect(audioCtx.destination);o.start(now+i*.1);o.stop(now+i*.1+.17);});}catch(e){}}
function updateSoundButton(){$('soundToggle').textContent=state?.sfx?'🔊 SE ON':'🔇 SE OFF';$('soundToggle').setAttribute('aria-pressed',String(!!state?.sfx));}
function showScreen(screen){
 const productionScreens=['plan','upgrade','live'];
 if(productionScreens.includes(screen)&&!state?.productionActive){toast('育成を始めると利用できるよ。');return;}
 document.querySelectorAll('.screen').forEach(el=>el.classList.toggle('active',el.id==='screen-'+screen));
 document.querySelectorAll('.nav[data-screen]').forEach(el=>el.classList.toggle('active',el.dataset.screen===screen));
 document.querySelectorAll('[data-production-nav]').forEach(el=>el.hidden=!state?.productionActive);
 if(screen==='home')renderHome();if(screen==='plan')renderPlan();if(screen==='gacha')renderGacha();if(screen==='upgrade')renderUpgrade();if(screen==='story')renderStory();if(screen==='live')renderLive();if(screen==='closet')renderCloset();window.scrollTo({top:0,behavior:'smooth'});
}
function statusCard(key,icon){const v=state.stats[key];return '<div class="stat-card"><div class="stat-top">'+statName(key)+'<span class="stat-icon">'+icon+'</span></div><div class="stat-number">'+v+'<small> / 100</small></div><div class="meter"><span style="width:'+v+'%"></span></div></div>';}
function nextStoryText(){const s=state.storyIndex;const char=idols[state.idol].name;const lines=[
 {label:'EPISODE 01 · THE FIRST STEP',title:'「センターに立ちたい」',body:'入学して初めての朝。掲示板に貼られた学園フェスのポスターを見て、あなたは思わず足を止めた。\n\n7日後、学園でいちばん大きなステージが開かれる。けれど、同じ夢を追うライバル・凛音は、すでに完成されたスターだった。\n\n'+char+'「ねえ。簡単じゃないのはわかってる。でも……本気で目指してみない？」',choices:[['「絶対にセンターを取ろう！」','bold'],['「まずは自分たちらしいステージを作ろう」','kind'],['「仲間を集めて作戦会議しよう」','team']]},
 {label:'EPISODE 02 · A RIVAL',title:'「勝ちたい理由」',body:'練習室の鏡越しに、凛音と目が合った。\n\n凛音「勝つって言うだけなら簡単。あなたは、何を見せてくれるの？」\n\n言い返したい。でも、彼女の言葉が胸に残る。',choices:[['正面から勝負を宣言する','bold'],['相手の実力を認め、学べるところを探す','kind'],['自分たちの強みを仲間と話し合う','team']]},
 {label:'EPISODE 03 · THE CRACK',title:'「うまくいかない日」',body:'何度合わせても、振り付けがそろわない。焦りから言葉が強くなって、練習室に沈黙が落ちた。\n\n'+char+'「……このままじゃ、みんなバラバラになっちゃう」\n\nあなたは、どうする？',choices:[['いったん休憩して、全員の話を聞く','kind'],['目標を決め直して、もう一度合わせる','bold'],['それぞれの得意分野を活かす構成に変える','team']]},
 {label:'EPISODE 04 · THE SECRET',title:'「ライバルの涙」',body:'夜の練習室。ひとりで残っていた凛音が、初めて弱音をこぼした。\n\n凛音「期待されるほど、失敗できなくなる。あなたたちがまぶしく見える日もあるんだ」\n\nライバルは、ただの敵じゃないのかもしれない。',choices:[['「私も怖いよ」と本音を話す','kind'],['「それでもステージでは全力で勝負しよう」','bold'],['一緒に練習しようと誘う','team']]},
 {label:'EPISODE 05 · THE CHOICE',title:'「最後の作戦会議」',body:'フェスまであと少し。歌を磨くか、ダンスをそろえるか、それとも表現で勝負するか。全部を完璧にする時間はない。\n\n'+char+'「何を選んでも、私たちのステージ。最後まで信じてる」',choices:[['歌を主役にする','vocal'],['ダンスを主役にする','dance'],['表現と絆を主役にする','charm']]}
];return lines[Math.min(s,lines.length-1)];}
const MISSION_KEY='etoile-academy-missions-v1';
function missionDate(d=new Date()){return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}
function missionData(){let x;try{x=JSON.parse(localStorage.getItem(MISSION_KEY)||'{}')}catch(e){x={}}if(!x||typeof x!=='object')x={};const today=missionDate();if(x.day!==today){x.day=today;x.daily={actions:0,live:0,story:0};x.claimed=[];x.loginClaimed=false;}const d=new Date();d.setDate(d.getDate()-((d.getDay()+6)%7));const week=missionDate(d);if(x.week!==week){x.week=week;x.weekly={actions:0,live:0,story:0};x.weekClaims=[];}x.daily=x.daily||{actions:0,live:0,story:0};x.weekly=x.weekly||{actions:0,live:0,story:0};x.claimed=x.claimed||[];x.weekClaims=x.weekClaims||[];if(x.lastLogin!==today){const y=new Date();y.setDate(y.getDate()-1);x.streak=x.lastLogin===missionDate(y)?(x.streak||0)+1:1;x.lastLogin=today;x.loginClaimed=false;}try{localStorage.setItem(MISSION_KEY,JSON.stringify(x))}catch(e){}return x;}
function missionSave(x){try{localStorage.setItem(MISSION_KEY,JSON.stringify(x))}catch(e){}}
function missionRewards(r){state.jewels=(state.jewels||0)+(r.jewels||0);state.money=(state.money||0)+(r.money||0);state.fans=(state.fans||0)+(r.fans||0);state.tickets=(state.tickets||0)+(r.tickets||0);save();}
function renderMissions(){const d=missionData();const defs=[{id:'actions',label:'行動を2回完了',goal:2,reward:{jewels:20,money:50},daily:true},{id:'live',label:'ライブに挑戦',goal:1,reward:{jewels:25,fans:10},daily:true},{id:'story',label:'ストーリーを1回選択',goal:1,reward:{money:80,jewels:10},daily:true},{id:'actions',label:'行動を合計10回',goal:10,reward:{jewels:80,money:250}},{id:'live',label:'ライブに合計3回',goal:3,reward:{jewels:100,fans:50}},{id:'story',label:'ストーリーを合計3回',goal:3,reward:{money:300,tickets:1}}];function row(m){const p=m.daily?d.daily:d.weekly;const claims=m.daily?d.claimed:d.weekClaims;const n=Math.min(m.goal,p[m.id]||0);const key=(m.daily?'d:':'w:')+m.id;const claimed=claims.includes(key);const rewards=Object.entries(m.reward).map(([k,v])=>(({jewels:'💎',money:'💰',fans:'♡',tickets:'🎟️'}[k])+'+'+v)).join(' ');return '<div class="mission-row"><div class="mission-info"><strong>'+m.label+'</strong><small>'+n+'/'+m.goal+' · '+rewards+'</small><div class="mission-meter"><span style="width:'+(n/m.goal*100)+'%"></span></div></div><button class="mission-claim" data-claim-mission="'+key+'" '+(claimed||n<m.goal?'disabled':'')+'>'+(claimed?'受取済':n>=m.goal?'受け取る':'未達成')+'</button></div>'; }const login=50+Math.min(6,(d.streak||1)-1)*10;$('missionPanel').innerHTML='<div class="section-title"><h3>ミッション＆ログインボーナス</h3><small>報酬を受け取ろう</small></div><div class="mission-columns"><section class="card"><div class="card-head"><h3>☀ ログインボーナス</h3><span class="tag">連続 '+d.streak+' 日</span></div><p class="mission-login-note">今日の報酬：💎 '+login+'</p><button class="primary" data-claim-login '+(d.loginClaimed?'disabled':'')+'>'+(d.loginClaimed?'受取済':'受け取る')+'</button></section><section class="card"><div class="card-head"><h3>✦ デイリーミッション</h3><span class="tag">毎日更新</span></div>'+defs.filter(m=>m.daily).map(row).join('')+'</section><section class="card"><div class="card-head"><h3>🏆 ウィークリーミッション</h3><span class="tag">月曜更新</span></div>'+defs.filter(m=>!m.daily).map(row).join('')+'</section></div>';}
function missionProgress(type){const d=missionData();d.daily[type]=(d.daily[type]||0)+1;d.weekly[type]=(d.weekly[type]||0)+1;missionSave(d);}
function claimMission(key){const d=missionData();const daily=key.startsWith('d:');const id=key.slice(2);const m=(daily?[{id:'actions',goal:2,reward:{jewels:20,money:50}},{id:'live',goal:1,reward:{jewels:25,fans:10}},{id:'story',goal:1,reward:{money:80,jewels:10}}]:[{id:'actions',goal:10,reward:{jewels:80,money:250}},{id:'live',goal:3,reward:{jewels:100,fans:50}},{id:'story',goal:3,reward:{money:300,tickets:1}}]).find(x=>x.id===id);const p=daily?d.daily:d.weekly,claims=daily?d.claimed:d.weekClaims;if(!m||claims.includes(key)||((p[id]||0)<m.goal)){toast('まだ達成していないよ。');return;}claims.push(key);missionRewards(m.reward);missionSave(d);renderHome();toast('ミッション報酬を受け取ったよ！');}
function claimLogin(){const d=missionData();if(d.loginClaimed){toast('今日は受取済みだよ。');return;}d.loginClaimed=true;missionRewards({jewels:50+Math.min(6,(d.streak||1)-1)*10});missionSave(d);renderHome();toast('ログインボーナスを受け取ったよ！');}
function renderHome(){
 const homeIdol=localStorage.getItem(HOME_IDOL_KEY)||state.idol||'mirai';
 const idol=idols[homeIdol]||idols.mirai;
 const lines={
  mirai:['おかえり！ 今日も一緒に過ごそうね！','今日は何してたの？ あたしにも聞かせて！','あなたが来てくれると、元気が出るんだ！'],
  reika:['来てくれたのね。ふふ、待っていたわ。','今日は少しゆっくりしていかない？','あなたと話す時間、嫌いじゃないわ。'],
  komugi:['おっ、来た来た！ 今日もよろしくね！','うち、今日はなんだかいいことが起きそうな気がする！','一緒にいると楽しいね！']
 };
 const quotes=lines[homeIdol]||lines.mirai;
 const quote=quotes[(state.homeLineIndex||0)%quotes.length];
 const picker=Object.entries(idols).map(([id,x])=>'<button class="home-idol-choice '+(id===homeIdol?'selected':'')+'" data-home-idol="'+id+'">'+x.emoji+' '+x.name+'</button>').join('');
 $('dayBadge').textContent='MY PAGE';
 $('screen-home').innerHTML='<div class="mypage-top"><span class="eyebrow">ÉTOILE ACADEMY · MY PAGE</span><span class="mypage-day">日常のひととき</span></div><section class="mypage-stage idol-'+homeIdol+'"><div class="mypage-glow"></div><div class="mypage-copy"><span class="eyebrow">WELCOME BACK</span><h1>'+esc(idol.name)+'</h1><p>'+esc(idol.role)+'</p><div class="idol-dialogue"><span class="dialogue-label">VOICE</span><p id="homeIdolLine">'+esc(quote)+'</p><button class="dialogue-next" data-home-line>別のセリフを聞く ↻</button></div></div><div class="mypage-portrait" aria-label="'+esc(idol.name)+'">'+idol.emoji+'</div><div class="mypage-caption">TODAY WITH　✦　'+esc(idol.name)+'</div></section><section class="home-idol-setting"><span class="eyebrow">HOME IDOL</span><strong>ホームに遊びに来てくれるアイドル</strong><div class="home-idol-choices">'+picker+'</div></section><section class="home-production-entry"><div><span class="eyebrow">PRODUCE MODE</span><h2>新しいプロデュースを始めよう</h2><p>アイドルとアイテムを選んで、7日間の挑戦へ。</p></div><button class="primary" data-start-production>育成を始める　→</button></section><div class="mypage-shortcuts"><button class="mypage-link" data-go="gacha"><span>✧</span><b>ガチャ</b><small>衣装との出会い</small></button><button class="mypage-link" data-go="closet"><span>♔</span><b>衣装ルーム</b><small>衣装の着せ替え</small></button><button class="mypage-link" data-go="story"><span>▤</span><b>ストーリー</b><small>物語を読む</small></button></div>';
}
function renderPlan(){
 if(!state.productionActive){$('screen-plan').innerHTML='<div class="empty-state">プロデュースを始めると、ここで7日間の育成が始まるよ。</div>';return;}
 const disabled=state.ending||state.actions<=0;
 const actions=[
 {id:'vocal',icon:'🎤',name:'ボーカル特訓',desc:'歌唱力を伸ばす。ライブの歌唱ターンで有利。',gain:'歌唱力 +7',cost:'💎 10',key:'vocal'},
 {id:'dance',icon:'💃',name:'ダンス練習',desc:'動きを磨いて、ライブのダンスターンを強化。',gain:'ダンス +7',cost:'💎 10',key:'dance'},
 {id:'charm',icon:'✨',name:'表現レッスン',desc:'魅せ方を研究。観客の心をつかむ力が上がる。',gain:'表現力 +7',cost:'💎 10',key:'charm'},
 {id:'bond',icon:'🫶',name:'相棒と作戦会議',desc:'本音を話すと、絆が深まってライブ連携が強くなる。',gain:'絆 +8',cost:'無料',key:'bond'}
 ];
 $('screen-plan').innerHTML='<div class="section-head"><div class="eyebrow">DAILY STRATEGY · DAY '+Math.min(state.day,7)+'</div><h2>今日は何をする？</h2><p>1日2回の行動を選ぼう。得意を伸ばすか、弱点を補うか。選んだ行動は取り消せないよ。</p></div><div class="produce-status"><div class="stats-grid">'+statusCard('vocal','♫')+statusCard('dance','♧')+statusCard('charm','✧')+statusCard('bond','♡')+'</div><div class="produce-wallet">💎 '+state.jewels+'　♡ '+state.fans+'　💰 '+(state.money||0)+'</div></div><div class="section-title"><h3>残り行動：'+(state.ending?0:state.actions)+' / 2</h3><small>今のジュエル：💎 '+state.jewels+'</small></div><div class="action-grid">'+actions.map(a=>'<button class="action-card" data-action="'+a.id+'" '+(disabled||state.doneActions.includes(a.id)?'disabled':'')+'><span class="action-icon">'+a.icon+'</span><span class="action-copy"><strong>'+a.name+(state.doneActions.includes(a.id)?' ✓':'')+'</strong><p>'+a.desc+'</p><span class="action-meta"><span class="tag">'+a.gain+'</span><span class="tag">'+a.cost+'</span></span></span></button>').join('')+'</div><div class="notice">ヒント：得意な能力だけを伸ばすのもアリ。でも、フェスでは3つの能力すべてが試される。1日に同じ行動は1回まで。</div><div class="card"><div class="card-head"><h3>今日のログ</h3><span class="tag">'+state.logs.length+'件</span></div><div class="log-list">'+(state.logs.slice(-4).reverse().map(l=>'<div class="log-item"><span>'+l.icon+'</span><div>'+esc(l.text)+'</div></div>').join('')||'<div class="empty-state">まだ何も起きていない。<br>最初の一歩を選ぼう！</div>')+'</div></div>';
}
function renderStory(){
 const s=nextStoryText();const already=state.storySeen.includes(state.storyIndex);
 const episodeTitles=['「センターに立ちたい」','「勝ちたい理由」','「うまくいかない日」','「ライバルの涙」','「最後の作戦会議」'];
 $('screen-story').innerHTML='<div class="section-head"><div class="eyebrow">STORY MODE · '+s.label+'</div><h2>学園フェスまでの7日間</h2><p>読み終えたエピソードも、いつでも選んで読み直せるよ。</p></div><div class="episode-archive"><button class="secondary wide" data-read-prologue>✦ プロローグを読み直す</button><div class="eyebrow">EPISODE ARCHIVE · 読み直す</div><div class="choice-stack episode-archive-list">'+episodeTitles.map((title,i)=>'<button class="choice-btn" data-read-story="'+i+'">'+(state.storySeen.includes(i)?'✓ ':'')+'EP '+String(i+1).padStart(2,'0')+'　'+title+(i===state.storyIndex?'　◀':'')+'</button>').join('')+'</div></div><div class="story-layout"><div class="story-stage"><div class="scene-label">'+s.label+'</div><h2>'+s.title+'</h2><p>'+esc(s.body)+'</p>'+(already?'<div class="notice">読了済みエピソード（選択結果は保存されています）。何度でも読み直せるよ。</div>':'<div class="choice-stack">'+s.choices.map((c,i)=>'<button class="choice-btn" data-story-choice="'+i+'">'+['A','B','C'][i]+'　'+c[0]+'</button>').join('')+'</div>')+(state.storyIndex<4?'<button class="secondary wide" data-next-story>次のエピソードへ →</button>':'<div class="notice">フェス本番が近い。最後の準備をしよう。</div>')+'</div><aside class="story-side"><div class="cast-big">'+idols[state.idol].emoji+'</div><strong>'+esc(idols[state.idol].name)+'</strong><p>'+esc(idols[state.idol].role)+'</p><div class="eyebrow">YOUR CHOICES</div><div class="log-list">'+(state.storySeen.length?state.storySeen.map(i=>'<div class="log-item"><span>✦</span><div>エピソード '+(i+1)+' をクリア</div></div>').join(''):'<div class="empty-state">まだ選択していないよ。</div>')+'</div></aside></div>';
}
function renderLive(){if(!state.productionActive){$('screen-live').innerHTML='<div class="empty-state">プロデュース開始後にオーディションへ挑戦できるよ。</div>';return;}
 const live=$('screen-live');
 if(battle&&!battle.finished){
  live.innerHTML='<div class="section-head"><div class="eyebrow">AUDITION BATTLE · TURN '+(battle.turn+1)+' / 3</div><h2>カードを選んで、ステージを制せ！</h2><p>ターンごとに得意分野を活かそう。能力値に加えて、同じタイプを連続で出すとコンボボーナス！</p></div><div class="live-stage"><div class="eyebrow">LIVE BATTLE · VS RINNE</div><h2>スポットライトは、誰のもの？</h2><p>3ターンの合計スコアで勝負。衣装ボーナスも発動するよ。</p><div class="live-metrics"><div class="live-metric"><small>あなた</small><strong>'+battle.player+'</strong></div><div class="live-metric"><small>凛音</small><strong>'+battle.rival+'</strong></div><div class="live-metric"><small>コンボ</small><strong>'+battle.combo+'x</strong></div></div><div class="performance-options">'+battle.hand.map((c,i)=>'<button class="performance-card" data-play-card="'+i+'"><span class="picon">'+c.icon+'</span><strong>'+c.name+'</strong><small>'+c.typeName+' · 基礎 '+c.base+'pt<br>'+c.desc+'</small></button>').join('')+'</div><div class="live-log" id="battleLog">'+esc(battle.log||'手札から1枚選ぼう。')+'</div>'+(battle.waiting?'<button class="primary wide" data-next-turn>次のターンへ →</button>':'')+'</div>';
  return;
 }
 if(battle&&battle.finished){
  live.innerHTML='<div class="section-head"><div class="eyebrow">AUDITION RESULT</div><h2>ステージの結果</h2></div><div class="ending-card"><div class="end-icon">'+(battle.won?'🏆':'✨')+'</div><h2>'+(battle.won?'勝利！あなたたちのステージ！':'惜敗。でも、ここから強くなる。')+'</h2><p>最終スコア '+battle.player+' 対 '+battle.rival+'<br>ファン +'+battle.rewardFans+' · ジュエル +'+battle.rewardJewels+(battle.won?' · 絆 +3':' · 絆 +1')+'</p><button class="primary" data-go="home">ホームへ戻る →</button> <button class="secondary" data-go="plan">今日の行動へ</button>'+(state.actions<=0&&!state.ending?(state.day>=7?'<button class="primary wide" data-festival-ending>最終オーディションの結果をフェス結果へ →</button>':'<button class="secondary wide" data-next-day>休んで次の日へ →</button>'):'')+'</div>';
  return;
 }
 live.innerHTML='<div class="section-head"><div class="eyebrow">AUDITION BATTLE · LIVE PERFORMANCE</div><h2>'+(state.ending?'学園フェスの結果':'オーディションに挑戦')+'</h2><p>能力と選択がスコアに反映される、3ターンの戦略バトル。勝てばファンとジュエルを獲得できる。</p></div><div class="live-stage"><div class="eyebrow">LIVE BATTLE · VS RINNE</div><h2>'+(state.day>=7?'学園フェス本番！':'校内オーディション')+'</h2><p>'+(state.day>=7?'7日間の努力を、最後のステージにぶつけよう。':'本番に向けて今の実力を試そう。')+' ライブ参加は1日1回。参加費は'+(state.day>=7?'無料（最終オーディション）':'💎20')+'。</p><div class="live-metrics"><div class="live-metric"><small>歌唱力</small><strong>'+state.stats.vocal+'</strong></div><div class="live-metric"><small>ダンス</small><strong>'+state.stats.dance+'</strong></div><div class="live-metric"><small>表現力</small><strong>'+state.stats.charm+'</strong></div></div><div class="live-log">相棒：'+esc(idols[state.idol].name)+' · 衣装：'+esc(costumes.find(c=>c.id===state.equipped)?.name||'はじまりの制服')+'<br>得意タイプのカードを選ぶと、スコアが大きく伸びる。</div><button class="primary wide" data-start-live '+(state.liveAttempted||state.jewels<20?'disabled':'')+'>'+(state.liveAttempted?'今日は挑戦済み':'ライブを始める　💎20 →')+'</button>'+(state.jewels<20?'<p class="notice">ジュエルが足りないよ。行動やイベントで獲得しよう。</p>':'')+'</div>';
}
function renderUpgrade(){if(!state.productionActive){$('screen-upgrade').innerHTML='<div class="empty-state">プロデュース開始後に利用できるよ。</div>';return;}
 const levels=state.lessonLevels||{vocal:1,dance:1,charm:1};
 const labels={vocal:'ボーカルレッスン',dance:'ダンスレッスン',charm:'表現レッスン'};
 const icons={vocal:'🎤',dance:'💃',charm:'✨'};
 $('screen-upgrade').innerHTML='<div class="section-head"><div class="eyebrow">TRAINING & ENHANCEMENT</div><h2>育成強化ルーム</h2><p>まず「強化する」を押すと、レベルアップのボタンが出てくるよ。強化した内容は周回後も引き継がれる。</p></div><div class="section-title"><h3>💰 '+(state.money||0)+'　🎟️ '+(state.tickets||0)+'　💎 '+state.jewels+'</h3><small>レッスン最大 Lv.10</small></div><div class="action-grid">'+['vocal','dance','charm'].map(k=>{const lv=levels[k]||1,cost=100*lv;return '<div class="card"><div class="card-head"><h3>'+icons[k]+' '+labels[k]+'</h3><span class="tag">Lv.'+lv+'</span></div><p class="subcopy">'+({vocal:'歌唱力の成長効率を上げる。',dance:'ダンスの成長効率を上げる。',charm:'表現力の成長効率を上げる。'}[k])+'</p><button class="secondary" data-open-upgrade="'+k+'">強化する</button><div class="upgrade-controls" data-upgrade-panel="'+k+'" hidden><p>Lv.'+lv+' → Lv.'+(lv+1)+'　必要なお金：💰 '+cost+'</p><button class="primary" data-upgrade-lesson="'+k+'" '+((state.money||0)<cost||lv>=10?'disabled':'')+'>'+(lv>=10?'最大レベル':'Lv.'+(lv+1)+'に上げる')+'</button></div></div>';}).join('')+'<div class="card"><div class="card-head"><h3>👗 着用衣装の強化</h3><span class="tag">Lv.'+((state.costumeLevels||{})[state.equipped]||0)+'</span></div><p class="subcopy">現在の衣装を強化するたび、ライブボーナスが +2。</p><button class="secondary" data-open-upgrade="costume">強化する</button><div class="upgrade-controls" data-upgrade-panel="costume" hidden><p>必要なお金：💰 '+(150+50*((state.costumeLevels||{})[state.equipped]||0))+'</p><button class="primary" data-upgrade-costume '+((state.money||0)<150+50*((state.costumeLevels||{})[state.equipped]||0)||((state.costumeLevels||{})[state.equipped]||0)>=10?'disabled':'')+'>'+'衣装をLv.'+(((state.costumeLevels||{})[state.equipped]||0)+1)+'に上げる</button></div></div></div>';
}
function renderGacha(){
 $('screen-gacha').innerHTML='<div class="section-head"><div class="eyebrow">COSTUME GACHA</div><h2>衣装ガチャ</h2><p>チケットを使って新しい衣装を獲得しよう。すでに持っている衣装が出た場合はジュエルに変換される。</p></div><div class="gacha-stage"><div class="gacha-stage-art">✧</div><div class="eyebrow">ÉTOILE COLLECTION · PICKUP</div><h2>新しい輝きを、その手に。</h2><div class="gacha-banner">✦　LIMITED COSTUME COLLECTION　✦</div><p>所持チケット：<strong>'+(state.tickets||0)+'</strong> 枚　／　ジュエル：<strong>'+state.jewels+'</strong></p><div class="gacha-actions"><button class="primary" data-gacha '+((state.tickets||0)<1?'disabled':'')+'>1回ガチャを引く　🎟️ ×1</button><button class="secondary" data-buy-ticket '+(state.jewels<35?'disabled':'')+'>チケット交換　💎35</button></div><div id="gachaResult" class="notice" style="display:none"></div></div><div class="gacha-info card"><h3>ガチャについて</h3><p>衣装が重複した場合はレア度に応じたジュエルに変換されるよ。獲得した衣装は「衣装ルーム」で確認できる。</p></div>';
}
function renderCloset(){
 $('screen-closet').innerHTML='<div class="section-head"><div class="eyebrow">COSTUME COLLECTION</div><h2>衣装ルーム</h2><p>獲得した衣装を確認して、ライブで着用する衣装を選ぼう。</p></div><div class="closet-grid">'+costumes.filter(c=>state.closet.includes(c.id)).map(c=>'<div class="costume-card '+(state.equipped===c.id?'equipped':'')+'"><div class="costume-art">'+c.emoji+'</div><span class="rarity">'+c.rarity+' · BONUS +'+c.bonus+'</span><h3>'+c.name+'</h3><p>'+c.desc+'</p><button class="'+(state.equipped===c.id?'secondary':'primary')+'" data-equip="'+c.id+'">'+(state.equipped===c.id?'✓ 着用中':'この衣装を着る')+'</button></div>').join('')+'</div><div class="notice">レア度は N → R → SR → SSR。衣装ボーナスはライブの全ターンに加算されるよ。</div>';
}
function totalPower(){return Math.round((state.stats.vocal+state.stats.dance+state.stats.charm)/3+state.stats.bond*.18);}
function rivalPower(){return 25+Math.min(45,state.day*5);}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function addLog(icon,text){state.logs.push({icon,text});if(state.logs.length>30)state.logs.shift();}
function applyChoice(key,amount,text){if(key==='fans')state.fans+=amount;else if(key==='jewels')state.jewels+=amount;else state.stats[key]=clamp(state.stats[key]+amount);addLog(key==='fans'?'💗':key==='bond'?'♡':'✦',text);save();}
function beginDay(){if(!state.productionActive)return;state.actions=2;state.doneActions=[];state.sessionStarted=true;state.liveAttempted=false;state.liveScore=0;battle=null;state.eventDays=state.eventDays||[];save();showScreen('home');if(state.day<7&&!state.eventDays.includes(state.day)){state.eventDays.push(state.day);const ev=eventPool[Math.floor(Math.random()*eventPool.length)];pendingEvent=ev;showEvent(ev);}else{toast('DAY '+state.day+' 開始！今日の作戦を決めよう。');}}
function showEvent(ev){$('eventKicker').textContent='UNEXPECTED EVENT · DAY '+state.day;$('eventIcon').textContent=ev.icon;$('eventTitle').textContent=ev.title;$('eventBody').textContent=ev.body;$('eventChoices').innerHTML=ev.choices.map((c,i)=>'<button class="choice-btn" data-event-choice="'+i+'">'+['A','B','C'][i]+'　'+c[0]+'</button>').join('');$('eventOverlay').classList.add('show');sfx('event');}
function chooseEvent(i){if(!pendingEvent)return;const c=pendingEvent.choices[i];applyChoice(c[1],c[2],c[3]);$('eventOverlay').classList.remove('show');pendingEvent=null;renderHome();toast('イベント結果：ステータスが変化した！');}
function useAction(id){if(!state.productionActive){toast('プロデュースを開始してね。');return;}if(state.ending){toast('フェスは終了したよ。最初からやり直して別の未来を見よう！');return;}if(state.actions<=0){toast('今日の行動はもう使い切った！');return;}if(state.doneActions.includes(id)){toast('同じ行動は1日1回までだよ。');return;}if(['vocal','dance','charm'].includes(id)){if(state.jewels<10){toast('ジュエルが足りないよ。イベントやライブで集めよう。');return;}state.jewels-=10;const lv=(state.lessonLevels||{})[id]||1;const gain=6+lv;state.stats[id]=clamp(state.stats[id]+gain);state.money=(state.money||0)+20;addLog('✦',statName(id)+'の特訓！ '+statName(id)+' +'+gain+'、報酬 💰20。');}else{state.stats.bond=clamp(state.stats.bond+8);state.stats.vocal=clamp(state.stats.vocal+2);addLog('♡','相棒と作戦会議。絆 +8、歌唱力 +2。');}
 state.doneActions.push(id);state.actions--;missionProgress('actions');sfx('card');save();renderPlan();renderHome();toast('行動完了！ 残り '+state.actions+' 回');if(state.actions===0){setTimeout(()=>offerDayEnd(),450);}}
function offerDayEnd(){if(state.ending||!state.productionActive)return;const existing=document.querySelector('#dayEndModal');if(existing)return;const modal=document.createElement('div');modal.id='dayEndModal';modal.className='overlay show';modal.innerHTML='<div class="modal event-modal"><div class="eyebrow">DAY '+state.day+' COMPLETE</div><div class="big-star">🌙</div><h2>今日の活動、おつかれさま！</h2><p class="modal-lead">今日の行動は終了。明日に進む前に、ライブに挑戦してもいいし、このまま休んでもいい。</p><div class="choice-stack"><button class="primary" data-day-live>オーディションに挑戦する →</button><button class="secondary" data-next-day>休んで次の日へ →</button></div></div>';document.body.appendChild(modal);}
function nextDay(){if(!state.productionActive)return;const m=$('dayEndModal');if(m)m.remove();if(state.day>=7){if(!state.liveAttempted){showScreen('live');toast('最終オーディションに挑戦しよう！');return;}state.ending=true;save();showFestivalEnding();return;}state.day++;beginDay();}
function showFestivalEnding(){state.productionActive=false;state.ending=true;const score=totalPower()+Math.floor(state.fans/10)+(state.liveScore||0);const rival=82+Math.floor(Math.random()*13)+(state.day>=7?8:0);state.won=score>=rival;state.money=(state.money||0)+(state.won?500:250);state.tickets=(state.tickets||0)+(state.won?3:1);save();$('screen-home').innerHTML='<div class="eyebrow">FINAL CHAPTER · SCHOOL FESTIVAL</div><div class="ending-card"><div class="end-icon">'+(state.won?'🏆':'🌠')+'</div><h2>'+(state.won?'あなたたちが、学園の星になった！':'悔しさは、次のステージへの光。')+'</h2><p>7日間の努力、選んだ物語、仲間との絆。すべてを込めたステージの結果は……<br><strong>'+score+' pt vs '+rival+' pt</strong><br>'+(state.won?'観客の歓声が響き渡る。凛音は悔しそうに笑って、あなたに手を差し出した。「次は絶対に負けないから」':'凛音のステージには届かなかった。でも、相棒はあなたの手をぎゅっと握った。「ここで終わりじゃない。もう一度、挑戦しよう」')+'</p><div class="stats-grid">'+statusCard('vocal','♫')+statusCard('dance','♧')+statusCard('charm','✧')+statusCard('bond','♡')+'</div><button class="primary" data-restart>育成を引き継いで周回する ↻</button></div>';document.querySelectorAll('.screen').forEach(el=>el.classList.remove('active'));$('screen-home').classList.add('active');document.querySelectorAll('.nav').forEach(el=>el.classList.remove('active'));toast(state.won?'フェス優勝！ おめでとう！':'フェス終了。次は別の選択を試してみよう。');sfx(state.won?'win':'event');}
const cardPool=[
 {name:'サビで勝負！',type:'vocal',icon:'🎤',base:12,desc:'歌唱力で観客をつかむ'},
 {name:'キレキレターン',type:'dance',icon:'💃',base:12,desc:'ダンスで魅せる'},
 {name:'視線を独り占め',type:'charm',icon:'✨',base:12,desc:'表現力で惹きつける'},
 {name:'ハーモニー',type:'vocal',icon:'♫',base:9,desc:'安定した歌声'},
 {name:'フォーメーション',type:'dance',icon:'❖',base:9,desc:'息の合った動き'},
 {name:'ファンサービス',type:'charm',icon:'♡',base:9,desc:'観客の心をつかむ'}
];
function drawHand(){return Array.from({length:3},()=>({...cardPool[Math.floor(Math.random()*cardPool.length)]}));}
function startLive(){if(!state.productionActive){toast('プロデュースを開始してね。');return;}if(state.ending){toast('フェス本番はホームから確認できるよ。');return;}if(state.liveAttempted){toast('今日はもうライブに挑戦したよ。');return;}if(state.day<7&&state.jewels<20){toast('ジュエルが足りないよ。');return;}if(state.day<7)state.jewels-=20;state.liveAttempted=true;missionProgress('live');battle={turn:0,player:0,rival:0,combo:0,lastType:null,hand:drawHand(),waiting:false,finished:false,won:false,log:'3枚のカードから1枚選ぼう。'};save();sfx('live');renderLive();}
function playCard(i){if(!battle||battle.finished||battle.waiting)return;const c=battle.hand[i];if(!c)return;const stat=state.stats[c.type]||0;let points=c.base+Math.floor(stat*.42)+Math.floor(state.stats.bond*.12);const costume=costumes.find(x=>x.id===state.equipped);points+=(costume?.bonus||0)+2*((state.costumeLevels||{})[state.equipped]||0);let comboText='';if(battle.lastType===c.type){const bonus=5+battle.combo*3;points+=bonus;battle.combo++;comboText=' コンボ +'+bonus+'pt！';}else if(battle.lastType){battle.combo=0;}battle.lastType=c.type;battle.player+=points;const avgPower=(state.stats.vocal+state.stats.dance+state.stats.charm)/3;const rival=15+Math.floor(Math.random()*9)+Math.floor(avgPower/10)+(state.day>=7?5:0);battle.rival+=rival;battle.turn++;battle.waiting=battle.turn<3;battle.hand=battle.waiting?drawHand():[];battle.log=c.name+'！ '+points+'pt獲得。ライバル +'+rival+'pt。'+comboText;
 if(battle.turn>=3){battle.finished=true;battle.won=battle.player>=battle.rival;const fans=battle.won?25:10;const jewels=battle.won?35:12;state.fans+=fans;state.jewels+=jewels;state.money=(state.money||0)+(battle.won?180:100);state.tickets=(state.tickets||0)+(battle.won?2:1);state.stats.bond=clamp(state.stats.bond+(battle.won?3:1));state.liveScore=battle.player;state.liveRivalScore=battle.rival;battle.rewardFans=fans;battle.rewardJewels=jewels;addLog(battle.won?'🏆':'♫','ライブ結果：'+(battle.won?'勝利':'惜敗')+'。ファン +'+fans+'、ジュエル +'+jewels+'。');save();sfx(battle.won?'win':'event');}else{sfx('card');}
 battle.waiting=battle.turn<3;save();renderLive();$('jewelCount').textContent=state.jewels;$('fanCount').textContent=state.fans;}
function finishCardTurn(){if(!battle||!battle.waiting)return;battle.waiting=false;renderLive();}
function pullGacha(){if(!state.tickets)state.tickets=0;if(state.tickets<1){toast('チケットがないよ。ジュエルで交換できるよ。');return;}state.tickets--;const pool=costumes.filter(c=>c.id!=='uniform');const c=pool[Math.floor(Math.random()*pool.length)];let message='';if(state.closet.includes(c.id)){const reward=c.rarity==='SSR'?30:c.rarity==='SR'?18:8;state.jewels+=reward;message='かぶり：'+c.emoji+' '+c.name+'。ジュエル +'+reward+'に変換！';}else{state.closet.push(c.id);message='新衣装GET！ '+c.emoji+' '+c.name+'（'+c.rarity+'）';sfx(c.rarity==='SSR'?'rare':'win');}save();renderGacha();const res=$('gachaResult');res.style.display='block';res.textContent=message;$('jewelCount').textContent=state.jewels;toast(message);}

function openProductionPreparation(){
 if(!state||!state.prologueSeen){toast('まず最初の物語を読んでね。');return;}
 preparation.idol=state.idol||'mirai';
 preparation.item='vocal';
 renderPreparation();
 $('productionPrepOverlay').classList.add('show');
}
function renderPreparation(){
 const id=preparation.idol;
 const picks=Object.entries(idols).map(([key,x])=>'<button class="prep-idol '+(key===id?'selected':'')+'" data-prep-idol="'+key+'"><span>'+x.emoji+'</span><strong>'+x.name+'</strong><small>'+x.role+'</small></button>').join('');
 const owned=costumes.filter(x=>x.id==='uniform'||state.closet.includes(x.id)).filter(x=>!x.owner||x.owner===id);
 const costumeOptions=owned.map(x=>'<option value="'+x.id+'" '+(preparation.costume===x.id?'selected':'')+'>'+x.name+'（'+x.rarity+'）</option>').join('');
 $('productionPrepContent').innerHTML='<div class="eyebrow">PRODUCE PREPARATION</div><h2>プロデュースの準備</h2><p class="prep-lead">今回の7日間を一緒に歩むアイドルと、最初に持ち込むアイテムを選ぼう。</p><h3>1. プロデュースするアイドル</h3><div class="prep-idols">'+picks+'</div><h3>2. 着用する衣装</h3><select id="prepCostume" class="prep-select">'+costumeOptions+'</select><h3>3. 持ち込むサポートアイテム</h3><div class="prep-items"><button class="prep-item '+(preparation.item==='vocal'?'selected':'')+'" data-prep-item="vocal">🎤 <b>ボーカルノート</b><small>開始時に歌唱力 +5</small></button><button class="prep-item '+(preparation.item==='dance'?'selected':'')+'" data-prep-item="dance">✦ <b>ステップガイド</b><small>開始時にダンス +5</small></button><button class="prep-item '+(preparation.item==='charm'?'selected':'')+'" data-prep-item="charm">✧ <b>表現のミラー</b><small>開始時に表現力 +5</small></button></div><div class="prep-actions"><button class="secondary" data-close-prep>戻る</button><button class="primary" data-confirm-production>この内容で正式スタート！</button></div>';
 $('prepCostume').addEventListener('change',e=>preparation.costume=e.target.value);
 $('productionPrepContent').querySelectorAll('[data-prep-idol]').forEach(b=>b.addEventListener('click',()=>{preparation.idol=b.dataset.prepIdol;preparation.costume='uniform';renderPreparation();}));
 $('productionPrepContent').querySelectorAll('[data-prep-item]').forEach(b=>b.addEventListener('click',()=>{preparation.item=b.dataset.prepItem;renderPreparation();}));
 $('productionPrepContent').querySelector('[data-close-prep]').addEventListener('click',()=>$('productionPrepOverlay').classList.remove('show'));
 $('productionPrepContent').querySelector('[data-confirm-production]').addEventListener('click',startProduction);
}
function startProduction(){
 const old=state, idol=preparation.idol, name=old.name||old.fairyName||'ルミ';
 const next=freshState(name,idol);
 next.productionActive=true;next.prologueSeen=true;next.runCount=(old.runCount||0)+(old.productionActive?0:1);
 next.jewels=old.jewels??100;next.money=old.money??500;next.tickets=old.tickets??1;
 next.closet=[...new Set(old.closet||['uniform'])];next.costumeLevels={...(old.costumeLevels||{})};next.lessonLevels={...(old.lessonLevels||{vocal:1,dance:1,charm:1})};
 next.lifetimeFans=old.lifetimeFans||old.fans||0;next.equipped=preparation.costume;
 if(!next.closet.includes(preparation.costume))next.closet.push(preparation.costume);
 next.stats[preparation.item]=clamp(next.stats[preparation.item]+5);
 next.logs=[{icon:'✦',text:'プロデュース開始！ '+idols[idol].name+'と7日間の挑戦へ。'}];
 next.actions=2;next.doneActions=[];next.day=1;next.eventDays=[];next.ending=false;next.won=false;next.liveAttempted=false;next.liveScore=0;
 state=next;localStorage.setItem(ACTIVE_IDOL_KEY,idol);save();battle=null;pendingEvent=null;
 $('productionPrepOverlay').classList.remove('show');
 document.querySelectorAll('[data-production-nav]').forEach(el=>el.hidden=false);
 renderPlan();renderLive();showScreen('plan');toast('7日間のプロデュースが始まったよ！');
}

let dynamicDelegateBound=false;
function bindDynamic(){
 if(dynamicDelegateBound)return;dynamicDelegateBound=true;
 document.addEventListener('click',e=>{
  const target=e.target instanceof Element?e.target:e.target?.parentElement;
  const b=target?.closest('button');if(!b||!$('gameMain').contains(b))return;
  if(b.dataset.go){showScreen(b.dataset.go);return;}if(b.dataset.prepIdol||b.dataset.prepItem){}if(b.hasAttribute('data-start-production')){openProductionPreparation();return;}if(b.dataset.homeIdol){localStorage.setItem(HOME_IDOL_KEY,b.dataset.homeIdol);state.homeLineIndex=0;renderHome();return;}if(b.hasAttribute('data-close-prep')){$('productionPrepOverlay').classList.remove('show');return;}if(b.hasAttribute('data-confirm-production')){startProduction();return;}if(b.hasAttribute('data-home-line')){state.homeLineIndex=((state.homeLineIndex||0)+1)%3;renderHome();return;}
  if(b.dataset.action){if(!state.productionActive){toast('プロデュース開始後にレッスンできるよ。');return;}useAction(b.dataset.action);return;}if(b.dataset.openUpgrade){const panel=$('screen-upgrade').querySelector('[data-upgrade-panel="'+b.dataset.openUpgrade+'"]');if(panel)panel.hidden=!panel.hidden;return;}if(b.dataset.upgradeLesson){const k=b.dataset.upgradeLesson;state.lessonLevels=state.lessonLevels||{vocal:1,dance:1,charm:1};const lv=state.lessonLevels[k]||1;const cost=100*lv;if(lv>=10||state.money<cost){toast('お金が足りないか、最大レベルだよ。');return;}state.money-=cost;state.lessonLevels[k]=lv+1;save();renderUpgrade();toast(statName(k)+'レッスン Lv.'+(lv+1)+'！');return;}if(b.hasAttribute('data-upgrade-costume')){state.costumeLevels=state.costumeLevels||{};const lv=state.costumeLevels[state.equipped]||0;const cost=150+50*lv;if(lv>=10||state.money<cost){toast('お金が足りないか、最大レベルだよ。');return;}state.money-=cost;state.costumeLevels[state.equipped]=lv+1;save();renderUpgrade();renderCloset();toast('衣装強化 Lv.'+(lv+1)+'！ ライブボーナス +2');return;}
  if(b.dataset.claimMission){claimMission(b.dataset.claimMission);return;}if(b.hasAttribute('data-claim-login')){claimLogin();return;}if(b.hasAttribute('data-read-prologue')){showPrologue('story');return;}
  if(b.dataset.readStory!==undefined){state.storyIndex=Number(b.dataset.readStory);save();renderStory();return;}
   if(b.dataset.storyChoice!==undefined){chooseStory(Number(b.dataset.storyChoice));return;}
  if(b.hasAttribute('data-next-story')){if(state.storyIndex<4){state.storyIndex++;save();renderStory();$('storyDot').classList.add('show');}return;}
  if(b.hasAttribute('data-start-live')){if(!state.productionActive){toast('プロデュース開始後に挑戦できるよ。');return;}startLive();return;}if(b.hasAttribute('data-festival-ending')){if(!state.productionActive)return;state.ending=true;state.productionActive=false;save();showFestivalEnding();return;}
  if(b.dataset.playCard!==undefined){playCard(Number(b.dataset.playCard));return;}
  if(b.hasAttribute('data-next-turn')){finishCardTurn();return;}
  if(b.dataset.equip){state.equipped=b.dataset.equip;save();renderCloset();toast('衣装を変更したよ！');return;}
  if(b.hasAttribute('data-gacha')){pullGacha();return;}
  if(b.hasAttribute('data-buy-ticket')){if(state.jewels<35)return;state.jewels-=35;state.tickets=(state.tickets||0)+1;save();renderGacha();$('jewelCount').textContent=state.jewels;toast('チケットを1枚交換したよ！');return;}
  if(b.hasAttribute('data-restart')){resetToSetup();return;}
 },true);
}
function chooseStory(i){if(!state.productionActive){toast('プロデュース中にストーリーを進められるよ。');return;}const s=nextStoryText();if(state.storySeen.includes(state.storyIndex))return;const c=s.choices[i];if(!c)return;const key=c[1];if(key==='bold'){state.stats.vocal=clamp(state.stats.vocal+3);state.stats.charm=clamp(state.stats.charm+2);addLog('🔥','物語で強気な選択。歌唱力 +3、表現力 +2。');}else if(key==='kind'){state.stats.bond=clamp(state.stats.bond+4);state.stats.charm=clamp(state.stats.charm+2);addLog('♡','物語で思いやりを選んだ。絆 +4、表現力 +2。');}else if(key==='team'){state.stats.bond=clamp(state.stats.bond+3);state.jewels+=5;addLog('✦','仲間と作戦を立てた。絆 +3、ジュエル +5。');}else if(['vocal','dance','charm'].includes(key)){state.stats[key]=clamp(state.stats[key]+5);addLog('✦','フェスの作戦を決めた。'+statName(key)+' +5。');}state.storySeen.push(state.storyIndex);missionProgress('story');save();renderStory();renderHome();toast('選択を記録したよ。結果はステータスに反映！');sfx('card');}
function resetToSetup(){if(state&&state.ending){const old=state;const next=freshState(old.name,old.idol);next.productionActive=false;next.money=old.money||0;next.tickets=Math.max(1,old.tickets||0);next.jewels=old.jewels||0;next.closet=[...new Set(old.closet||['uniform'])];next.equipped=old.equipped||'uniform';next.costumeLevels={...(old.costumeLevels||{})};next.lessonLevels={...(old.lessonLevels||{vocal:1,dance:1,charm:1})};next.runCount=(old.runCount||0)+1;next.lifetimeFans=(old.lifetimeFans||0)+(old.fans||0);next.logs=[{icon:'↻',text:'周回 '+next.runCount+' 開始！育成・衣装・所持品を引き継いだ。'}];state=next;battle=null;pendingEvent=null;save();document.querySelectorAll('.screen').forEach(el=>el.classList.remove('active'));$('setupOverlay').classList.remove('show');renderHome();renderPlan();renderStory();renderLive();renderCloset();showScreen('home');toast('育成を引き継いで周回 '+state.runCount+' 開始！');return;}if(!confirm('セーブデータを消して最初から始める？'))return;localStorage.removeItem(SAVE_KEY);localStorage.removeItem(ACTIVE_IDOL_KEY);['mirai','reika','komugi'].forEach(id=>localStorage.removeItem(idolSaveKey(id)));localStorage.removeItem(SAVE_KEY+'-fairy-name');localStorage.removeItem(SAVE_KEY+'-first-idol');state=null;battle=null;pendingEvent=null;document.querySelectorAll('.screen').forEach(el=>el.classList.remove('active'));$('setupOverlay').classList.add('show');$('playerName').value='ひかり';document.querySelectorAll('.idol-pick').forEach(b=>b.classList.toggle('selected',b.dataset.idol==='mirai'));}
document.querySelectorAll('.nav[data-screen]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.screen)));
document.querySelectorAll('.idol-pick').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.idol-pick').forEach(x=>x.classList.toggle('selected',x===b));renderCostumeChoices();}));
function renderCostumeChoices(){const id=document.querySelector('.idol-pick.selected')?.dataset.idol||'mirai';const signature=initialCostumeByIdol[id];const firstIdol=localStorage.getItem(SAVE_KEY+'-first-idol');const area=$('costumeChoices');if(!area)return;let saved=null;try{saved=JSON.parse(localStorage.getItem(idolSaveKey(id))||'null')}catch(e){}const owned=saved&&Array.isArray(saved.closet)?saved.closet:['uniform'];const canGetSignature=(!firstIdol&& !state?.stats)||firstIdol===id;const options=costumes.filter(cost=>cost.id==='uniform'||(owned.includes(cost.id)&&(!cost.owner||cost.owner===id))||(cost.id===signature&&canGetSignature));area.innerHTML='<div class="field-label">育成するアイドルの衣装を選ぼう</div><div class="setup-costume-picks">'+options.map((cost,i)=>'<button type="button" class="setup-costume-pick '+(i===0?'selected':'')+'" data-setup-costume="'+cost.id+'"><span>'+cost.emoji+'</span><strong>'+esc(cost.name)+'</strong><small>'+cost.rarity+'</small></button>').join('')+'</div><p class="tiny-note">初期固有SSRは最初に選んだアイドルだけが獲得できるよ。</p>';area.querySelectorAll('[data-setup-costume]').forEach(b=>b.addEventListener('click',()=>{area.querySelectorAll('[data-setup-costume]').forEach(x=>x.classList.toggle('selected',x===b));}));}
$('beginGame').addEventListener('click',()=>{const name=$('playerName').value.trim().slice(0,12)||'ルミ';const selectedIdol=document.querySelector('.idol-pick.selected')?.dataset.idol||'mirai';const selectedCostume=document.querySelector('[data-setup-costume].selected')?.dataset.setupCostume||'uniform';localStorage.setItem(SAVE_KEY+'-fairy-name',name);if(!localStorage.getItem(SAVE_KEY+'-first-idol'))localStorage.setItem(SAVE_KEY+'-first-idol',selectedIdol);const firstIdol=localStorage.getItem(SAVE_KEY+'-first-idol');let selectedSave=null;try{const raw=localStorage.getItem(idolSaveKey(selectedIdol));if(raw)selectedSave=JSON.parse(raw);}catch(e){}if(selectedSave&&selectedSave.stats){state=selectedSave;state.name=name;state.fairyName=name;}else{state=freshState(name,selectedIdol);state.tickets=1;state.logs=[];}state.idol=selectedIdol;state.name=name;state.fairyName=name;const allowedCostume=selectedCostume.startsWith('starter-')&&firstIdol!==selectedIdol?'uniform':selectedCostume;if(!state.closet.includes(allowedCostume))state.closet.push(allowedCostume);state.equipped=allowedCostume;state.costumeLevels=state.costumeLevels||{uniform:0};if(!(selectedCostume in state.costumeLevels))state.costumeLevels[selectedCostume]=0;state.prologueSeen=false;save();updateSoundButton();showPrologue();sfx('win');});
$('resetGame').addEventListener('click',resetToSetup);
$('soundToggle').addEventListener('click',()=>{if(!state){state={sfx:localStorage.getItem(SOUND_KEY)!=='off'};}state.sfx=!state.sfx;localStorage.setItem(SOUND_KEY,state.sfx?'on':'off');updateSoundButton();if(state.sfx)sfx('tap');save();});
$('eventChoices').addEventListener('click',e=>{const b=e.target.closest('[data-event-choice]');if(b)chooseEvent(Number(b.dataset.eventChoice));});
document.body.addEventListener('click',e=>{const b=e.target.closest('[data-day-live],[data-next-day]');if(!b)return;const m=$('dayEndModal');if(m)m.remove();if(b.hasAttribute('data-day-live')){showScreen('live');renderLive();}else nextDay();});
function boot(){
 state=loadState();if(state&&typeof state.productionActive!=='boolean'){state.productionActive=false;save();}updateSoundButton();bindDynamic();
 if(state&&state.stats){if(!state.eventDays)state.eventDays=[];if(!state.fairyName||!state.prologueSeen){prepareIntro();return;}$('setupOverlay').classList.remove('show');if(state.ending){showFestivalEnding();}else{renderHome();renderPlan();renderStory();renderLive();renderCloset();showScreen('home');}}
 else{prepareIntro();}
}
boot();
})();