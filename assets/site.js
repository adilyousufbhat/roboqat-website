/* RoboQAT site script (v3, go-live): WhatsApp links with email/form fallback, menu, email form, scroll reveal, counters,
   hero tilt + eye tracking, journey progress, FAQ animation, floating CTA and the "code your first robot" game.
   No libraries. Each language is its own page; strings for the game live in T below. */
(function(){
'use strict';
/* WhatsApp: set WA_NUMBER to the real number (country code + number, digits only, e.g. "97455555555").
   This is the ONLY place to set it. While it is empty (or still contains X), every booking button keeps its
   fallback link (the on-page form at #contact, or an email to info@roboqat.com) and the WhatsApp-only
   elements (floating button, WhatsApp contact card) stay hidden. Once a valid number is set they switch to WhatsApp. */
var WA_NUMBER="";
var WA_TEXT={
 en:{book:"Hello RoboQAT, I would like to book a class for my child (age: ).",school:"Hello RoboQAT, I would like to talk about a school partnership."},
 ar:{book:"مرحبًا RoboQAT، أودّ حجز حصة لطفلي (العمر: ).",school:"مرحبًا RoboQAT، أودّ التحدث عن شراكة مع مدرستنا."}
};
var doc=document,root=doc.documentElement;
var l=root.lang==='ar'?'ar':'en';
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
function $(s,c){return (c||doc).querySelector(s)}
function $$(s,c){return Array.prototype.slice.call((c||doc).querySelectorAll(s))}

var WA_OK=/^\d{8,15}$/.test(WA_NUMBER);
if(WA_OK){
 $$('a.wa').forEach(function(a){
  a.href='https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(WA_TEXT[l][a.dataset.wa]||WA_TEXT[l].book);
  a.target='_blank';a.rel='noopener';
 });
 $$('.wa-only').forEach(function(el){el.hidden=false});
 $$('.wa-num').forEach(function(el){el.textContent='+'+WA_NUMBER});
}

/* menu */
var mb=$('.menu-btn'),nav=$('#nav');
function closeNav(){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')}
mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o?'true':'false')});
nav.addEventListener('click',function(e){if(e.target.closest('a'))closeNav()});
doc.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('open')){closeNav();mb.focus()}});

/* form: no backend. On submit, open the parent's email app with the fields filled in (to info@roboqat.com).
   Without JS the form's own mailto action is used. */
var f=$('#form');
if(f)f.addEventListener('submit',function(e){
 e.preventDefault();if(!f.checkValidity()){f.reportValidity();return}
 var lab=function(id){var x=$('label[for="'+id+'"]');return x?x.textContent.replace(/\s*\(.*\)\s*$/,''):id};
 var val=function(id){var x=$('#'+id);if(!x)return '';return x.tagName==='SELECT'?(x.options[x.selectedIndex]||{}).text||'':x.value.trim()};
 var lines=['f-name','f-phone','f-age','f-int','f-msg'].map(function(id){var v=val(id);return v?lab(id)+': '+v:''}).filter(Boolean);
 var href='mailto:info@roboqat.com?subject='+encodeURIComponent(f.dataset.subject||'Class booking')+'&body='+encodeURIComponent(lines.join('\r\n'));
 var m=$('#form-msg');
 m.innerHTML=l==='ar'?'يُفترض أن يفتح تطبيق البريد الإلكتروني الآن وفيه رسالتكم. إن لم يفتح، راسلونا مباشرة على <a href="mailto:info@roboqat.com" dir="ltr">info@roboqat.com</a>.':'Your email app should open now with your message ready to send. If it does not, email us at <a href="mailto:info@roboqat.com">info@roboqat.com</a>.';
 m.classList.add('show');
 location.href=href;
});

/* stagger index for children of [data-stagger] */
$$('[data-stagger]').forEach(function(g){$$('[data-reveal]',g).forEach(function(el,i){el.style.setProperty('--sd',i)})});

/* counters */
function count(el){
 var to=+el.dataset.to,from=+(el.dataset.from||0);
 if(RM){el.textContent=to;return}
 var t0=null,dur=1300;
 function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(from+(to-from)*e);if(p<1)requestAnimationFrame(step)}
 el.textContent=from;requestAnimationFrame(step);
}

/* reveal on scroll */
var revealEls=$$('[data-reveal]');
if('IntersectionObserver' in window&&!RM){
 var io=new IntersectionObserver(function(es){es.forEach(function(en){
  if(!en.isIntersecting)return;var el=en.target;el.classList.add('in');io.unobserve(el);
  $$('.count',el).forEach(count);
  setTimeout(function(){el.style.setProperty('--sd',0)},1400);
 })},{rootMargin:'0px 0px -8% 0px',threshold:.12});
 revealEls.forEach(function(el){io.observe(el)});
}else{revealEls.forEach(function(el){el.classList.add('in')})}

