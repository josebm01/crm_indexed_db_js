const conectarDB = () => {
    const openConnection = window.indexedDB.open('crm', 1)
    
    // En caso de haber un error al intentar conectarse
    openConnection.onerror = () => {
        console.log("Ocurrió un error")
    }

    // Cuando se haya conectado correctamente
    openConnection.onsuccess = () => {
        DB = openConnection.result
    }
}



//* Muestra mensaje de alerta
const imprimirAlerta = ( mensaje, tipo ) => {

    // Evitando múltiples alertas
    const alerta = document.querySelector('.alerta')

    if ( !alerta ) {

        //? Crear la alerta
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alerta') // Se agrega clase alerta para identificarla
        
        if ( tipo === 'error' ){
            divMensaje.classList.add('bg-red-100', 'border-red-100', 'text-red-700')
        } else {
            divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700')
        }

        // Agregando el texto del mensaje a la alerta
        divMensaje.textContent = mensaje
        
        // Agregando al DOM
        formulario.appendChild(divMensaje)


        // Removiendo el mensaje después de un tiempo
        setTimeout(() => {
            divMensaje.remove()
        }, 3000)

    }

}

