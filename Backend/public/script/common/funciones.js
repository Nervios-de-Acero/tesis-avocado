const funcioneslistItems = {
    agregarItem: (e) =>{

        const elemento = e.target;
        let largoMascara;
    
        //Para event listener de Click/Enter
        if(elemento.id.includes('btn')){
            
            e.preventDefault();
            largoMascara = 3;
        } else if(elemento.id.includes('input')){
    
            if(e.key === 'Enter'){
                
                e.preventDefault();
                largoMascara = 6;
            } else{
    
                return;
            }
        }

        //Datos Importantes
        const lista = elemento.dataset.lista === 'true' ? true : false;
    
        const indexMascara = elemento.id.indexOf('btn');
        const tipoElemento = elemento.id.slice(indexMascara + largoMascara);
    
        const container = document.querySelector(`#container${tipoElemento}`);

        const idElemento = lista ? `select${tipoElemento}` :`input${tipoElemento}`;

        const elementoDatos = document.getElementById(idElemento);

        //Control por campo vacio
        if(elementoDatos.value.trim() === ''){

            if(lista){

                alert(`Debe seleccionar un/a ${tipoElemento.toLowerCase()}`);
            } else{

                alert(`Campo ${tipoElemento.toLowerCase()} vacío`);
            }

            elementoDatos.value = elementoDatos.value.trim(); 
            elementoDatos.focus();
            return;
        }
    
        
        //Controlamos que el elemento de la lista no este seleccionado ya
        let opcionSeleccionada;

        if(lista){

            opcionSeleccionada = elementoDatos.value.slice(0, elementoDatos.value.indexOf('-'));

            let cortePorRepeticion;

            container.querySelectorAll('.item').forEach((item)=>{

                if(item.dataset.itemId === opcionSeleccionada){

                    cortePorRepeticion = true;
                }
            });

            if(cortePorRepeticion){

                alert('Este elemento ya fue agregado');
                return;
            }
        }

        //Nuevo Elemento
        const idNuevoItem = container.querySelectorAll('.item').length;
    
        let nuevoItem = document.createElement('div');
        nuevoItem.classList.add('item');
        nuevoItem.dataset.itemTipo = tipoElemento;
        nuevoItem.dataset.itemId = lista? opcionSeleccionada : idNuevoItem;
        
        nuevoItem.innerHTML = `
        <div class="itemContenido">${elementoDatos.value}</div>
        <input class="btn btn-sm btn-secondary btnBorrarItem" type="button" value="X">
        `;
        
        //Guardamos los cambios
        const inputOculto = document.querySelector(`#inputHidden${tipoElemento}`);

        let arrayItems = JSON.parse(inputOculto.value);

        if(lista){

            arrayItems.push(parseInt(opcionSeleccionada));
        } else{

            arrayItems.push(elementoDatos.value);
        }

        inputOculto.value = JSON.stringify(arrayItems);

        elementoDatos.value = '';

        container.append(nuevoItem);
    },
    agregarItemManual: (itemDato, tipoElemento) =>{

        //Datos Importantes
    
        const container = document.querySelector(`#container${tipoElemento}`);

        //Nuevo Elemento
        const idNuevoItem = container.querySelectorAll('.item').length;
    
        let nuevoItem = document.createElement('div');
        nuevoItem.classList.add('item');
        nuevoItem.dataset.itemTipo = tipoElemento;
        nuevoItem.dataset.itemId = idNuevoItem;
        
        nuevoItem.innerHTML = `
        <div class="itemContenido">${itemDato}</div>
        <input class="btn btn-sm btn-secondary btnBorrarItem" type="button" value="X">
        `;
        
        //Guardamos los cambios
        const inputOculto = document.querySelector(`#inputHidden${tipoElemento}`);

        //Se agrega el dato al input oculto
        let arrayItems = [];

        arrayItems.push(itemDato);
        
        inputOculto.value = JSON.stringify(arrayItems);

        container.append(nuevoItem);
    },
    configurarContenedores: (e) =>{
    
        const contenedoresItems = document.querySelectorAll(`.containerItems`);
    
        contenedoresItems.forEach((contenedor) =>{
    
            contenedor.addEventListener('click', (e) =>{
    
                e.preventDefault();
                const itemsDelContenedor = Array.from(contenedor.querySelectorAll('.item'));
    
                const elemento = e.target;
    
                if(elemento.classList.contains('btnBorrarItem')){
    
                    const item = elemento.closest('.item');
                    const tipoElemento = item.dataset.itemTipo;
                    const idItem = itemsDelContenedor.indexOf(item);
                    inputHiddenIngredientes
                    const inputOculto = document.querySelector(`#inputHidden${tipoElemento}`);
                    
                    let arrayItems = JSON.parse(inputOculto.value);
                    arrayItems.splice(idItem, 1);
                    inputOculto.value = JSON.stringify(arrayItems);
    
                    item.remove();
                }
            });
        });
    },
}

const funcionesPeticiones = {

    enviarFormulario: async (url, formData, callback)=>{
        
        try{
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers:{
                    authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20iLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNzE1ODE3NjQ1LCJleHAiOjE3MTU4MjEyNDV9.U8QNPkwilMKcxcgg_MtC9vQFCwj_vTdEX4IMLKKYBHA',
                }
            });
    
            callback(await response);
            
        } catch(error){
    
            console.log(error);
        }
    
        return;
    },
    getDatos: async (url, callback)=>{

        callback = callback || null;

        if(!callback){

            return;
        }

        try{

            const response = await fetch(url, {
                method: 'GET',
            });

            callback(await response.json());

        } catch(error){

            console.log(error);
        }
    }
}

export { funcioneslistItems, funcionesPeticiones };