/* scroll: progress bar, header state, journey fill, floating CTA */
var head=$('.site-head'),bar=$('.progress span'),jt=$('#journey-track'),fab=$('.fab'),sticky=$('.sticky-cta'),hero=$('.hero'),contact=$('#contact'),play=$('#play');
var ticking=false;
function onScroll(){
 ticking=false;
 var y=window.scrollY,h=root.scrollHeight-innerHeight;
 if(bar)bar.parentNode.style.setProperty('--sp',h>0?(y/h).toFixed(4):0);
 head.classList.toggle('scrolled',y>10);
 if(jt){var r=jt.getBoundingClientRect(),p=(innerHeight*.75-r.top)/(r.height*.9);jt.style.setProperty('--p',Math.max(0,Math.min(1,p)).toFixed(3))}
 var past=hero&&y>hero.offsetHeight*.6;
 var nearForm=contact&&contact.getBoundingClientRect().top<innerHeight*.5&&contact.getBoundingClientRect().bottom>0;
 var pr=play&&play.getBoundingClientRect(),inPlay=pr&&pr.top<innerHeight*.8&&pr.bottom>innerHeight*.2;
 if(fab)fab.classList.toggle('show',!!past);
 if(sticky)sticky.classList.toggle('show',!!past&&!nearForm&&!inPlay);
}
addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
addEventListener('resize',onScroll);onScroll();

/* hero: tilt, parallax and eyes that follow the pointer */
var art=$('#hero-art');
if(art&&FINE&&!RM){
 var svg=art.querySelector('svg'),raf=0,mx=0,my=0;
 hero.addEventListener('pointermove',function(e){
  var r=art.getBoundingClientRect();
  mx=Math.max(-1,Math.min(1,(e.clientX-(r.left+r.width/2))/(r.width/1.2)));
  my=Math.max(-1,Math.min(1,(e.clientY-(r.top+r.height*.36))/(r.height/1.2)));
  if(!raf)raf=requestAnimationFrame(function(){raf=0;svg.style.setProperty('--mx',mx.toFixed(3));svg.style.setProperty('--my',my.toFixed(3));svg.style.setProperty('--ex',mx.toFixed(3));svg.style.setProperty('--ey',my.toFixed(3))});
 });
 hero.addEventListener('pointerleave',function(){['--mx','--my','--ex','--ey'].forEach(function(k){svg.style.setProperty(k,0)})});
}

