const wrapper = document.querySelector('[data-slide="wrapper"]')
const sliteWrapper = document.querySelector('[data-slide="slide-wrapper"]')
const navPreviousButton = document.querySelector('[data-slide="nav-previous-button"]')
const navNextButton = document.querySelector('[data-slide="nav-next-button"]')
const controls = document.querySelector('[data-slide="controls"]')
let sliteList = document.querySelectorAll('[data-slide="slide-list"]')
let index_save = null
let number = null
let slideInterval
let controlsButtons

const state = {
    startPoint: 0,// ponto inicial
    savePosition: 0,// salvando a posição atual
    currentPoint: 0,
    moviment: 0,
    currentIndex:0 //salva o index de cada imagem
}

function traslateSlide(position){ /**/ 
    sliteWrapper.style.transform = `translateX(${position}px)`;
    state.savePosition = position
}

function setVisibleSlide({index, animate}){
    const list = sliteList[index]
    const slideWidth = list.clientWidth
    sliteWrapper.style.transition = animate === true ? 'transform .5s': 'none'
    const position = index * slideWidth;
    state.currentIndex = index
    activeControlButton({index})
    traslateSlide(-position)
}

function nextSlide(){  
    setVisibleSlide({index: state.currentIndex + 1, animate:true})
    passImageNext()

}

function previousSlide(){
    setVisibleSlide({index: state.currentIndex - 1,  animate:true})
    passImagePrevious()
}

function createControlButtons(){ /**/ 
    sliteList.forEach(function(){
        const controlsButton = document.createElement('button')
        controlsButton.classList.add('radio-btn')
        controlsButton.setAttribute('data-slide', 'control-button')
        controls.append(controlsButton)
    })
}

function  activeControlButton({index}){
    const list = sliteList[index]
    const dataIndex = Number(list.dataset.index)
    const controlsButton = controlsButtons[dataIndex]
    controlsButtons.forEach(function(controlsButtonsItem){
        controlsButtonsItem.classList.remove('active')
    })
    if(controlsButton)controlsButton.classList.add('active')
}

function createSlideClone(){
    const firstSlide = sliteList[0].cloneNode(true)
    firstSlide.classList.add('slide-cloned')
    firstSlide.dataset.index = sliteList.length

    const lastSlide = sliteList[sliteList.length -1].cloneNode(true)
    lastSlide.classList.add('slide-cloned')
    lastSlide.dataset.index = -1


    sliteWrapper.append(firstSlide)
    sliteWrapper.prepend(lastSlide)

    sliteList = document.querySelectorAll('[data-slide="slide-list"]')
}

function onMouseDown(event, index){ /**/
    const list = event.currentTarget
    state.startPoint = event.clientX // ponto de partida do mouse
    state.currentPoint = event.clientX - state.savePosition //ponto de partida menos o ponto final 
    state.currentIndex = index // salvando o index da imagem
    sliteWrapper.style.transition = 'none'
    list.addEventListener('mousemove', onMouseMove)
}

function onMouseMove(event){
    const movimetNow = event.clientX // movimento atual
    state.moviment = movimetNow - state.startPoint // movimento completo que o usuário fez
    const position = movimetNow - state.currentPoint    
    traslateSlide(position)
    
}

function onMouseUp(event){
    const list = event.currentTarget
    const slideWidth = list.clientWidth
    console.log(slideWidth)
    if(state.moviment < -40){
        nextSlide()
    }else if(state.moviment > 40){
        previousSlide()
    }else{
        setVisibleSlide({index: state.currentIndex,  animate:true})
    }
 
    list.removeEventListener('mousemove', onMouseMove)
}

function onTouchStart(event, index){
    event.clientX = event.touches[0].clientX
    onMouseDown(index, index)
    const list = event.currentTarget
    list.addEventListener('touchmove', onTouchMove)

}

function onTouchEnd(event){
    onMouseUp(event)
    const list = event.currentTarget
    list.addEventListener('touchmove', onTouchMove)
}

function onTouchMove(event){
    event.clientX = event.touches[0].clientX
    onMouseMove(event)
}

function onControllButton(index){
    setVisibleSlide({ index: index + 1,  animate:true }) 
    if(number === null){
        index_save === state.currentIndex
        if(state.currentIndex > index_save){
            passImageNext()
        } else if (state.currentIndex < index_save) {
            passImagePrevious()
        } else {
            console.log('O index atual é igual ao anterior:', index_save);
        }
    }
    index_save = state.currentIndex
}

function onTransitionList(){
    if(state.currentIndex === sliteList.length -1){
        setVisibleSlide({index: 1,  animate:false})
    }
    if(state.currentIndex === 0){
        setVisibleSlide({index: sliteList.length -2,  animate:false})
    }
}

