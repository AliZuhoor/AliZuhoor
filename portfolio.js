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

// Lightbox
(function(){
  var d=document.getElementById('lb'),im=d.querySelector('img');
  document.addEventListener('click',function(e){
    var t=e.target;
    if(t.matches&&t.matches('img[data-zoom]')){im.src=t.src;im.alt=t.alt;d.showModal();}
    else if(t===d||t.id==='lbx'){d.close();}
  });
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
