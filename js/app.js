let index =' \r\n    <section class=\"wrapper\">\r\n    <header>\r\n      <div class=\"logo\">\r\n        <span><img src=\"LogoGj.jpeg\"\/><\/span>\r\n      <\/div>\r\n      <h1>Bienvenido!<\/h1>\r\n      <p>Buscador de tareas<\/p>\r\n    <\/header>\r\n    <section class=\"main-content\">\r\n      <form action=\"\">\r\n        <input type=\"text\" list=\"lista\" name=\"input\" id=\"valor\">\r\n        <datalist id=\"lista\" >\r\n        <\/datalist>\r\n        \r\n        <div class=\"line\"><\/div>\r\n        <button type=\"submit\" onclick=\"buscarbtn()\">Buscar<\/button>\r\n      <\/form>\r\n    <\/section> ';
let table='\r\n      <section class=\"tableContent\">\r\n\r\n     <h1> Tareas del proyecto <\/h1>\r\n           <div class=\"container table-responsive py-5\"> \r\n       <table class=\"table table-bordered table-hover\" id=\"tableTask\">\r\n        <thead class=\"thead-dark\">\r\n          <tr>\r\n            <th scope=\"col\">Nombre Tarea <\/th>\r\n            <th scope=\"col\">Descripci\u00F3n de tarea<\/th>\r\n            <th scope=\"col\">Fecha de Creaci\u00F3n<\/th>\r\n            <th scope=\"col\">Fecha Limite<\/th>\r\n            <th scope=\"col\">Estado<\/th>\r\n            <th scope=\"col\">Creado por<\/th>\r\n            <th scope=\"col\">Nombre de Proyecto<\/th>\r\n            <th scope=\"col\">Etiquetas<\/th>\r\n            <th scope=\"col\">Comentarios<\/th>\r\n            <th scope=\"col\">Fecha de comentario<\/th>\r\n          <\/tr>\r\n        <\/thead>\r\n        <tbody id=\"tbody\">\r\n       <!--     <tr id=\"tarea\">\r\n            <td id=\"nombre\"><\/td>\r\n            <td id=\"descripcion\"><\/td>\r\n            <td id=\"fecha_creacion\"><\/td>\r\n            <td id=\"fecha_limite\"><\/td>\r\n            <td id=\"estado\"><\/td>\r\n            <td id=\"creador\"><\/td>\r\n            <td id=\"nombreProyecto\"><\/td>\r\n            <td id=\"etiquetas\"><\/td>\r\n            <td id=\"cajacoment\">\r\n              <ul id=\"listaComent\">\r\n              <\/ul>\r\n            <\/td>\r\n            <td id=\"cajaFechacoment\">\r\n              <ul id=\"listaFechacoment\">\r\n              <\/ul>\r\n            <\/td>  \r\n          <\/tr> -->\r\n        <\/tbody>\r\n      <\/table> \r\n      <\/div>\r\n      <div id=\"cajaBtn\">\r\n        \r\n          <button type=\"button\" class=\"btnRegresar btn btn-outline-primary\" onclick=\"accionBtnRegresar()\"id=\"btnRegresar\"><i class=\"bi bi-reply-all-fill\"> <\/i>Regresar al Inicio<\/button>\r\n          <button type=\"button\" class=\"btnExportar btn btn-outline-primary\" onclick=\"fnExcelReport()\" id=\"btnExportar\"><i class=\"bi bi-arrow-down-circle-fill\"> <\/i>Exportar a Excel<\/button>\r\n        \r\n\t\t\t<\/div>\r\n   <\/section>';

let arrayVacio=[];



$(document).ready(function(){
    $("#container").html(index); 
      buscarGrupos();
});
function accionBtnRegresar(){
    $("#container").html(index);
    buscarGrupos();
   
}

function buscarbtn(){
    let idProyecto = document.getElementById("valor").value;
    traerNombreProyecto(idProyecto);
    $("#container").html(table); 
}

function buscarGrupos(){
    BX24.callMethod('sonet_group.get',
        {},function(res){
        res?.answer?.result?.forEach((data) => {
            arrayVacio.push(data);
            });
            if (res.more()) {
                res.next();     
            }
            for (let i = 0; i < arrayVacio.length; i++) {
                let pintarOpcion='<option value='+arrayVacio[i].ID+'>'+arrayVacio[i].NAME+'</option>';
                $("#lista").append(pintarOpcion);
            }
    });
           
}


