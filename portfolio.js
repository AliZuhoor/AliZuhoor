// Photo viewer: the full photo lifts out of its frame, flies to the centre, and flies back on close
(function(){
  var cur=null,img,back,clone,btn,a1,a2,closing=false;
  var D=matchMedia('(prefers-reduced-motion: reduce)').matches?1:620,E='cubic-bezier(.2,.8,.2,1)';
  function open(el){
    if(cur)return;
    img=el.tagName==='IMG'?el:el.querySelector('img');if(!img)return;
    cur=el;closing=false;
    var frame=el.closest('.frame')||img,r=img.getBoundingClientRect(),bw=img.offsetWidth,bh=img.offsetHeight,vw=innerWidth,vh=innerHeight;
    var m=new DOMMatrix(getComputedStyle(frame).transform);
    var ang=Math.atan2(m.b,m.a)*180/Math.PI,sc=Math.hypot(m.a,m.b)||1;
    var nw=img.naturalWidth||+img.getAttribute('width'),nh=img.naturalHeight||+img.getAttribute('height');
    var na=nw/nh,ba=bw/bh,cw,ch,px,py,clip;
    if(na>ba){ch=bh;cw=bh*na;px=cw/2;py=ch/2;clip='inset(0px '+(cw-bw)/2+'px 0px '+(cw-bw)/2+'px)';}
    else{cw=bw;ch=bw/na;px=cw/2;py=bh/2;clip='inset(0px 0px '+(ch-bh)+'px 0px)';}
    var s=Math.min(vw*.94/cw,(vh-100)/ch,5);
    var dx=r.left+r.width/2-vw/2,dy=r.top+r.height/2-vh/2;
    var tx=-s*(cw/2-px),ty=-s*(ch/2-py);
    clone=document.createElement('img');clone.src=img.currentSrc||img.src;clone.alt=img.alt;clone.className='fly';
    clone.style.cssText='width:'+cw+'px;height:'+ch+'px;left:'+(vw/2-px)+'px;top:'+(vh/2-py)+'px;transform-origin:'+px+'px '+py+'px';
    back=document.createElement('div');back.className='fly-back';
    btn=document.createElement('button');btn.className='fly-x';btn.type='button';btn.textContent='Close';
    document.body.append(back,clone,btn);
    img.classList.add('is-open');
    a1=clone.animate([{transform:'translate('+dx+'px,'+dy+'px) rotate('+ang+'deg) scale('+sc+')',clipPath:clip},{transform:'translate('+tx+'px,'+ty+'px) rotate(0deg) scale('+s+')',clipPath:'inset(0px 0px 0px 0px)'}],{duration:D,easing:E,fill:'both'});
    a2=back.animate([{opacity:0},{opacity:1}],{duration:D,fill:'both'});
    btn.animate([{opacity:0},{opacity:1}],{duration:D,fill:'both'});
    btn.focus({preventScroll:true});
  }
  function finish(){
    var el=cur;back.remove();clone.remove();btn.remove();
    img.classList.remove('is-open');cur=null;closing=false;el.focus({preventScroll:true});
  }
  function close(instant){
    if(!cur||closing)return;closing=true;
    if(instant===true){finish();return;}
    a1.onfinish=finish;a1.reverse();a2.reverse();
    btn.getAnimations().forEach(function(x){x.reverse();});
  }
  document.addEventListener('click',function(e){
    var t=e.target;
    if(cur){if(t===back||t===clone||t===btn)close();return;}
    var el=t.closest&&t.closest('[data-zoom]');if(el)open(el);
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape')close();
    else if((e.key==='Enter'||e.key===' ')&&!cur&&document.activeElement&&document.activeElement.matches('[data-zoom]')){e.preventDefault();open(document.activeElement);}
  });
  addEventListener('resize',function(){close(true);});
})();

// Contour lines inspired by mountain terrain
(function(){
  var svg=document.getElementById('topo'),W=1200,H=700,NS='http://www.w3.org/2000/svg';
  svg.setAttribute('viewBox','0 0 '+W+' '+H);
  var g=document.createElementNS(NS,'g');svg.appendChild(g);
  var cx=900,cy=330,rings=15;
  for(var r=1;r<=rings;r++){
    var pts=[],n=90,base=r*38;
    for(var i=0;i<n;i++){
      var a=i/n*Math.PI*2;
      var wob=1+0.18*Math.sin(a*3+r*0.35)+0.1*Math.sin(a*5-r*0.2)+0.06*Math.cos(a*7+r*0.5);
      pts.push([cx+Math.cos(a)*base*wob*1.35,cy+Math.sin(a)*base*wob*0.95]);
    }
    var d='M'+pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join('L')+'Z';
    var p=document.createElementNS(NS,'path');p.setAttribute('d',d);
    if(r%5===0)p.setAttribute('class','hi');
    g.appendChild(p);
  }
})();

// Theme toggle
(function(){
  var root=document.documentElement,btn=document.getElementById('theme');
  btn.addEventListener('click',function(){
    var dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
    var cur=root.getAttribute('data-theme')||(dark?'dark':'light');
    root.setAttribute('data-theme',cur==='dark'?'light':'dark');
  });
})();
