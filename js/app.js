//* IIFE - Mantienen los datos en este archivo y no se puede acceder desde otros 
( function(){

    // Variables globales
    let DB
    const q = document.querySelector.bind(document)
    const listadoClientes = q('#listado-clientes')
    
    
    // Cuando el contenido se encuentre cargado se ejecuta las funciones que contiene
    document.addEventListener('DOMContentLoaded', () => {
        crearDB()

        // Validando que se haya creado la bd para mostrar los clientes almacenados
        if ( window.indexedDB.open('crm', 1) ){
            obtenerClientes()
        }

        // Registrando un evento en el botón de eliminar
        listadoClientes.addEventListener('click', eliminarRegistro)
    })




    const eliminarRegistro = (e) => {
        // Validando que sea el enlace de eliminar
        if ( e.target.classList.contains('eliminar')){
            //? Accediendo al valor del data (atributo personalizado) y convirtiendolo a número porque es un string inicialmente
            const idEliminar = Number(e.target.dataset.cliente)

            const confirmar = confirm('¿Está seguro de eliminar este cliente?')

            if ( confirmar ) {
                //? Transación para elimnar 
                const transaction = DB.transaction(['crm'], 'readwrite')
                const objectStore = transaction.objectStore('crm')
                
                // Eliminado registro 
                objectStore.delete(idEliminar)

                transaction.oncomplete = () => {
                    console.log('Eliminando registro')
                    //? Aplicando traversing en el DOM para eliminar el elemento del padre y actualizar al eliminar un registro 
                    e.target.parentElement.parentElement.remove()
                }

                transaction.onerror = () => {
                    console.log("Ha ocurrido un error al eleiminar el registro")
                }
            }

        }
    }



    //? Crea la base de datos de IndexDB
    const crearDB = () => {
        const crearDB = window.indexedDB.open('crm', 1)
        
        // En caso se ocurrir un error
        crearDB.onerror = () => {
            console.log("Ha ocurrido un error")
        }

        // Si todo sale correctamente
        crearDB.onsuccess = () => {
            DB = crearDB.result
        }

        // Solo se ejecuta una vez
        crearDB.onupgradeneeded = (e) => {
            // Resultado obtenido de la bd
            const db = e.target.result

            //? Se especifica que se identificará cada registro con el id y será autoincrementable
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true })

            //? Definiendo columnas
            // nombre de columna y key path (referencia)
            objectStore.createIndex('nombre', 'nombre', { unique: false })
            objectStore.createIndex('email', 'email', { unique: true })
            objectStore.createIndex('telefono', 'telefono', { unique: false })
            objectStore.createIndex('empresa', 'empresa', { unique: false })
            objectStore.createIndex('id', 'id', { unique: true })

            console.log("DB Lista y Creada")
        }

    }



    const obtenerClientes = () => {
        //? Validando la conexión a la db
        const openConnection = window.indexedDB.open('crm', 1)
        
        // Error en la conexión
        openConnection.onerror = () => {
            console.log("Ha ocurrido un error al conectarse con la base de datos");
        }

        // Conexión correcta
        openConnection.onsuccess = () => {
            DB = openConnection.result

            //? Leyendo los datos de la bd - Especificando la base y el objectStore
            const objectStore = DB.transaction('crm').objectStore('crm')
            
            //? Listando datos 
            objectStore.openCursor().onsuccess = (e) => {
                
                // Obteniendo los resultados del evento 
                const cursor = e.target.result                
                
                if ( cursor ){
                    const { nombre, empresa, email, telefono, id } = cursor.value
                    listadoClientes.innerHTML += ` 
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>`
                    

                    // Yendo al siguiente valor 
                    cursor.continue()
                } else {
                    console.log("No hay más registros")
                }
            }
        }
    }

})()