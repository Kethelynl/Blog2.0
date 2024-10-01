menu = document.getElementById('menu')

click = 1
function showMenu(){
    lista = document.getElementById('nav-list2');
    if(click == 1){
        lista.classList.remove('active')
        click = 2
    }else if(click == 2){
        lista.classList.add('active')
        click = 1
    }
}
menu.addEventListener('click', showMenu)