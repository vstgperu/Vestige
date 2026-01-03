/* SPA NAVEGACIÓN CON ANIMACIÓN */
const sections=document.querySelectorAll('.section');
const menuItems=document.querySelectorAll('.menu div');

menuItems.forEach(item=>{
  item.addEventListener('click',()=>{
    const target=item.dataset.section;

    sections.forEach(sec=>{
      sec.classList.remove('active');
    });

    requestAnimationFrame(()=>{
      document.getElementById(target).classList.add('active');
    });
  });
});

/* TEMAS */
const themes=['theme-dark','theme-light','theme-pink'];
let currentTheme=0;

document.getElementById('themeToggle').onclick=()=>{
  document.body.classList.remove(themes[currentTheme]);
  currentTheme=(currentTheme+1)%themes.length;
  document.body.classList.add(themes[currentTheme]);
};

/* FONDO REACTIVO */
const bg=document.getElementById('background');

document.addEventListener('mousemove',e=>{
  const x=e.clientX/window.innerWidth*100;
  const y=e.clientY/window.innerHeight*100;
  bg.style.backgroundPosition=`${x}% ${y}%`;
});
