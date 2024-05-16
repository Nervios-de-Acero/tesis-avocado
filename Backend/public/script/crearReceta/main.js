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

const getCategorias = (categorias) =>{

    const arrayCategorias = categorias.content;
    arrayCategorias.forEach((categoria) =>{

        let nuevaOption = document.createElement('option');
        nuevaOption.innerHTML = `<option>${categoria.idCategoria}-${categoria.nombre}</option>`
        selectCategorias.append(nuevaOption);
    });
}

//#endregion

//#region Event Listeners

window.addEventListener('load', (e) =>{

    let url;

    if(datosConfig.modo === 'Agregar'){
        
        inputHiddenIngredientes.value = JSON.stringify([]);
        inputHiddenPasos.value = JSON.stringify([]);
        inputHiddenCategorias.value = JSON.stringify([]);
        url = '../../admin/getCategorias'
    } else{

        url = `../../../admin/getRecetaById?id=${datosConfig.idReceta}`;
        funcionesPeticiones.getDatos(url, (response) =>{

            const datosReceta = response.content;

            inputTitulo.value = datosReceta.titulo;
            inputTiempoCoccion.value = datosReceta.tiempoCoccion;
            inputDificultad.value = datosReceta.dificultad;
            inputImagen.value = datosReceta.imagen;
            textareaDescripcion.value = datosReceta.descripcion

            datosReceta.ingredientes.forEach((receta) =>{

                funcioneslistItems.agregarItemManual(receta, 'Ingredientes');
            });

            datosReceta.pasos.forEach((paso) =>{

                funcioneslistItems.agregarItemManual(paso, 'Pasos');
            });

            //filtramos

            let categoriasFiltradas = [];
            datosReceta.categorias.forEach((categoria, index, array) =>{
                
                if(categoriasFiltradas.length > 0){

                    if (categoriasFiltradas.some(catFiltrada => catFiltrada.idCategoria === categoria.idCategoria)) {
                        
                        return;
                    }
                }

                categoriasFiltradas.push(categoria);
            });

            categoriasFiltradas.forEach((categoria) =>{

                const formatoCategoria = categoria.idCategoria + '-' + categoria.nombre

                funcioneslistItems.agregarItemManual(formatoCategoria, 'Categorias');
            });
        });

        url = '../../../admin/getCategorias';
    }

    const containers = document.querySelectorAll('.containerItems');
    containers.forEach((container)=>{

        const tipoElemento = container.id.slice(9);
        listas.push({
            tipoElemento: tipoElemento,
            container: container,
        });
    });

    funcionesPeticiones.getDatos(url, (response)=>{

        getCategorias(response);
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

    if(datosConfig.modo === 'Editar'){

        formData.append('idReceta', datosConfig.idReceta)
    }

    let url;

    if(datosConfig.modo === 'Agregar'){

        url = '../../admin/agregarReceta';
    } else if(datosConfig.modo === 'Editar'){
        
        url = '../../../admin/modificarReceta';
    }

    funcionesPeticiones.enviarFormulario(url, formData, async (response)=>{

        switch(response.satus){

            case 200:
                alert(response.message);
                
                if(datosConfig.modo === 'Agregar'){

                    url = '../agregarReceta';
                } else if(datosConfig.modo === 'Editar'){
                    
                    url = '../../modificarReceta';
                }
                
                funcionesPeticiones.getDatos(url)
                break;
            case 401:
                alert(response.message);
                break;
            case 409:
                alert(response);
                break;
            case 500:
                alert(response);
                break;
            default:
                alert(response);
                break;
        }
    });
});

inputIngredientes.addEventListener('keypress', funcioneslistItems.agregarItem)

inputPasos.addEventListener('keypress', funcioneslistItems.agregarItem)

//#endregion