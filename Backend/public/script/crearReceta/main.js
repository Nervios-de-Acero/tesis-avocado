import { funcioneslistItems, funcionesPeticiones } from '/script/common/funciones.js';

//#region Variables

let listas = [];

//#endregion

//#region Elementos DOM

const btnIngredientes = document.getElementById('btnIngredientes'); 
const btnCategorias = document.getElementById('btnCategorias'); 
const btnPasos = document.getElementById('btnPasos'); 
const btnSubmit = document.getElementById('btnSubmit'); 

const inputIngredientes = document.getElementById('inputIngredientes'); 
const selectCategorias = document.getElementById('selectCategorias'); 
const inputPasos = document.getElementById('inputPasos'); 
const inputTitulo = document.getElementById('inputTitulo'); 
const inputTiempoCoccion = document.getElementById('inputTiempoCoccion'); 
const inputDificultad = document.getElementById('inputDificultad'); 
const inputImagen = document.getElementById('inputImagen'); 
const textareaDescripcion = document.getElementById('textareaDescripcion');

const inputHiddenIngredientes = document.getElementById('inputHiddenIngredientes'); 
const inputHiddenPasos = document.getElementById('inputHiddenPasos'); 
const inputHiddenCategorias = document.getElementById('inputHiddenCategorias'); 

const containerIngredientes = document.getElementById('containerIngredientes'); 
const containerPasos = document.getElementById('containerPasos'); 
const containerCategorias = document.getElementById('containerCategorias'); 

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
                
                case 'Categorias':
    
                    errores.push('categorias');
                    break;
            }
        }
    });

    let validacion = '';

    const val = {
        "titulo": '\n-Título vacío',
        "descripcion":'\n-Descripción vacía',
        "ingredientes": '\n-Lista de ingredientes vacía',
        "categorias": '\n-Lista de categorías vacía',
        "pasos": '\n-Lista de pasos vacía'
      }

    errores.forEach((error)=>{

        validacion += val[error];
    });

    return validacion;
}

const getCategorias = () =>{


}

//#endregion

//#region Event Listeners

window.addEventListener('load', (e) =>{

    inputHiddenIngredientes.value = JSON.stringify([]);
    inputHiddenPasos.value = JSON.stringify([]);
    inputHiddenCategorias.value = JSON.stringify([]);

    const containers = document.querySelectorAll('.containerItems');
    containers.forEach((container)=>{

        const tipoElemento = container.id.slice(9);
        listas.push({
            tipoElemento: tipoElemento,
            container: container,
        });
    });

    const url = '../admin/getCategorias'
    funcionesPeticiones.getDatos(url, null, (response)=>{

        const arrayCategorias = response.content;
        arrayCategorias.forEach((categoria) =>{


            let nuevaOption = document.createElement('option');
            nuevaOption.innerHTML = `<option>${categoria.idCategoria}-${categoria.nombre}</option>`
            selectCategorias.append(nuevaOption);
        });


    });
    
    selectCategorias.selectedIndex = -1;

    funcioneslistItems.configurarContenedores();
});

btnIngredientes.addEventListener('click', funcioneslistItems.agregarItem);

btnPasos.addEventListener('click', funcioneslistItems.agregarItem);

btnCategorias.addEventListener('click', funcioneslistItems.agregarItem);

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
    formData.append('categorias', inputHiddenCategorias.value);

    const url = '../admin/agregarReceta';

    funcionesPeticiones.enviarFormulario(url, formData, async (response)=>{

        console.log(await response);
    });
});

inputIngredientes.addEventListener('keypress', funcioneslistItems.agregarItem)

inputPasos.addEventListener('keypress', funcioneslistItems.agregarItem)

//#endregion