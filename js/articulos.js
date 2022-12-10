const urlApi = "http://localhost:9009";//colocar la url con el puerto

function validaToken(){
    if(localStorage.token == undefined){
        salir();
    }
}

