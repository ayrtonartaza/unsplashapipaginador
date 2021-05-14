const form = document.querySelector('form');
const input = document.querySelector('input');
const btn = document.querySelector('button');
const container__cards = document.querySelector('#container__cards')
const navpaginas = document.querySelector('#nav');
const title__cards = document.querySelector('#title__cards');

let termino='';
let paginaActual=1;

const registrosPorPagina = 24;
let totalPaginas;
let iterador;

document.addEventListener('DOMContentLoaded',consumirApi())
form.addEventListener('submit',(e)=>{
  e.preventDefault();
  termino = input.value
  consumirApi()
})




async function consumirApi(){
  termino = input.value
  const key ='16397860-bfba6825dd4ed2b84bd73383c';
  const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`; 
  try {
        const respuesta = await fetch(url);
        const respuestajson = await respuesta.json()
        totalPaginas = calcularPaginas(respuestajson.totalHits);
        mostrarDatos(respuestajson)
        console.log(respuesta)
  } catch (error) {
        console.log(error)
  }
}

/* en base a la cantidad de paginas va a crear los botones */
function *paginador(total){
    for (let i=1; i <= total; i++) {
        yield i;
    }
}

/* calcula las paginas en base a los totalhits de la api y los registros que uno mismo determina */
function calcularPaginas(total){
    return parseInt( Math.ceil(total / registrosPorPagina));
}

function mostrarDatos(respuesta){
    console.log(respuesta)
    /* escribe el termino al comenzar y si esta vacio o no */
    if(termino === ''){
        title__cards.textContent ='Todas';
    }else{
    title__cards.textContent =termino;
    }
    console.log(respuesta)
    /* escribe las fotos */
    if(respuesta.total > 0){
    container__cards.innerHTML ="";
    respuestahits= respuesta.hits;
        /* title__cards.textContent =respuesta; */
            respuestahits.forEach(i=>{
                container__cards.innerHTML+=`
                <div class="flex flex-col card">
                <img
                  src="${i.previewURL}"
                  class="rounded-t-md h-56 md:min-h-32 md:max-h-32"
                  alt=""
                />
                <div
                  class="
                    bg-white
                    h-10
                    rounded-b-md
                    px-2
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span class="font-Montserrat text-sm font-medium p-0"
                    >${i.likes} likes </span
                  >
                  <img src="img/heart.svg" class="h-5 " alt="" />
                </div>
                `
            })
        /* limpiar paginador */
        while(navpaginas.firstChild){
            navpaginas.removeChild(navpaginas.firstChild)
        }  
        /* escribe los botones */
        imprimirPaginador()

    }
    else if(respuesta.total >= 0 ){
        container__cards.innerHTML ="No existen resultados";
        /* limpiar paginador */
        while(navpaginas.firstChild){
        navpaginas.removeChild(navpaginas.firstChild)
    }
}else{
    title__cards.textContent='Todas';
}

}

/* Crea los botones y llama a la Api en base al boton clickeado(la api misma da la opcion de pagina) */
function imprimirPaginador(){
    iterador = paginador(totalPaginas)

    while(true){
        const { value, done} = iterador.next();
        if(done){
            return;
        }

        const boton = document.createElement('a');
        boton.href ='#';
        boton.dataset.pagina = value;
        boton.textContent = value; 
        /* boton.style.className='border border-primary rounded-sm px-1 text-primary'; */
        navpaginas.appendChild(boton);
        boton.onclick=()=>{
            paginaActual = value;
            /* llama de nuevo a la api con la nueva pagina actual(sacado del value del boton
            clickeado) */
            consumirApi()
        }
    }
}



