const lerp = (a,b,n)=> (1-n)*a + n*b;

let mouse = { x:0, y:0 };
window.addEventListener('mousemove', e=>{
  mouse.x = e.clientX / window.innerWidth - .5;
  mouse.y = e.clientY / window.innerHeight - .5;
});
