const title = document.querySelectorAll('.omelhor, .linha, .cadastre-se, .btn_cadastrar, .main_suporte, .titulo');

const obs = new  IntersectionObserver((entries) =>{
    entries.forEach(entrie => {
        if(entrie.isIntersecting){
            entrie.target.classList.add('visible');
        }
    });
});

// Aplica o observador a todos os elementos selecionados
title.forEach(titles => {
    obs.observe(titles);
});