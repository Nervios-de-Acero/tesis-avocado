const funcioneslistItems = {
    listas: [],
    agregarItem: (e) =>{

        const elemento = e.target;
        let largoMascara;
    
        if(elemento.id.indexOf('btn') !== -1){
            
            e.preventDefault();
            largoMascara = 3;
        } else if(elemento.id.indexOf('input') !== -1){
    
            if(e.key === 'Enter'){
                
                e.preventDefault();
                largoMascara = 6;
            } else{
    
                return;
            }
        }
    
        const indexMascara = elemento.id.indexOf('btn');
        const tipoElemento = elemento.id.slice(indexMascara + largoMascara);
    
        const container = document.querySelector(`#container${tipoElemento}`);
        const inputTexto = document.querySelector(`#input${tipoElemento}`);

        if(inputTexto.value === ''){

            alert(`Campo ${tipoElemento.toLowerCase()} vacío`);
            return;
        }
    
        const idNuevoItem = container.querySelectorAll('.item').length;
    
        let nuevoItem = document.createElement('div');
        nuevoItem.classList.add('item');
        nuevoItem.dataset.itemTipo = tipoElemento;
        nuevoItem.dataset.itemId = idNuevoItem;
    
        nuevoItem.innerHTML = `
        <div class="itemContenido">${inputTexto.value}</div>
        <input class="btn btn-sm btn-secondary btnBorrarItem" type="button" value="X">
        `;
        
        const inputOculto = document.querySelector(`#inputHidden${tipoElemento}`);

        let arrayItems = JSON.parse(inputOculto.value);
        arrayItems.push(inputTexto.value);
        inputOculto.value = JSON.stringify(arrayItems);

        inputTexto.value = '';

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

export { funcioneslistItems };