/* card spotlight */
if(FINE&&!RM)$$('.spot').forEach(function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--x',(e.clientX-r.left)+'px');c.style.setProperty('--y',(e.clientY-r.top)+'px')})});

/* FAQ: smooth open/close (native <details> still works without JS) */
$$('.faq details').forEach(function(d){
 var s=d.querySelector('summary'),p=d.querySelector('p');
 var w=doc.createElement('div');w.className='ans';d.insertBefore(w,p);w.appendChild(p);
 s.addEventListener('click',function(e){
  if(RM||!w.animate)return;
  e.preventDefault();
  if(d.open){var h=w.offsetHeight;var a=w.animate([{height:h+'px',opacity:1},{height:'0px',opacity:0}],{duration:260,easing:'ease-in'});a.onfinish=function(){d.open=false}}
  else{d.open=true;var h2=w.offsetHeight;w.animate([{height:'0px',opacity:0},{height:h2+'px',opacity:1}],{duration:340,easing:'cubic-bezier(.22,1,.36,1)'})}
 });
});

/* ================= mini game: code your first robot ================= */
var game=$('#game');
if(game){
 var T={
  en:{lvl:'Challenge {n} of 3',start:'Add some moves, then press Run.',run:'Running your program…',bump:'Bump! The robot hit a wall. Change your program and try again.',edge:'Oops! The robot tried to leave the board. Try again.',short:'Not there yet. Add more moves and run it again.',win:'Brilliant! The robot reached the star.',done:'You coded your first robot! At RoboQAT, children build and code real ones.',full:'Your program is full (16 moves).',again:'Play again',next:'Next challenge',
      U:'up',D:'down',L:'left',R:'right',board:'Challenge {n}: guide the robot to the star. Robot at column {rx}, row {ry}. Star at column {gx}, row {gy}. {w} walls.'},
  ar:{lvl:'التحدّي {n} من 3',start:'أضف بعض الحركات، ثم اضغط «تشغيل».',run:'جارٍ تشغيل برنامجك…',bump:'اصطدم الروبوت بعائق! عدّل برنامجك وحاول مرة أخرى.',edge:'انتبه! حاول الروبوت الخروج من اللوحة. حاول مرة أخرى.',short:'لم يصل بعد. أضف مزيدًا من الحركات وشغّل البرنامج مجددًا.',win:'رائع! وصل الروبوت إلى النجمة.',done:'لقد برمجت روبوتك الأول! في RoboQAT يبني الأطفال روبوتات حقيقية ويبرمجونها.',full:'امتلأ برنامجك (16 حركة).',again:'العب مرة أخرى',next:'التحدّي التالي',
      U:'للأعلى',D:'للأسفل',L:'لليسار',R:'لليمين',board:'التحدّي {n}: وجّه الروبوت إلى النجمة. الروبوت في العمود {rx} والصف {ry}، والنجمة في العمود {gx} والصف {gy}. عدد العوائق: {w}.'}
 }[l];
 var LV=[
  {s:[0,2],g:[4,2],w:[]},
  {s:[0,4],g:[4,0],w:[[1,3],[2,2],[3,1],[1,1],[3,3]]},
  {s:[0,0],g:[4,4],w:[[1,0],[1,1],[1,2],[3,2],[3,3],[3,4]]}
 ];
 var MOV={U:[0,-1],D:[0,1],L:[-1,0],R:[1,0]},ROT={U:'rotate(-90deg)',D:'rotate(90deg)',L:'scaleX(-1)',R:'none'};
 var ARW={U:0,R:90,D:180,L:270};
 var board=$('#g-board'),list=$('#g-prog'),msg=$('#g-msg'),runB=$('#g-run'),undoB=$('#g-undo'),clrB=$('#g-clear'),next=$('#g-next'),nextB=$('#g-nextbtn'),cta=$('#g-cta'),lvlT=$('#g-lvl'),dots=$$('.game-dots i',game),keys=$$('.key',game);
 var lv=0,prog=[],pos,running=false,robo,STEP=RM?140:430;
 function fmt(s,o){return s.replace(/\{(\w+)\}/g,function(_,k){return o[k]})}
 function arrowSvg(m){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="transform:rotate('+ARW[m]+'deg)"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'}
 var ROBO='<svg viewBox="60 -16 520 460" aria-hidden="true"><g fill="#fff" stroke="#fff" stroke-width="22" stroke-linejoin="round"><path d="M286.75 60V88Q286.75 99 275 99.6H314.5Q303.25 99 303.25 88V60Z"/><circle cx="295" cy="38.5" r="27.5"/><rect x="87" y="218.5" width="415.5" height="97" rx="22"/><rect x="127" y="99" width="335.5" height="327.5" rx="88"/></g><defs><clipPath id="rqgame-in"><rect x="139.5" y="113" width="311" height="300.5" rx="75"/></clipPath></defs><g class="rq-ant"><path d="M286.75 60V88Q286.75 99 275 99.6H314.5Q303.25 99 303.25 88V60Z" fill="#731D36"/><circle class="rq-bulb" cx="295" cy="38.5" r="27.5" fill="#731D36"/></g><path d="M110.5 218.5V315.5H109A22 22 0 0 1 87 293.5V240.5A22 22 0 0 1 109 218.5Z" fill="#731D36"/><path d="M479 218.5V315.5H480.5A22 22 0 0 0 502.5 293.5V240.5A22 22 0 0 0 480.5 218.5Z" fill="#731D36"/><rect x="127" y="99" width="335.5" height="327.5" rx="88" fill="#731D36"/><path clip-path="url(#rqgame-in)" fill="#fff" d="M130 104H186.5L227 124.5L188 142L227 160.5L189 179.5L236 200.5H370.5A50 50 0 0 1 420.5 250.5V286A50 50 0 0 1 370.5 336H238L191 359.5L235 380.5L194 400L234 421H130Z"/><rect x="178.5" y="212" width="231" height="112" rx="56" fill="#731D36"/><g class="rq-eyes" fill="#fff"><rect x="224" y="239.5" width="31.5" height="57.5" rx="15.75"/><rect x="334" y="239.5" width="31.5" height="57.5" rx="15.75"/></g><g fill="#fff"><rect x="270.5" y="358.4" width="48" height="3.9" rx="1.9"/><rect x="270.5" y="372.1" width="48" height="3.9" rx="1.9"/><rect x="270.5" y="385.6" width="48" height="3.9" rx="1.9"/></g><path d="M528 238l40 30-40 30z" fill="#F2A9BE"/></svg>';
 var STAR='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill="#FFE3EA" stroke="#A32D52" stroke-width="1"/></svg>';
 function isWall(x,y){return LV[lv].w.some(function(w){return w[0]===x&&w[1]===y})}
 function setPos(x,y,dir){pos=[x,y];robo.style.setProperty('--x',x);robo.style.setProperty('--y',y);if(dir)robo.firstChild.style.transform=ROT[dir]}
 function say(t,cls){msg.textContent=t;msg.className='game-msg'+(cls?' '+cls:'')}
 function build(){
  var L=LV[lv];board.innerHTML='';
  for(var y=0;y<5;y++)for(var x=0;x<5;x++){var c=doc.createElement('div');c.className='cell';c.dataset.x=x;c.dataset.y=y;
   if(isWall(x,y))c.classList.add('wall');if(L.g[0]===x&&L.g[1]===y){c.classList.add('goal');c.innerHTML=STAR}board.appendChild(c)}
  robo=doc.createElement('div');robo.className='robo';robo.innerHTML='<span class="face">'+ROBO+'</span>';board.appendChild(robo);
  setPos(L.s[0],L.s[1],'R');
  board.setAttribute('aria-label',fmt(T.board,{n:lv+1,rx:L.s[0]+1,ry:L.s[1]+1,gx:L.g[0]+1,gy:L.g[1]+1,w:L.w.length}));
  lvlT.textContent=fmt(T.lvl,{n:lv+1});
  dots.forEach(function(d,i){d.className=i<lv?'done':(i===lv?'on':'')});
  prog=[];render();say(T.start);next.hidden=true;cta.hidden=true;lock(false);
 }
 function render(){list.innerHTML=prog.map(function(m){return '<li title="'+T[m]+'">'+arrowSvg(m)+'<span class="hp">'+T[m]+'</span></li>'}).join('')}
 function lock(on){running=on;keys.concat([runB,undoB,clrB]).forEach(function(b){b.disabled=on})}
 function clearTrail(){$$('.cell.trail',board).forEach(function(c){c.classList.remove('trail')})}
 keys.forEach(function(k){k.addEventListener('click',function(){
  if(running)return;if(prog.length>=16){say(T.full,'bad');return}
  prog.push(k.dataset.m);render();say(T.start);
 })});
 undoB.addEventListener('click',function(){if(running)return;prog.pop();render()});
 clrB.addEventListener('click',function(){if(running)return;prog=[];render();clearTrail();var L=LV[lv];setPos(L.s[0],L.s[1],'R');say(T.start)});
 function confetti(){
  if(RM)return;var cols=['#F2A9BE','#A32D52','#FFE3EA','#C2456B','#FFFFFF'];
  var L=LV[lv],cx=(L.g[0]+.5)*20+'%',cy=(L.g[1]+.5)*20+'%';
  for(var i=0;i<22;i++){var s=doc.createElement('span');s.className='confetti';s.style.cssText='--cx:'+cx+';--cy:'+cy+';--tx:'+(Math.random()*240-120)+'px;--ty:'+(Math.random()*-200+40)+'px;--r:'+(Math.random()*720-360)+'deg;background:'+cols[i%5];board.appendChild(s);setTimeout(function(n){n.remove()}.bind(null,s),1200)}
 }
 runB.addEventListener('click',function(){
  if(running)return;if(!prog.length){say(T.start,'bad');return}
  var L=LV[lv];clearTrail();setPos(L.s[0],L.s[1],'R');lock(true);say(T.run);
  var i=0,items=$$('li',list);
  (function step(){
   items.forEach(function(li){li.classList.remove('now')});
   if(i>=prog.length){lock(false);say(T.short,'bad');return}
   var m=prog[i],d=MOV[m],nx=pos[0]+d[0],ny=pos[1]+d[1];items[i].classList.add('now');
   robo.firstChild.style.transform=ROT[m];
   if(nx<0||ny<0||nx>4||ny>4||isWall(nx,ny)){
    robo.classList.remove('bump');void robo.offsetWidth;robo.classList.add('bump');
    say(nx<0||ny<0||nx>4||ny>4?T.edge:T.bump,'bad');
    setTimeout(function(){robo.classList.remove('bump');lock(false);items.forEach(function(li){li.classList.remove('now')})},500);return;
   }
   var cell=board.children[pos[1]*5+pos[0]];if(cell)cell.classList.add('trail');
   setPos(nx,ny);i++;
   if(nx===L.g[0]&&ny===L.g[1]){
    setTimeout(function(){
     items.forEach(function(li){li.classList.remove('now')});
     robo.classList.add('win');confetti();running=false;
     var last=lv===LV.length-1;
     say(last?T.done:T.win,'good');
     dots[lv].className='done';
     nextB.querySelector('span').textContent=last?T.again:T.next;
     next.hidden=false;cta.hidden=!last;
     setTimeout(function(){robo.classList.remove('win')},1300);
     nextB.focus({preventScroll:true});
    },STEP*.8);return;
   }
   setTimeout(step,STEP);
  })();
 });
 nextB.addEventListener('click',function(){lv=(lv+1)%LV.length;build()});
 build();
}
})();
