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
    agregarItemManual: (itemDato, tipoElemento, tipoEntrada) =>{

        //Datos Importantes
    
        const container = document.querySelector(`#container${tipoElemento}`);

        //Nuevo Elemento
    
        let nuevoItem = document.createElement('div');
        nuevoItem.classList.add('item');
        nuevoItem.dataset.itemTipo = tipoElemento;
        
        //Se crea array con elementos a enviar
        
        const inputOculto = document.querySelector(`#inputHidden${tipoElemento}`);

        let arrayItems = JSON.parse(inputOculto.value);

        //Se consiguen los datos a enviar
        if(tipoEntrada === 'select'){

            const idNuevoItemSelect = parseInt(itemDato.slice(0, itemDato.indexOf('-')));
            nuevoItem.dataset.itemId = idNuevoItemSelect;
            arrayItems.push(idNuevoItemSelect);
            console.log(arrayItems)
        } else{

            const idNuevoItem = container.querySelectorAll('.item').length;
            nuevoItem.dataset.itemId = idNuevoItem;
            arrayItems.push(itemDato);
        }

        //Se crea item en el DOM
        
        nuevoItem.innerHTML = `
        <div class="itemContenido">${itemDato}</div>
        <input class="btn btn-sm btn-secondary btnBorrarItem" type="button" value="X">
        `;
        
        //Guardamos los cambios
        console.log(inputOculto)
        
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

    enviarFormulario: async (url, formData, metodo, callback)=>{
        
        try{

            const token = localStorage.getItem('authorization');
            const response = await fetch(url, {
                method: metodo,
                body: formData,
                headers:{
                    authorization: token,
                }
            });
    
            callback(await response);
            
        } catch(error){
    
            console.log(error);
        }
    
        const token = 'Aca iria el token, como sea que lo asignes...';

        localStorage.setItem('authorization', token);

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