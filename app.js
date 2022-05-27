let index ='<section class=\"wrapper\">\r\n          <header>\r\n            <div class=\"logo\">\r\n              <span><img src=\"LogoGj.jpeg\"\/><\/span>\r\n            <\/div>\r\n            <h1>Bienvenido!<\/h1>\r\n            <p>Buscador de tareas<\/p>\r\n          <\/header>\r\n          <section class=\"main-content\">\r\n            <form action=\"\">\r\n              <input type=\"email\" placeholder=\"Escriba el nombre del proyecto\">\r\n              <div class=\"line\"><\/div>\r\n              <button>Buscar<\/button>\r\n            <\/form>\r\n          <\/section>\r\n        \r\n        <\/section>';


$(document).ready(function(){
    $(".main-content").html(index);
})