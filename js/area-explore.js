
(() => {
'use strict';
const AREA_KEY='etoile-academy-area-v1';
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const conversations={
 shuffle:{
  title:'シャッフルユニット・顔合わせ',place:'中庭',
  lines:[
   ['月夜','お二人とも、話し合いを始めましょう。'],['セツナ','はぁ...退屈。'],['未来','えーっと...えーっと...'],['嵐','はーっはっはっは！この私がいるからにはこのユニットは安泰だ！'],['こむぎ','おぉ〜！'],['める','何言ってんだか...？'],['麗華','知らない人とユニット...どうしよう...！？'],
   ['セツナ','私、寝てくる。つまらないし。'],['未来','そ、そうだよね！仮眠も大事大事〜！あはは...'],['月夜','寝に行かないでください。'],['嵐','セツナが寝るなら！私が添い寝してやろう！'],['める','可哀想なセツナ...ねえ麗華。私たちも抜けよ？'],['麗華','え！？いや、そんなこと！？'],['月夜','どうしたのですか？めるさん。麗華さん。許しませんよ？'],
   ['こむぎ','もう疲れたー！'],['未来','こむぎちゃん！？今はそう言うこというのは良くないんじゃないかな！？'],['麗華','私も疲れちゃった。'],['未来','麗華ちゃんも！？'],['月夜','しょうがないですね。今日は解散としましょうか。'],['セツナ','じゃあ私寝てくる。'],['嵐','お！添い寝してやろう！'],['セツナ','うっさい黙れカス。'],
   ['','はぁ...。月夜、やっぱそういうのよくないって。'],['める','なんかあったの？今日。'],['月夜','いいえ、何も。'],['める','ふーん。'],['月夜','めるさんが他の子といちゃついてて、少し嫉妬しただけです。'],['める','へぇ...。あんたってそんなツンデレキャラだったっけ？'],['月夜','なんですか。'],['める','いや？私のキャラが無くなっちゃったなー？ってさ。'],['月夜','むぅ。'],['める','かわい。'],['月夜','うるさいです！もういいです！']
  ]
 },
 shionRamu:{
  title:'紫音とらむ',place:'校舎前',
  lines:[
   ['束田紫音','賑やかなクラスメイト...お母さんも昔、こんな感じだったのかな。'],['千愛らむ','誰のお母様ですの？'],['束田紫音','私のお母さんだよ。昔トップアイドルだったあの人。'],['束田紫音','猫のコスプレしてる映像とか出てきてほんっとキモいの。'],['千愛らむ','まあ、アイドルとしての運命だと思いますわ。'],['千愛らむ','わたくしだって、アイドルを商売道具として使う方法はいくらでも思い付きますもの。'],['束田紫音','らむってさ、腹黒いよね。'],['千愛らむ','褒め言葉として受け取っておきますわね！']
  ]
 }
};
let saved={x:50,y:84,unlocked:[],seen:[]};
try{const raw=JSON.parse(localStorage.getItem(AREA_KEY)||'null');if(raw&&typeof raw==='object')saved={...saved,...raw};}catch(e){}
saved.unlocked=Array.isArray(saved.unlocked)?saved.unlocked:[];
saved.seen=Array.isArray(saved.seen)?saved.seen:[];
saved.x=Number.isFinite(saved.x)?clamp(saved.x,3,97):50;
saved.y=Number.isFinite(saved.y)?clamp(saved.y,5,95):84;
const overlay=document.createElement('div');
overlay.id='areaExploreOverlay';overlay.className='area-explore-overlay';
overlay.innerHTML=[
 '<section class="area-explore-panel" role="dialog" aria-modal="true" aria-label="学園エリア探索">',
 '<header class="area-explore-head"><div><div class="eyebrow">ÉTOILE ACADEMY · CAMPUS</div><h2>学園を歩いてみよう</h2></div><div class="area-explore-head-actions"><button type="button" data-area-archive>会話ログ</button><button type="button" class="area-close" data-area-close aria-label="閉じる">×</button></div></header>',
 '<div class="area-explore-body"><div class="area-world-wrap"><div class="area-world" id="areaWorld" aria-label="学園マップ。画面をタップして移動できます。">',
 '<div class="area-path path-main"></div><div class="area-path path-cross"></div><div class="area-lawn" style="left:5%;top:12%;width:26%;height:23%"></div><div class="area-lawn" style="left:66%;top:59%;width:28%;height:28%"></div>',
 '<div class="area-building" style="left:7%;top:48%;width:22%;height:19%">校舎前<small>CLASSROOM</small></div><div class="area-building" style="left:65%;top:7%;width:25%;height:20%">図書室<small>LIBRARY</small></div><div class="area-building" style="left:67%;top:72%;width:25%;height:17%">レッスン棟<small>LESSON</small></div><div class="area-building" style="left:36%;top:5%;width:22%;height:17%">屋上<small>ROOFTOP</small></div>',
 '<div class="area-location" style="left:51%;top:45%"><span class="area-location-mark">✿</span><span class="area-location-name">中庭</span></div><div class="area-location" style="left:18%;top:76%"><span class="area-location-mark">⌂</span><span class="area-location-name">校舎前</span></div><div class="area-location" style="left:78%;top:29%"><span class="area-location-mark">▤</span><span class="area-location-name">図書室</span></div><div class="area-location" style="left:80%;top:89%"><span class="area-location-mark">♫</span><span class="area-location-name">レッスン棟</span></div>',
 '<button type="button" class="area-npc" data-area-npc="shuffle" style="left:56%;top:37%"><span class="area-npc-bubble group">✦✦✦</span><span class="area-npc-label">シャッフル組</span></button><button type="button" class="area-npc" data-area-npc="shionRamu" style="left:29%;top:68%"><span class="area-npc-bubble">紫 / ら</span><span class="area-npc-label">紫音 ＆ らむ</span></button>',
 '<div class="area-player" id="areaPlayer" aria-label="あなた">✦</div></div><div class="area-world-hint">スマホを傾けて移動 ／ PCは矢印キー・WASD ／ マップをタップして移動先を指定</div></div>',
 '<aside class="area-side"><section class="area-side-card"><h3>移動スティック</h3><p>丸いスティックを押したまま動かして移動</p><div class="area-stick-base" id="areaStickBase" role="application" aria-label="バーチャルアナログスティック"><div class="area-stick-knob" id="areaStickKnob"></div></div><div class="area-stick-caption">指を離すと止まります</div></section>',
 '<section class="area-side-card"><div class="area-nearby-title">NEARBY</div><div class="area-nearby-name" id="areaNearbyName">周囲を見渡す</div><p class="area-nearby-desc" id="areaNearbyDesc">学園を歩いて、アイドルたちの会話を探してみよう。</p><button type="button" class="area-talk-button" id="areaTalkButton" disabled>近くに会話はありません</button></section></aside></div>',
 '<footer class="area-explore-footer"><span>✦ あなたはアイドルを支える妖精です。<br>会話を見つけると、会話ログに保存されます。</span><button type="button" class="area-exit" data-area-close>探索を終了</button></footer>',
 '<div class="area-dialogue-shade" id="areaDialogue"><section class="area-dialogue-card"><div class="area-dialogue-kicker" id="areaDialogueKicker">AREA TALK</div><h3 id="areaDialogueTitle"></h3><div class="area-dialogue-speaker" id="areaDialogueSpeaker"></div><div class="area-dialogue-text" id="areaDialogueText"></div><div class="area-dialogue-controls"><button type="button" data-dialogue-close>閉じる</button><button type="button" class="area-dialogue-next" id="areaDialogueNext">次へ　→</button></div></section></div>',
 '<div class="area-archive-shade" id="areaArchive"><section class="area-archive-card"><div class="area-dialogue-kicker">AREA TALK ARCHIVE</div><h3>見つけた会話</h3><div class="area-archive-list" id="areaArchiveList"></div><div class="area-dialogue-controls"><button type="button" data-archive-close>閉じる</button></div></section></div>',
 '</section>'
].join('');
document.body.appendChild(overlay);
const $=id=>document.getElementById(id),world=$('areaWorld'),player=$('areaPlayer');
let opened=false,raf=0,lastFrame=0,stickX=0,stickY=0,stickPointer=null;
let currentNearby=null,dialogueId=null,dialogueIndex=0,target=null;
const held={up:false,down:false,left:false,right:false},keys={};
function save(){try{localStorage.setItem(AREA_KEY,JSON.stringify(saved));}catch(e){}}
function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
const npcs={shuffle:{x:56,y:37,name:'シャッフルユニット',desc:'中庭から賑やかな声が聞こえる。誰かが集まっているみたい。'},shionRamu:{x:29,y:68,name:'束田紫音 ＆ 千愛らむ',desc:'校舎前で紫音とらむが話している。'}};
function renderPosition(){
 player.style.left=saved.x+'%';player.style.top=saved.y+'%';
 let found=null,near=999;Object.entries(npcs).forEach(([id,npc])=>{const d=distance(saved,npc);if(d<near){near=d;found=id;}});
 currentNearby=near<=14?found:null;
 const name=$('areaNearbyName'),desc=$('areaNearbyDesc'),talk=$('areaTalkButton');
 if(currentNearby){const npc=npcs[currentNearby],known=saved.unlocked.includes(currentNearby);name.textContent=npc.name;desc.textContent=npc.desc;talk.disabled=false;talk.textContent=known?'会話を見る ／ もう一度見る':'話しかける';if(!known){saved.unlocked.push(currentNearby);save();}}
 else{name.textContent='周囲を見渡す';desc.textContent='学園を歩いて、アイドルたちの会話を探してみよう。';talk.disabled=true;talk.textContent='近くに会話はありません';}
}
function setSensorStatus(text,active=false){$('areaSensorLabel').textContent=text;$('areaSensorStatus').classList.toggle('active',active);}
function move(dx,dy,amount){saved.x=clamp(saved.x+dx*amount,3,97);saved.y=clamp(saved.y+dy*amount,5,95);}
function loop(ts){
 if(!opened)return;const dt=Math.min(40,ts-(lastFrame||ts-16));lastFrame=ts;
 let dx=(held.right||keys.ArrowRight||keys.d?1:0)-(held.left||keys.ArrowLeft||keys.a?1:0);
 let dy=(held.down||keys.ArrowDown||keys.s?1:0)-(held.up||keys.ArrowUp||keys.w?1:0);
 if(target){const tx=target.x-saved.x,ty=target.y-saved.y,len=Math.hypot(tx,ty);if(len<1.2)target=null;else{dx=tx/len;dy=ty/len;}}
 else if(!dx&&!dy){dx=stickX;dy=stickY;}
 if(dx||dy){const len=Math.hypot(dx,dy)||1;move(dx/len,dy/len,.055*dt);}
 renderPosition();raf=requestAnimationFrame(loop);
}
function startLoop(){cancelAnimationFrame(raf);lastFrame=0;raf=requestAnimationFrame(loop);}
function onOrientation(e){
 if(e.beta==null||e.gamma==null)return;latestBeta=e.beta;latestGamma=e.gamma;
 if(baseBeta===null||baseGamma===null){baseBeta=e.beta;baseGamma=e.gamma;return;}
 const gx=(e.gamma-baseGamma)/24,gy=(e.beta-baseBeta)/24;
 tiltX=Math.abs(gx)<.16?0:clamp(gx,-1,1);tiltY=Math.abs(gy)<.16?0:clamp(gy,-1,1);
}
async function enableGyro(){
 const D=window.DeviceOrientationEvent;
 if(!D){setSensorStatus('この端末はジャイロ非対応');$('areaGyroButton').textContent='ボタン操作を使ってね';return;}
 try{
  if(typeof D.requestPermission==='function'){const permission=await D.requestPermission();if(permission!=='granted'){setSensorStatus('センサーの許可が必要です');return;}}
  baseBeta=latestBeta;baseGamma=latestGamma;window.addEventListener('deviceorientation',onOrientation,true);
  gyroEnabled=true;$('areaGyroButton').textContent='傾きを中央に合わせる';setSensorStatus('ジャイロ操作中',true);
  if(latestBeta===null){baseBeta=null;baseGamma=null;}
 }catch(e){setSensorStatus('ジャイロを利用できません');}
}
function calibrateGyro(){baseBeta=latestBeta;baseGamma=latestGamma;tiltX=0;tiltY=0;setSensorStatus('中央位置を設定しました',true);}
function stopGyro(){stickX=0;stickY=0;stickPointer=null;const knob=$('areaStickKnob');if(knob)knob.style.transform='translate(0,0)';}
function playConversation(id){
 const data=conversations[id];if(!data)return;dialogueId=id;dialogueIndex=0;
 $('areaDialogueTitle').textContent=data.title;$('areaDialogueKicker').textContent='AREA TALK · '+data.place;$('areaDialogue').classList.add('show');renderDialogueLine();
}
function renderDialogueLine(){const data=conversations[dialogueId],line=data.lines[dialogueIndex];$('areaDialogueSpeaker').textContent=line[0];$('areaDialogueText').textContent=line[1];$('areaDialogueNext').textContent=dialogueIndex===data.lines.length-1?'会話を閉じる':'次へ　→';}
function advanceDialogue(){
 if(!dialogueId)return;const data=conversations[dialogueId];
 if(dialogueIndex<data.lines.length-1){dialogueIndex++;renderDialogueLine();return;}
 if(!saved.seen.includes(dialogueId))saved.seen.push(dialogueId);save();$('areaDialogue').classList.remove('show');dialogueId=null;
}
function openArchive(){
 const list=$('areaArchiveList'),entries=saved.unlocked.filter(id=>conversations[id]);
 list.innerHTML=entries.length?entries.map(id=>'<button type="button" data-replay-area="'+id+'">'+conversations[id].title+'<small>'+conversations[id].place+' · '+(saved.seen.includes(id)?'読了済み':'未読')+'</small></button>').join(''):'<p>まだ会話を見つけていません。学園を歩いて探してみよう。</p>';
 $('areaArchive').classList.add('show');
}
function openArea(){opened=true;overlay.classList.add('show');document.body.classList.add('area-explore-open');renderPosition();startLoop();}
function closeArea(){opened=false;overlay.classList.remove('show');document.body.classList.remove('area-explore-open');stopGyro();cancelAnimationFrame(raf);target=null;Object.keys(held).forEach(k=>held[k]=false);}
function ensureEntry(){
 const shortcuts=document.querySelector('#screen-home .mypage-shortcuts');
 if(!shortcuts||shortcuts.querySelector('[data-open-area-explore]'))return;
 const button=document.createElement('button');button.type='button';button.className='mypage-link area-explore-entry';button.setAttribute('data-open-area-explore','');
 button.innerHTML='<span>⌖</span><b>学園を歩く</b><small>エリア探索・会話</small>';shortcuts.appendChild(button);
}
document.addEventListener('click',e=>{
 const open=e.target.closest('[data-open-area-explore]');if(open){openArea();return;}
 if(e.target.closest('[data-area-close]')){closeArea();return;}
 if(e.target.closest('[data-area-archive]')){openArchive();return;}
 if(e.target.closest('[data-archive-close]')){$('areaArchive').classList.remove('show');return;}
 if(e.target.closest('[data-dialogue-close]')){$('areaDialogue').classList.remove('show');dialogueId=null;return;}
 if(e.target.closest('#areaDialogueNext')){advanceDialogue();return;}
 const replay=e.target.closest('[data-replay-area]');if(replay){$('areaArchive').classList.remove('show');playConversation(replay.dataset.replayArea);return;}
 if(e.target.closest('#areaTalkButton')&&currentNearby){playConversation(currentNearby);return;}
 const npc=e.target.closest('[data-area-npc]');if(npc){const n=npcs[npc.dataset.areaNpc];target={x:n.x,y:n.y};return;}
});
const stickBase=$('areaStickBase'),stickKnob=$('areaStickKnob');function updateStick(e){const rect=stickBase.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,max=rect.width*.34,dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy),scale=len>max?max/len:1,px=dx*scale,py=dy*scale;stickX=px/max;stickY=py/max;stickKnob.style.transform='translate('+px+'px,'+py+'px)';}stickBase.addEventListener('pointerdown',e=>{e.preventDefault();stickPointer=e.pointerId;stickBase.setPointerCapture(e.pointerId);updateStick(e);});stickBase.addEventListener('pointermove',e=>{if(stickPointer===e.pointerId)updateStick(e);});function releaseStick(e){if(stickPointer!==null&&(e.pointerId===undefined||e.pointerId===stickPointer)){stickPointer=null;stickX=0;stickY=0;stickKnob.style.transform='translate(0,0)';}}stickBase.addEventListener('pointerup',releaseStick);stickBase.addEventListener('pointercancel',releaseStick);
document.querySelectorAll('[data-dir]').forEach(button=>{
 const dir=button.dataset.dir,down=e=>{e.preventDefault();held[dir]=true;},up=()=>{held[dir]=false;};
 button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointerleave',up);button.addEventListener('pointercancel',up);
});
world.addEventListener('pointerdown',e=>{
 if(e.target.closest('[data-area-npc]'))return;const rect=world.getBoundingClientRect();
 target={x:clamp((e.clientX-rect.left)/rect.width*100,3,97),y:clamp((e.clientY-rect.top)/rect.height*100,5,95)};
});
window.addEventListener('keydown',e=>{if(!opened)return;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys[e.key]=true;});
window.addEventListener('keyup',e=>{keys[e.key]=false;});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&opened)stopGyro();});
const observer=new MutationObserver(ensureEntry);observer.observe(document.body,{childList:true,subtree:true});ensureEntry();renderPosition();
})();
