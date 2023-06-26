( function(){

    let DB
    let idCliente

    //? Usando método abreviados
    const q = document.querySelector.bind(document)

    const nombreInput = q('#nombre')
    const emailInput = q('#email')
    const telefonoInput = q('#telefono')
    const empresaInput = q('#empresa')

    const formulario = q('#formulario')

    
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB()
        
        //? Actualiza el registro
        formulario.addEventListener('submit', actualizarCliente)

        //? Verificiar el ID de la URL 
        // Se obtiene algo como => '?id=1687489559517'
        const parametrosURL = new URLSearchParams(window.location.search)        
        idCliente = parametrosURL.get('id')        
        
        // Verificando que exista para ejecutar la función
        if ( idCliente ){
            setTimeout(() => {
                obtenerCliente(idCliente)
            }, 100);
        }
        
    })


    const actualizarCliente = (e) => {
        e.preventDefault()

        // Evitando que no hayan valores vacíos en el formulario
        if ( nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === '' ) {
            imprimirAlerta('Todos los campos son obligatorios', 'error')
            return
        }

        // Valores del cliente actualizados 
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente) // Convirtiendo el string a número 
        }

        //? Transacción para actualizar el cliente
        const transaction = DB.transaction(['crm'], 'readwrite')
        const objectStore = transaction.objectStore('crm')

        objectStore.put(clienteActualizado)

        // Actualizdo correcto
        transaction.oncomplete = () => {
            imprimirAlerta("Editado correctamente")

            // Reedirigiendo a la vista principal
            setTimeout(() => {
                window.location.href = 'index.html'
            }, 2000);
        }

        transaction.onerror = (error) => {
            // Se puede obtener el error en específico dentro de lo que contiene error
            imprimirAlerta('Ocurrió un error al actualizar', 'error')
        }
    }



    const obtenerCliente = ( id ) => {
        //? Creando una transacción
        const transaction = DB.transaction(['crm'], 'readonly')
        const objectStore = transaction.objectStore('crm')

        // Recorriendo los registros de la base 
        const cliente = objectStore.openCursor()
        cliente.onsuccess = (e) => {
            const cursor = e.target.result

            if ( cursor ){
                // Obteniendo la información del usuario seleccionado 
                if ( cursor.value.id === Number(id) ){
                    // Mostrando los datos del usuario seleccionado en el formulario
                    llenarFormulario( cursor.value )
                }
                cursor.continue()
            }
        }
    }



    const llenarFormulario = ( datosCliente ) => {
        const { nombre, email, telefono, empresa } = datosCliente

        // Asignando los valores del registro al formulario HTML
        nombreInput.value = nombre
        emailInput.value = email
        telefonoInput.value = telefono
        empresaInput.value = empresa

    }
    

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
    

})()