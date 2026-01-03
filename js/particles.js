for(let i=0;i<120;i++){
  const p=document.createElement('div');
  p.style.position='fixed';
  p.style.width='2px';
  p.style.height='2px';
  p.style.background='white';
  p.style.opacity='.08';
  p.style.left=Math.random()*100+'vw';
  p.style.top=Math.random()*100+'vh';
  p.style.animation=`float ${10+Math.random()*20}s linear infinite`;
  document.body.appendChild(p);
}
