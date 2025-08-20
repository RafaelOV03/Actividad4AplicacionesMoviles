import { gLocales, localeInit } from "/src/modules/locales.js";
import { gThemes } from "/src/modules/themes.js";
import { gFetch } from "/src/modules/fetch.js";
import { urlInit } from "/src/modules/urlinfo.js";
import { EnvBS } from "/src/partials/stdbs/view.js";
import { SpinnerLoading } from "/src/partials/stdbs/loading.js";

async function mainConfig(){
    //if(!(window.matchMedia('(prefers-color-scheme: dark)').matches))
        //document.documentElement.setAttribute("data-bs-theme","light");
}
let env = new EnvBS(document.body);
//Iniciar todo (Ejecutar solo una vez)

async function init(){
    //Importar bootstrap
    gFetch.post("/","Esto es un post","json", 1).then(
        json=>{console.log(json)}
    );
    gFetch.post("/","Esto es otro post","json", 1).then(
        json=>{console.log(json)}
    );
    await import("/assets/js/bootstrap.bundle.min.js");
    await gThemes.importCssFile("/assets/css/bootstrap.min.css");
    env.createEnv();
    new SpinnerLoading().set(env.DOM.getParent(),
        async (partial)=>{
            await mainConfig();
            partial.nMessage.textContent=gLocales("Cargando modulos");
            await Promise.all([
                localeInit(),urlInit(),
            ]);
            partial.nMessage.textContent=gLocales("Cargando interfaz");
            await env.loadTemplate("default");//Cargando plantilla por defecto
            //await new Promise(r => setTimeout(r, 1000000));

        },(partial)=>{
            partial.destroy();//Primero destruir el loading para evitar conflictos
            env.changeTemplate("default");
            env.loadMain();
            window.addEventListener('popstate',(e)=>{env.loadMain();});
        },
    ).refresh();
}
window.addEventListener('DOMContentLoaded',init);