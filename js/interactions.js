document.querySelectorAll('.menu li').forEach(item=>{
  item.addEventListener('click',()=>{
    const id=item.dataset.scroll;
    document.getElementById(id)
      .scrollIntoView({behavior:'smooth'});
  });
});
