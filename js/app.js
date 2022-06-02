let index ='<section class=\"wrapper\">\r\n          <header>\r\n            <div class=\"logo\">\r\n              <span><img src=\"LogoGj.jpeg\"\/><\/span>\r\n            <\/div>\r\n            <h1>Bienvenido!<\/h1>\r\n            <p>Buscador de tareas<\/p>\r\n          <\/header>\r\n          <section class=\"main-content\">\r\n            <form action=\"\">\r\n              <input type=\"text\" placeholder=\"Escriba el nombre del proyecto\" id=\"valor\">\r\n              <div class=\"line\"><\/div>\r\n              <button type=\"submit\" onclick=\"buscarbtn()\">Buscar<\/button>\r\n            <\/form>\r\n          <\/section>\r\n        \r\n        <\/section>';
let table ='<section class=\"tableContent\">\r\n\r\n     <h1> Tareas del proyecto <\/h1>\r\n     <h2>nombre de proyecto<\/h2>\r\n      <div class=\"container table-responsive py-5\"> \r\n       <table class=\"table table-bordered table-hover\" id=\"tableTask\">\r\n        <thead class=\"thead-dark\">\r\n          <tr>\r\n            <th scope=\"col\">Nombre Tarea <\/th>\r\n            <th scope=\"col\">Descripci\u00F3n de tarea<\/th>\r\n            <th scope=\"col\">Fecha de Creaci\u00F3n<\/th>\r\n            <th scope=\"col\">Fecha Limite<\/th>\r\n            <th scope=\"col\">Estado<\/th>\r\n            <th scope=\"col\">Creado por<\/th>\r\n            <th scope=\"col\">Nombre de Proyecto<\/th>\r\n            <th scope=\"col\">Etiquetas<\/th>\r\n            <th scope=\"col\">Comentarios<\/th>\r\n            <th scope=\"col\">Fecha de comentario<\/th>\r\n          <\/tr>\r\n        <\/thead>\r\n        <tbody>\r\n          <tr id=\"tarea\">\r\n            <td>Otto<\/td>\r\n            <td>Otto<\/td>\r\n            <td>Otto<\/td>\r\n            <td>Otto<\/td>\r\n            <td>Otto<\/td>\r\n            <td>Otto<\/td>\r\n            <td>Otto<\/td>\r\n            <td>Otto<\/td>\r\n            <td>\r\n              <ul>\r\n                <li>1<\/li>\r\n                <li>2<\/li>\r\n                <li>3<\/li>\r\n              <\/ul>\r\n            <\/td>\r\n            <td>\r\n              <ul>\r\n              <li>a<\/li>\r\n              <li>B<\/li>\r\n              <li>C<\/li>\r\n              <\/ul>\r\n            <\/td>\r\n          <\/tr>\r\n          \r\n        <\/tbody>\r\n      <\/table> \r\n      <\/div>\r\n      <div id=\"cajaBtn\">\r\n        \r\n          <button type=\"button\" class=\"btnRegresar btn btn-outline-primary\" onclick=\"accionBtnRegresar()\"id=\"btnRegresar\"><i class=\"bi bi-reply-all-fill\"> <\/i>Regresar al Inicio<\/button>\r\n          <button type=\"button\" class=\"btnExportar btn btn-outline-primary\" onclick=\"fnExcelReport()\" id=\"btnExportar\"><i class=\"bi bi-arrow-down-circle-fill\"> <\/i>Exportar a Excel<\/button>\r\n        \r\n\t\t\t<\/div>\r\n   <\/section>';

$(document).ready(function(){
   $("#container").html(index);
})
function accionBtnRegresar(){
    $("#container").html(index);
}
function buscarbtn(){
    var numSolicitud = document.getElementById("valor").value;
    verificarExitenciaSolicitud(numSolicitud);
    $("#container").html(table);
}

function verificarExitenciaSolicitud(numSolicitud){
    let nombre ;
    let id;
    BX24.callMethod('sonet_group.get',
        {
            select: ["ID","NAME"]
        },function(resultado){
         let info = resultado.data();
          //  console.log(resultado);
           let otro= resultado.next();
          
            for (let i = 0; i < info.length; i++) {
                if(info[i].NAME==numSolicitud){

                    nombre=info[i].NAME;
                    id= info[i].ID;
                 
                        
                }
                 
                  
                
            
            } 
            
            
            if(id != ""){
                traerTareas(id);
               $("#container").html(table);
            }
            else{
                $("#container").html(index);
                console.log("no existe");
            } 
           
        });
       
}
function traerTareas(id){
    console.log(id);
    BX24.callMethod(
        "tasks.task.list", { 
            "filter": {
                ">group_id": id}
            ,
            "select": ['ID','TITLE']
        }, 
        function(res){
           console.log(res.answer.result);
        }
    );    
}

/* function fnExcelReport()
{
    console.log("imp excel");
    var table = $("#tableTask");

    if(table && table.length)
    {
        console.log("print excel");
        $(table).table2excel({
            exclude: ".noExl",
            name: "Excel Document Name",
            filename: "Tareas.xls",
            fileext: ".xls",
            exclude_img: true,
            exclude_links: true,
            exclude_inputs: true,
            preserveColors: true
        });
    }
    
}  */