function setAutoPlay(){
    slideInterval = setInterval(function(){
      setVisibleSlide({index: state.currentIndex + 1, animate:true})
      passImageNext()
    }, 6000)
}

function setListeners(){
    controlsButtons = document.querySelectorAll('[data-slide="control-button"]')

    controlsButtons.forEach(function(controlsButton, index){
        controlsButton.addEventListener('click', function(event){
            onControllButton(index)
        })
    })
    
    sliteList.forEach(function(list, index){
        list.addEventListener('dragstart', function(event){// dragstart serve para quando segura e arrasta
           event.preventDefault()
        })
        list.addEventListener('mousedown', function(event){
            onMouseDown(event, index)
        })
        list.addEventListener('mouseup', onMouseUp)
        list.addEventListener('touchstart', function(event){
            onTouchStart(event, index)
        })
        list.addEventListener('touchend', onTouchEnd)
    })

    navNextButton.addEventListener('click', nextSlide)
    navPreviousButton.addEventListener('click', previousSlide)
    sliteWrapper.addEventListener('transitionend', onTransitionList)
    wrapper.addEventListener('mouseenter', function(){
        clearInterval(slideInterval)
    })
    wrapper.addEventListener('mouseleave', function(){
        setAutoPlay()
    })

}

/*  Sistema de imagem do fundo (Banner) */

function changeBanner(){
    const banner = document.getElementById('banner')
    const titulo = document.getElementById('titulo')
    const h2 = document.getElementById('banner-h2')
    const h4 = document.getElementById('banner-h4')

    banner.style.animation = 'none';
    banner.classList.remove('menino','paisagem', 'livros', 'floresta', 'casal');

    // Garantir que o índice esteja dentro dos limites
    if (state.currentIndex < 1) {
        onTransitionList()
    } else if (state.currentIndex > 5) {
        onTransitionList()
    }
    
    if(state.currentIndex == 1){
        banner.classList.add('menino');
        h2.textContent = "Bem vindo ao BlogMY!"
        h4.textContent = "Venha conhecer um novo mundo de aventuras!"
    }else if(state.currentIndex === 2){
        banner.classList.add('paisagem')
        h2.textContent = "compartilhe suas viagens!"
        h4.textContent = "Eternize seus melhores momentos"
    }else if(state.currentIndex === 3){
        banner.classList.add('livros')
        h2.textContent = "Publique Notícias e descobertas"
        h4.textContent = "leia sobre os assuntos que mais gosta e compartilhe suas experiencias sobre."
    }else if(state.currentIndex === 4){
        banner.classList.add('floresta')
        h2.textContent = "Entre no mundo de aventuras!"
        h4.textContent = "Publique suas proprias histórias para todo o mundo!"
    }else if (state.currentIndex == 5){
        banner.classList.add('casal')
        h2.textContent = "Compartilhe momentos"
        h4.textContent = "Poste momentos com quem ama"
    }


    
     // Forçar um "reflow" para garantir que o navegador detecte a mudança
    void banner.offsetWidth;
     
     // Reiniciar a animação
    banner.style.animation = 'pullCurtain 3s forwards';

}

/*  Sistema de imagem do fundo (Banner) passar para direita */
function passImageNext(){
   const nextBanner = document.getElementById('next-banner')
   changeBanner()
   nextBanner.classList.remove('paisagem', 'livros', 'floresta', 'casal','menino');
   if(state.currentIndex == 1){
     nextBanner.classList.add('casal')
   }else if(state.currentIndex == 2){
     nextBanner.classList.add('menino')
   }else if(state.currentIndex == 3){
    nextBanner.classList.add('paisagem')
  }else if(state.currentIndex == 4){
    nextBanner.classList.add('livros')
  }else if(state.currentIndex == 5){
    nextBanner.classList.add('floresta')
  }
}

/*  Sistema de imagem do fundo (Banner) passar para esquerda */
function passImagePrevious(){
    const nextBanner = document.getElementById('next-banner')
    changeBanner()

    nextBanner.classList.remove('paisagem', 'livros', 'floresta', 'casal','menino');
    if(state.currentIndex == 1){
      nextBanner.classList.add('paisagem')
    }else if(state.currentIndex == 2){
      nextBanner.classList.add('livros')
    }else if(state.currentIndex == 3){
     nextBanner.classList.add('floresta')
   }else if(state.currentIndex == 4){
     nextBanner.classList.add('casal')
   }else if(state.currentIndex == 5){
     nextBanner.classList.add('menino')
   }
 }

function initSlider(){
    createControlButtons()
    createSlideClone()
    setListeners()
    setVisibleSlide({index: 1, animate:true})
    changeBanner()
    setAutoPlay()
}


initSlider()