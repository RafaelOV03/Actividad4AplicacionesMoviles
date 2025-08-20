import {gFetch} from "./fetch.js"
/*Agregar import de modulo aqui*/
let localeData={};
function gLocales(key,...values){
    let text=key;
    if(localeData.hasOwnProperty(key)){
        text=localeData[key];
        for(const i of values) text=text.replace("%s",i);
    }return text;
}
async function localeInit(url="/locale"){
    try{
        localeData = await gFetch.updateStorage(url);
    }catch(error){console.error("Locale-Error:",error.message);}
}
export {localeInit, gLocales};