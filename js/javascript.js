/* MODO CLARO */

function cambiar_a_claro() {
    document.body.style.backgroundColor = "#fff8dc";  // Fondo clarito
    document.body.style.color = "black";              // Texto oscuro

    // Cambiar colores del header
    document.querySelector("header").style.background = "#ffe9cc";

    document.querySelectorAll(".rojito").forEach(e => e.style.color = "#111111");

    // Cambiar nav
    document.querySelector(".similares").style.background = "#fff3db";

    // Cambiar aside
    let aside = document.querySelector(".lateral");
    aside.style.background = "#fffdf7";

    // Cambiar footer
    document.querySelector("footer").style.background = "#ffecd1";
}


/* MODO OSCURO */
function cambiar_a_oscuro() {

    // Fondo general
    document.body.style.backgroundColor = "#121212";
    document.body.style.color = "#f5f5f5";

    // Header elegante oscuro
    document.querySelector("header").style.background = "#1e1e1e";

    // NAV oscuro
    document.querySelector(".similares").style.background = "#2a2a2a";

    // ASIDE oscuro
    let aside = document.querySelector(".lateral");
    aside.style.background = "#1b1b1b";

    // FOOTER oscuro
    document.querySelector("footer").style.background = "#1e1e1e";


    let titulosAzules = document.querySelectorAll(".preparar, .crema, .Montar, .refrigerar, .titlevideo, .postres");
    titulosAzules.forEach(t => t.style.color = "#9dbaff");


    document.querySelectorAll(".rojito").forEach(e => e.style.color = "#ffffff");
    document.querySelectorAll(".rojo").forEach(e => e.style.color = "#ff8a80");
}



/* FUNCION DEL FOOTER (ALERT) */

function mostrar_datos_creador() {
    alert("Creador: Renzo Llanos\nGmail: renzoallanos@gmail.com\nLugar: Mi casa 😎");
}
