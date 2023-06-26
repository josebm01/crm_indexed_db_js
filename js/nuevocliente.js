(function(){
    let DB

    const q = document.querySelector.bind(document)
    const formulario = q('#formulario')

    
    //* Conectarse a la DB
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB()

        formulario.addEventListener('submit', validarCliente)
    })


    
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



    //* Validaciones en los campos
    const validarCliente = (e) => {
        e.preventDefault()

        //? Leer todos los inputs
        const nombre = q('#nombre').value
        const email = q('#email').value
        const telefono = q('#telefono').value
        const empresa = q('#empresa').value

        //? Validando que no sean valores vacíos
        if ( nombre === '' || email === '' || telefono === '' || empresa === '' ){
            imprimirAlerta('Todos los campos son obligatorios', 'error')
            return 
        }

        //? Crear un objeto con la información del cliente
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()
        }

        // Otra forma de agregar la propiedad
        // cliente.id = Date.now()

        crearNuevoCliente(cliente)

    }


    
    //* Creando nuevo cliente pasando un objeto con la información
    const crearNuevoCliente = ( cliente ) => {
        // Agregando el cliente por medio de la Transacción
        const transaction = DB.transaction(['crm'], 'readwrite')
        const objectStore = transaction.objectStore('crm')
        objectStore.add(cliente)
        
        
        // Error en la transacción
        transaction.onerror = () => {
            imprimirAlerta('Ha ocurrido un error', 'error')
        }

        // Transación correcta
        transaction.oncomplete = () => {
            console.log("Cliente Agregado")

            imprimirAlerta('El cliente ha sido agregado correctamente')

            // Reedirigiendo a otra vista
            setTimeout(() => {
                window.location.href = 'index.html'
            }, 2000)
        }

    }


})()