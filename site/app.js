(function(){
  var isHome=document.body.hasAttribute('data-home');

  /* 草：GitHub Actionsが毎日 contributions.json を作り直す */
  var g=document.getElementById('graph');
  if(g) fetch('contributions.json',{cache:'no-cache'}).then(function(r){return r.ok?r.json():null;}).then(function(d){
    if(!d||!d.levels) return;
    var f=document.createDocumentFragment();
    for(var i=0;i<d.levels.length;i++){var c=document.createElement('i');c.setAttribute('data-l',d.levels[i]);f.appendChild(c);}
    g.appendChild(f);g.parentNode.scrollLeft=g.parentNode.scrollWidth;
    document.getElementById('ctotal').textContent=d.total+' / year';
    g.setAttribute('aria-label','GitHub contributions: '+d.total+' in the last year');
  }).catch(function(){});

  /* 累計アクセス：自宅サーバーのカウンター。同じブラウザからは1日1回だけ数える。届かないときは表示しない */
  if(isHome&&document.getElementById('visits')) (function(){
    var api='https://thidwave-pc.tail103e61.ts.net/counter',today=new Date().toISOString().slice(0,10),hit=true;
    try{hit=localStorage.getItem('visited')!==today;}catch(e){}
    var ctl=window.AbortController?new AbortController():null;if(ctl) setTimeout(function(){ctl.abort();},5000);
    fetch(api+(hit?'?hit=1':''),{cache:'no-store',signal:ctl?ctl.signal:undefined}).then(function(r){return r.ok?r.json():null;}).then(function(d){
      if(!d||typeof d.total!=='number') return;
      if(hit){try{localStorage.setItem('visited',today);}catch(e){}}
      document.getElementById('vcount').textContent=d.total.toLocaleString('ja-JP');
      document.getElementById('visits').hidden=false;
    }).catch(function(){});
  })();

  /* 日本語／英語 */
  var EN={visits:"Total visits",role:"Maker / Cosme Ingredient Notes",since:"GitHub",less:"Less",more:"More",latestK:"Posting daily",latestT:"#コスメ成分ノート",latestS:"X at 9:00 / 13:00 / 19:00",
    product:"Things I made",productSub:"Things I've built so far.",seeMore:"See more",live:"Live",open:"Open app",
    p2n:"Skincare Book",p2d:"A free PWA to register your cosmetics and plan morning and night routines by weekday. It also flags overlapping ingredients and combinations said to irritate.",
    p4n:"Workout Log",p4d:"A workout PWA for the gym that fills in your next weights automatically. Start from a template; no login, data stays on your device.",
    p5n:"Japan Cosmetic Exam Lv.1 Study Notes",p5d:"A study PWA for the exam: study plan, per-question records and accuracy, a mistakes notebook, and last-minute flashcards.",
    p6n:"Cosmetic Ingredient Exam Lv.1 Study Notes",p6d:"A study PWA with ingredient notes, practice-question records and accuracy, and last-minute flashcards.",own:"Unofficial",
    cosme:"What I post",cosmeSub:"Short notes on one cosmetic ingredient at a time, every day.",cnT:"4 posts a day",cnS:"X 3 times a day · Instagram at 9:00",
    xTitle:"X (3 times a day)",xDesc:"A series of ingredient notes. Browse past posts with the tag #コスメ成分ノート.",igTitle:"Instagram (every morning at 9)",igDesc:"One ingredient note a day, as a card image.",noteDesc:"Longer writing goes on note.",
    me:"About me",meSub:"A bit about me.",meText:"I love cosmetic ingredients and building small apps that make everyday life easier. I keep up strength training, too.",
    likes:"Likes",hobby:"Hobbies",studying:"Studying for",t1:"Cosmetic ingredients",t2:"Skincare",t3:"Making apps",t4:"Strength training",t5:"Posting",t6:"Japan Cosmetic Exam Lv.1",t7:"Cosmetic Ingredient Exam Lv.1",
    env:"Setup",envMain:"Main",envServer:"Server",envServerV:"Windows PC at home",
    links:"Links",linksSub:"Where to find me on social media and other services."};
  var JA={}; document.querySelectorAll('[data-i18n]').forEach(function(el){JA[el.dataset.i18n]=el.textContent;});
  function setLang(l){
    var d=l==='en'?EN:JA;
    document.querySelectorAll('[data-i18n]').forEach(function(el){var v=d[el.dataset.i18n];if(v!=null)el.textContent=v;});
    document.documentElement.lang=l;
    document.querySelectorAll('.lang button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.lang===l));});
    try{localStorage.setItem('lang',l);}catch(e){}
  }
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.lang);});});
  try{if(localStorage.getItem('lang')==='en')setLang('en');}catch(e){}
})();
