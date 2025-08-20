class Themes {
    #_css={};
    static parseJsonCss(json){
        let result=null;
        if(json.hasOwnProperty("n")){
            result=`${json.n}{`;
            if(json.hasOwnProperty("t")) result=`@${json.t} ${result}`;
            for(const i in json.a??{}){
                result+=`${i}:${json.a[i]};`;
            }for(const i of json.c??[]){
                result+=this.parseJsonCss(i)??"";
            }
            result+="}";
        }return result;
    }
    static addJsonParent(name, json){
        for(const i of json){
            if(i.hasOwnProperty("n"))i.n=`${name} ${i.n}`;
        }return json;
    }
    removeCss(name){
        this.#_css[name].remove();
        delete this.#_css[name];
    }
    async #_createLink(name, href=null, content=null, exist=false){
        if(exist)this.removeCss(name);
        const link=document.createElement(content?"style":"link");
        await new Promise((resolve, reject) => {
            link.rel='stylesheet';
            if(href)link.href=href;
            if(content)link.textContent=content;
            link.onload=() => resolve(link);
            link.onerror=() => reject(new Error('Error cargando CSS'));
            document.head.appendChild(link);
            this.#_css[name]=link;
        }).then(()=>{link.onload=null;link.onerror=null;});
    }
    // Importar archivo CSS
    async importCssFile(file,update=false){
        let name=`file:${file}`;
        let exist=this.#_css.hasOwnProperty(name);
        if(!exist||update)await this.#_createLink(name, file, null, exist);
    }
    // Importar Css directamente
    async importCssString(content, name, update=false) {
        let exist=this.#_css.hasOwnProperty(name);
        if(!exist||update)await this.#_createLink(name, null, content, exist);
    }
    // Importar Css desde un Json
    async importCssJson(json, name, update=false) {
        let exist=this.#_css.hasOwnProperty(name);
        if(!exist||update){
            let result="";
            for(const i of json){
                result+=Themes.parseJsonCss(i)??"";
            }await this.#_createLink(name, null, result, exist);
        }
    }
    constructor(){
        this.STR={
            parseJson: Themes.parseJsonCss,
        }
        this.JSON={
            addParent: Themes.addJsonParent,
        }
    }
}
let gThemes=new Themes();
/*
    Estructura CSS JSON:
    [
        {n: "h1", 
            a:{
                "font-weight":300,
                "max-width":"100%"
            }
        },
        {t: "keyframes", n: "anim1",
            c: [
                {n: "0%",
                    a:{
                        "opacity":0,
                        "max-width":"50%",
                    }
                }
            ]
        }
    ]
*/
export {Themes, gThemes}