function traerNombreProyecto(idProyecto){
   
    BX24.callMethod('sonet_group.get',
        { 
            "FILTER":{ 
            "ID": idProyecto},
          
        },
        function(resultado){
            let nombreProyecto=resultado.data()[0].NAME;
           traerTareas(idProyecto,nombreProyecto);
           
    });
       
}
function traerTareas(idProyecto,nombreProyecto){
    BX24.callMethod(
        "tasks.task.list", { 
            "filter": {
                "group_id": idProyecto}
            ,
            "select": ['ID','TITLE','DESCRIPTION','CREATED_DATE','DEADLINE','STATUS','CREATED_BY','GROUP']
        }, 
        function(res){
            let infoTareas=res.answer.result; 
            let tareas=infoTareas.tasks;
           traerComentariosTareas(0,tareas,nombreProyecto);
            
        }
    );    
}

function traerComentariosTareas(indexActual,infoTareas,nombreProyecto){
    if(indexActual >= infoTareas.length){
        procesarComentarioTareas(infoTareas,nombreProyecto);
        return;
    }
    BX24.callMethod(
        "task.commentitem.getlist", { 
           "taskid": infoTareas[indexActual].id
        }, 
        function(res){
            let totalComentario=res.answer.result;
            infoTareas[indexActual].comentarios=totalComentario.map(comentario=>({
                nombreComentario :  comentario.POST_MESSAGE,
                fechaComentario : comentario.POST_DATE
            }));
     
            traerComentariosTareas(indexActual+1,infoTareas,nombreProyecto);
          
        }
    );    
} 
function clasificarInformacion(infoTareas,nombreProyecto){
    let subTitle= '<h2>'+nombreProyecto+'</h2>';
    $("h1").after(subTitle);

    
   let contenedorTable=document.getElementById("tbody");
    let fila = '<tr>';
    for (let i = 0; i < infoTareas.length; i++) {
       
            fila +='<td>'+infoTareas[i].title+'</td>';
                    
            fila +='<td>'+infoTareas[i].description+'</td>';
                    
            fila +='<td>'+normalizarFecha(infoTareas[i].createdDate)+'</td>';
                    
            fila +='<td>'+normalizarFecha(infoTareas[i].deadline)+'</td>';
                    
            fila +='<td>'+nombreEstado(infoTareas[i].status)+'</td>';

            fila +='<td>'+infoTareas[i].creator.name+'</td>';

            fila +='<td>'+nombreProyecto+'</td>';
                    
            fila +='<td>'+infoTareas[i].createdBy+'</td>';//debe ir tags

            fila +='<td><ul>';
                   
        for (let j = 0; j < infoTareas[i].comentarios.length; j++) {
         
           fila+='<li>'+infoTareas[i].comentarios[j].nombreComentario+'</li>';
           
        }  
        fila +='</td></ul>';

        fila +='<td><ul>';
                   
        for (let j = 0; j < infoTareas[i].comentarios.length; j++) {
         
           fila+='<li>'+normalizarFecha(infoTareas[i].comentarios[j].fechaComentario)+'</li>';
           
        }  
        fila +='</td></ul>';
        fila += '</tr>';
      
     contenedorTable.innerHTML=fila;
     
    }
     
}
function procesarComentarioTareas(tareas,nombreProyecto){
    clasificarInformacion(tareas,nombreProyecto);

}

function normalizarFecha(fecha){
    var fechaNormalizada = new Date(fecha).toLocaleDateString();
    return fechaNormalizada;
}
function nombreEstado(numero){
    
    if(numero==1){
        return "Nuevo";
    }
    else if(numero==2){
        return "Pendiente";
    }
    else if(numero==3){
        return "En progreso";
    }
    else if(numero==4){
        return "Parcialmente completado";
    }
    else if(numero==5){
        return "Completado";
    }
    else if(numero==6){
        return "Diferido";
    }
    else if(numero==7){
        return "Declinado";
    }
}
function fnExcelReport()
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
    
}  
