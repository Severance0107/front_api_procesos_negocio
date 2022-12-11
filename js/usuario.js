//funciones js para el modulo de usuarios
const urlApi = "http://localhost:9009";//colocar la url con el puerto

async function login(){
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    var settings={
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }
    const request = await fetch(urlApi+"/auth/login",settings);
    if(request.ok){
        const respuesta = await request.text();        
        localStorage.token = respuesta;     
        location.href= "dashboard.html";
    }
}

function listarUsuarios(){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuarios",settings)
    .then(response => response.json())
    .then(function(data){
        
            var usuarios = `
            <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-list"></i> Listado de usuarios</h1>
                </div>
                  
                <a href="#" onclick="registerForm('true')" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"></i></a>
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody id="listar">`;
            for(const usuario of data){
                console.log(usuario.correo)
                usuarios += `
                
                        <tr>
                            <th scope="row">${usuario.id}</th>
                            <td>${usuario.nombre}</td>
                            <td>${usuario.apellidos}</td>
                            <td>${usuario.correo}</td>
                            <td>
                            <button type="button" class="btn btn-outline-danger" 
                            onclick="eliminaUsuario('${usuario.id}')">
                                <i class="fa-solid fa-user-minus"></i>
                            </button>
                            <a href="#" onclick="verModificarUsuario('${usuario.id}')" class="btn btn-outline-warning">
                                <i class="fa-solid fa-user-pen"></i>
                            </a>
                            <a href="#" onclick="verUsuario('${usuario.id}')" class="btn btn-outline-info">
                                <i class="fa-solid fa-eye"></i>
                            </a>
                            </td>
                        </tr>
                    `;
                
            }
            usuarios += `
            </tbody>
                </table>
            `;
            document.getElementById("datos").innerHTML = usuarios;
    })
}

function eliminaUsuario(id){
    validaToken();
    var settings={
        method: 'DELETE',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuario/"+id,settings)
    .then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        listarUsuarios();
        alertas("Se ha eliminado el usuario exitosamente!",2)
      })
}

function verModificarUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuario/"+id,settings)
    .then(response => response.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Usuario</h1>
                </div>
              
                <form action="" method="post" id="myForm">
                    <input type="hidden" name="id" id="id" value="${usuario.id}">
                    <label for="nombre" class="form-label">First Name</label>
                    <input type="text" class="form-control" name="nombre" id="nombre" required value="${usuario.nombre}"> <br>
                    <label for="apellidos"  class="form-label">Last Name</label>
                    <input type="text" class="form-control" name="apellidos" id="apellidos" required value="${usuario.apellidos}"> <br>
                    <label for="documento"  class="form-label">document</label>
                    <input type="text" class="form-control" name="documento" id="documento" required value="${usuario.documento}"> <br>
                    <label for="correo" class="form-label">correo</label>
                    <input type="correo" class="form-control" name="correo" id="correo" required value="${usuario.correo}"> <br>
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" name="password" required> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarUsuario('${usuario.id}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

async function modificarUsuario(id){
    validaToken();
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/usuario/"+id, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarUsuarios();
    alertas("Se ha modificado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verUsuario(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/usuario/"+id,settings)
    .then(response => response.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Usuario</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Nombre: ${usuario.nombre}</li>
                    <li class="list-group-item">Apellido: ${usuario.apellidos}</li>
                    <li class="list-group-item">Correo: ${usuario.correo}</li>
                    <li class="list-group-item">Documento: ${usuario.documento}</li>
                </ul>`;
              
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

function alertas(mensaje,tipo){
    var color ="warning";
    if(tipo == 1){//success verde
        color="success"
    }
    else{//danger rojo
        color = "danger"
    }
    var alerta =`<div class="alert alert-${color} alert-dismissible fade show" role="alert">
                    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
                        ${mensaje}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                 </div>`;
    document.getElementById("alerta").innerHTML = alerta;
}

function registerForm(auth=false){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar Usuario</h1>
            </div>
              
            <form action="" method="post" id="myFormReg">
                <label for="correo" class="form-label">correo</label>
                <input type="correo" class="form-control" name="correo" id="correo" required> <br>
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarUsuario('${auth}')">Registrar</button>
            </form>`;
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
}

async function registrarUsuario(auth=false){
    var myForm = document.getElementById("myFormReg");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    console.log("data user ",jsonData);
    const request = await fetch(urlApi+"/usuario", {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(function(respuesta){
        console.log("respuesta peticion", respuesta)
    });
    if(auth){
        listarUsuarios();
    }
    alertas("Se ha registrado el usuario exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function modalConfirmacion(texto,funcion){
    document.getElementById("contenidoConfirmacion").innerHTML = texto;
    var myModal = new bootstrap.Modal(document.getElementById('modalConfirmacion'))
    myModal.toggle();
    var confirmar = document.getElementById("confirmar");
    confirmar.onclick = funcion;
}

function salir(){
    localStorage.clear();
    location.href = "index.html";
}

function validaToken(){
    if(localStorage.token == undefined){
        salir();
    }
}


// -------------------------------------------------------------------------- Para articulos

function listarArticulos(){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/articulos",settings)
    .then(response => response.json())
    .then(function(data){

        var articulos = `
            <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-list"></i> Listado de articulos</h1>
                </div>
                  
                <a href="#" onclick="registerFormArticle('true')" class="btn btn-outline-success"><i class="fa-solid fa-user-plus"></i></a>
                <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Codigo</th>
                        <th scope="col">Descripcion</th>
                        <th scope="col">Fecha de resgistro</th>
                        <th scope="col">Categoria</th>
                        <th scope="col">Stock</th>
                        <th scope="col">Precio de compra</th>
                        <th scope="col">Precio de venta</th>
                        </tr>
                    </thead>
                    <tbody id="listar">`;
            for(const articulo of data){
                console.log(articulo.codigo)
                articulos += `
                
                        <tr>

                            <th scope="row">${articulo.id}</th>
                            <th>${articulo.nombre}</th>
                            <th>${articulo.codigo}</th>
                            <th>${articulo.descripcion}</th>
                            <th>${articulo.fechaRegistro}</th>
                            <th>${articulo.categoria.nombre}</th>
                            <th>${articulo.stock}</th>
                            <th>${articulo.precio_compra}</th>
                            <th>${articulo.precio_venta}</th>

                            
                            <td>
                            <button type="button" class="btn btn-outline-danger" 
                            onclick="eliminaArticulo('${articulo.codigo}')">
                                <i class="fa-solid fa-user-minus"></i>
                            </button>
                            <a href="#" onclick="verModificarArticulo('${articulo.codigo}')" class="btn btn-outline-warning">
                                <i class="fa-solid fa-user-pen"></i>
                            </a>
                            <a href="#" onclick="verArticulo('${articulo.codigo}')" class="btn btn-outline-info">
                                <i class="fa-solid fa-eye"></i>
                            </a>
                            </td>
                        </tr>
                    `;
                
            }
            articulos += `
            </tbody>
                </table>
            `;
            document.getElementById("datos").innerHTML = articulos;

    })
}

function registerFormArticle(auth=false){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Registrar articulo</h1>
            </div>
              
            <form action="" method="post" id="myFormReg">
                <input type="hidden" name="id" id="id">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" name="nombre" id="nombre" required> <br>
                <label for="codigo"  class="form-label">codigo</label>
                <input type="text" class="form-control" name="codigo" id="codigo" required> <br>
                <label for="descripcion"  class="form-label">Descripcion</label>
                <input type="text" class="form-control" name="descripcion" id="descripcion" required> <br>
                <label for="fechaRegistro" class="form-label">Fecha de Registro</label>
                <input type="text" class="form-control" name="fechaRegistro" id="fechaRegistro" required> <br>
                <label for="categoria" class="form-label">Categoria</label>
                <input type="text" class="form-control" id="categoria" name="categoria" required> <br>
                
                <label for="stock" class="form-label">Stock</label>
                <input type="number" class="form-control" id="stock" name="stock" required> <br>
                <label for="precio_compra" class="form-label">Precio de compra</label>
                <input type="number" class="form-control" id="precio_compra" name="precio_compra" required> <br>
                <label for="precio_venta" class="form-label">Precio de venta</label>
                <input type="number" class="form-control" id="precio_venta" name="precio_venta" required> <br>

                <button type="button" class="btn btn-outline-info" onclick="registrarArticulo('${auth}')">Registrar</button>
            </form>`;
            document.getElementById("registro").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
}

async function registrarArticulo(auth=false){
    validaToken();
    var myForm = document.getElementById("myFormReg");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    var categoria = jsonData.categoria
    jsonData.categoria = {
        id: categoria 
    }
    console.log("data user ",jsonData);

    const request = await fetch(urlApi+"/articulo", {
        method: 'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    })
    .then(response => response.json())
    .then(function(respuesta){
        console.log("respuesta peticion", respuesta)
    });
    if(auth){
        listarArticulos();
    }
    alertas("Se ha registrado el articulo exitosamente!",1)
    //document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function eliminaArticulo(codigo){
    validaToken();
    var settings={
        method: 'DELETE',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/articulo/"+codigo,settings)
    .then((data) => {
        console.log(data); // JSON data parsed by `data.json()` call
        listarArticulos();
        alertas("Se ha eliminado el Articulo exitosamente!",2)
      })
}

function verModificarArticulo(codigo){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/articulo/"+codigo,settings)
    .then(response => response.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Articulo</h1>
                </div>
              
                <form action="" method="post" id="myForm">



                    <input type="hidden" name="id" id="id" value="${usuario.id}">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" name="nombre" id="nombre" value="${usuario.nombre}" required> <br>
                    <label for="codigo"  class="form-label">codigo</label>
                    <input type="text" class="form-control" name="codigo" id="codigo" value="${usuario.codigo}" required> <br>
                    <label for="descripcion"  class="form-label">Descripcion</label>
                    <input type="text" class="form-control" name="descripcion" id="descripcion" value="${usuario.descripcion}" required> <br>
                    <label for="fechaRegistro" class="form-label">Fecha de Registro</label>
                    <input type="text" class="form-control" name="fechaRegistro" id="fechaRegistro" value="${usuario.fechaResgistro}" required> <br>
                    <label for="categoria" class="form-label">Categoria</label>
                    <input type="text" class="form-control" id="categoria" name="categoria" value="${usuario.categoria.id}" required> <br>
                    
                    <label for="stock" class="form-label">Stock</label>
                    <input type="number" class="form-control" id="stock" name="stock" value="${usuario.stock}" required> <br>
                    <label for="precio_compra" class="form-label">Precio de compra</label>
                    <input type="number" class="form-control" id="precio_compra" name="precio_compra" value="${usuario.precio_compra}" required> <br>
                    <label for="precio_venta" class="form-label">Precio de venta</label>
                    <input type="number" class="form-control" id="precio_venta" name="precio_venta" value="${usuario.precio_venta}" required> <br>

                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarArticulo('${usuario.id}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

async function modificarArticulo(codigo){
    validaToken();
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApi+"/usuario/"+codigo, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarArticulos();
    alertas("Se ha modificado el articulo exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}


// Modificar Articulo

function verModificarArticulo(codigo){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/articulo/codigo/"+codigo,settings)
    .then(response => response.json())
    .then(function(articulo){
            var cadena='';
            if(articulo){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar articulo</h1>
                </div>
              
                <form action="" method="post" id="myForm">
                <input type="hidden" name="id" id="id" value="${articulo.id}">
                <label for="nombre" class="form-label">Nombre</label>
                <input type="text" class="form-control" name="nombre" id="nombre" value="${articulo.nombre}" required> <br>
                <label for="codigo"  class="form-label">codigo</label>
                <input type="text" class="form-control" name="codigo" id="codigo" value="${articulo.codigo}" required> <br>
                <label for="descripcion"  class="form-label">Descripcion</label>
                <input type="text" class="form-control" name="descripcion" id="descripcion" value="${articulo.descripcion}" required> <br>
                <label for="fechaRegistro" class="form-label">Fecha de Registro</label>
                <input type="text" class="form-control" name="fechaRegistro" id="fechaRegistro" value="${articulo.fechaRegistro}" required> <br>
                <label for="categoria" class="form-label">Categoria</label>
                <input type="text" class="form-control" id="categoria" name="categoria" value="${articulo.categoria.id}" required> <br>
                
                <label for="stock" class="form-label">Stock</label>
                <input type="number" class="form-control" id="stock" name="stock" value="${articulo.stock}" required> <br>
                <label for="precio_compra" class="form-label">Precio de compra</label>
                <input type="number" class="form-control" id="precio_compra" name="precio_compra" value="${articulo.precio_compra}" required> <br>
                <label for="precio_venta" class="form-label">Precio de venta</label>
                <input type="number" class="form-control" id="precio_venta" name="precio_venta" value="${articulo.precio_venta}" required> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarArticulo('${articulo.codigo}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("registro").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}

async function modificarArticulo(codigo){
    validaToken();
    var myForm = document.getElementById("myForm");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    var categoria = jsonData.categoria
    jsonData.categoria = {
        id: categoria 
    }
    const request = await fetch(urlApi+"/articulo/"+codigo, {
        method: 'PUT',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
        body: JSON.stringify(jsonData)
    });
    listarArticulos();
    alertas("Se ha modificado el Articulo exitosamente!",1)
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalUsuario')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

//Ver Articulo
function verArticulo(codigo){
    validaToken();
    var settings={
        method: 'GET',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': localStorage.token
        },
    }
    fetch(urlApi+"/articulo/codigo/"+codigo,settings)
    .then(response => response.json())
    .then(function(usuario){
            var cadena='';
            if(usuario){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modificar Articulo</h1>
                </div>
              
                <form action="" method="post" id="myForm">



                    <input type="hidden" name="id" id="id" value="${usuario.id}">
                    <label for="nombre" class="form-label">Nombre</label>
                    <input type="text" class="form-control" name="nombre" id="nombre" value="${usuario.nombre}" required> <br>
                    <label for="codigo"  class="form-label">codigo</label>
                    <input type="text" class="form-control" name="codigo" id="codigo" value="${usuario.codigo}" required> <br>
                    <label for="descripcion"  class="form-label">Descripcion</label>
                    <input type="text" class="form-control" name="descripcion" id="descripcion" value="${usuario.descripcion}" required> <br>
                    <label for="fechaRegistro" class="form-label">Fecha de Registro</label>
                    <input type="text" class="form-control" name="fechaRegistro" id="fechaRegistro" value="${usuario.fechaResgistro}" required> <br>
                    <label for="categoria" class="form-label">Categoria</label>
                    <input type="text" class="form-control" id="categoria" name="categoria" value="${usuario.categoria.id}" required> <br>
                    
                    <label for="stock" class="form-label">Stock</label>
                    <input type="number" class="form-control" id="stock" name="stock" value="${usuario.stock}" required> <br>
                    <label for="precio_compra" class="form-label">Precio de compra</label>
                    <input type="number" class="form-control" id="precio_compra" name="precio_compra" value="${usuario.precio_compra}" required> <br>
                    <label for="precio_venta" class="form-label">Precio de venta</label>
                    <input type="number" class="form-control" id="precio_venta" name="precio_venta" value="${usuario.precio_venta}" required> <br>

                    <button type="button" class="btn btn-outline-warning" data-bs-dismiss="modal" aria-label="Close">Cerrar</button>
                </form>`;
            }
            document.getElementById("registro").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalUsuario'))
            myModal.toggle();
    })
}