import { funcioneslistItems } from '/script/common/funciones.js';

//#region Variables

let listas = [];

//#endregion

//#region Elementos DOM

const btnSubmit = document.getElementById('btnSubmit'); 
const btnPasos = document.getElementById('btnPasos'); 
const btnIngredientes = document.getElementById('btnIngredientes'); 

const inputIngredientes = document.getElementById('inputIngredientes'); 
const inputPasos = document.getElementById('inputPasos'); 
const inputTitulo = document.getElementById('inputTitulo'); 
const inputTiempoCoccion = document.getElementById('inputTiempoCoccion'); 
const inputDificultad = document.getElementById('inputDificultad'); 
const inputImagen = document.getElementById('inputImagen'); 
const textareaDescripcion = document.getElementById('textareaDescripcion');

const inputHiddenIngredientes = document.getElementById('inputHiddenIngredientes'); 
const inputHiddenPasos = document.getElementById('inputHiddenPasos'); 

const containerIngredientes = document.getElementById('containerIngredientes'); 
const containerPasos = document.getElementById('containerPasos'); 

const formReceta = document.getElementById('formReceta'); 

//#endregion

//#region Funciones

const validacionesSubmit = ()=>{

    let errores = [];

    if(!inputTitulo.value.trim()){

        errores.push('titulo');
    }

    if(!textareaDescripcion.value.trim()){

        errores.push('descripcion');
    }

    listas.forEach((lista)=>{

        const items = lista.container.querySelector('.item');

        if(!items){

            switch(lista.tipoElemento){
    
                case 'Ingredientes':
    
                    errores.push('ingredientes');
                    break;
                
                case 'Pasos':
    
                    errores.push('pasos');
                    break;
            }
        }
    });

    let validacion = '';

    if(errores.length > 0){


        errores.forEach((error)=>{

            switch(error){

                case 'titulo':
                    
                    validacion += '\n-Título vacío';
                    break;

                case 'descripcion':
                    
                    validacion += '\n-Descripción vacía';
                    break;

                case 'ingredientes':
                    
                    validacion += '\n-Lista de ingredientes vacía';
                    break;

                case 'pasos':

                    validacion += '\n-Lista de pasos vacía';
                    break;
            }
        });
    } else{

        validacion = '';
    }

    return validacion;
}

const enviarReceta = async (url, formData, callback) =>{

    try{

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if(await response.ok){

            callback(await response);
        }
        
    } catch(error){

        console.log(error);
    }

    return;
}
//#endregion

//#region Event Listeners

window.addEventListener('load', (e) =>{

    inputHiddenIngredientes.value = JSON.stringify([]);
    inputHiddenPasos.value = JSON.stringify([]);

    const containers = document.querySelectorAll('.containerItems');
    containers.forEach((container)=>{

        const tipoElemento = container.id.slice(9);
        listas.push({
            tipoElemento: tipoElemento,
            container: container,
        });
    });


    funcioneslistItems.configurarContenedores();
});

btnIngredientes.addEventListener('click', funcioneslistItems.agregarItem);

btnPasos.addEventListener('click', funcioneslistItems.agregarItem);

btnSubmit.addEventListener('click', (e) =>{

    e.preventDefault();

    const validacion = validacionesSubmit();

    if(validacion){

        alert(`Errores en la receta: ${validacion}`);
        return;
    }

    const containers = document.querySelectorAll('.containerItems');

    const formData = new FormData();

    formData.append('titulo', inputTitulo.value);
    formData.append('tiempoCoccion', inputTiempoCoccion.value);
    formData.append('dificultad', inputDificultad.value);
    formData.append('imagen', inputImagen.value);
    formData.append('descripcion', textareaDescripcion.value);
    formData.append('ingredientes', inputHiddenIngredientes.value);
    formData.append('pasos', inputHiddenPasos.value);

    const url = './crearReceta';

    enviarReceta(url, formData, async (response)=>{

        console.log(await response);
    });
});

inputIngredientes.addEventListener('keypress', funcioneslistItems.agregarItem)

inputPasos.addEventListener('keypress', funcioneslistItems.agregarItem)

//#endregion