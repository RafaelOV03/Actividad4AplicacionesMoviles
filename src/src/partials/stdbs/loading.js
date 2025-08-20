import { Loading, Display } from "/src/partials/common.js";
import { gLocales } from "/src/modules/locales.js"


class SpinnerLoading extends Loading{
    #_cancel=()=>{};
    static set = Loading.set;
    createNodes(){
        let info={};let json={};
        if(this.hasInfo)info={n:"span",a:{id:this.DOM.getId("info"),class:"text-center"},t:gLocales(this.cancelled?"Cancelled":"Loading")};
        if(this.cancelled){
            json=[{n:"div",a:{class:"h-100 d-flex flex-column align-items-center justify-content-center"},c:[{n:"button",a:{id:this.DOM.getId("retry"),type:"button",class:"btn bg-secondary rounded-circle bg-opacity-75","style":"width:2.5rem;height:2.5rem"},c:[{n:"i",a:{class:"fa fa-redo","aria-hidden":"true"}}]},info]}];
        }else{
            let cancel={};if(this.cancelable) cancel={n:"button",a:{"hidden":"",id:this.DOM.getId("cancel"),type:"button",class:"btn bg-secondary rounded-circle bg-opacity-75 h-100 w-100"},c:[{n:"i",a:{class:"fa fa-times","aria-hidden":"true"}}]};
            json=[{n:"div",a:{class:"h-100 d-flex flex-column align-items-center justify-content-center"},c:[{n:"div",a:{id:this.DOM.getId("all"),"style":"width:2.3rem;height:2.3rem",class:"d-flex justify-content-center align-items-center"},c:[{n:"div",a:{id:this.DOM.getId("spinner"),class:`spinner-${this.styles.spinner} h-100 w-100`,"role":"status"},c:[{n:"span",a:{class:"visually-hidden"},t:"Cargando..."}]},cancel]},info]}];
        }
        return json;
    }
    async #show(){
        return;
        await Promise.all([
            Display.setNodeInterpolation(this.nContent, {opacity:[1,0.5]}, .2),
            Display.setNodeInterpolation(this.nLoading, {opacity:[0,1]}, .2)
        ]);
    }
    async #fade(){
        return;
        await Promise.all([
            Display.setNodeInterpolation(this.nContent, {opacity:[0.5,0]}, .3),
            Display.setNodeInterpolation(this.nLoading, {opacity:[1,0]}, .2)
        ]);
    }
    createEvents(){
        //Agregar estilos a la encapsulacion
        this.nGroup.classList.add("h-100","position-relative");
        this.nContent.classList.add("h-100");
        this.nLoading.classList.add("h-100","w-100","position-fixed","z-1");
        this.#show();
        this.nSpinner=this.DOM.getNode("spinner");
        if(this.hasInfo) this.nMessage=this.DOM.getNode("info");
        if(this.cancelled){
            this.nRetry=this.DOM.getNode("retry");
            this.nRetry.addEventListener("click",async ()=>{
                this.cancelled=false;
                this.DOM.drawAll();this.refresh();
            });
        }else if(this.cancelable){
            this.nAll=this.DOM.getNode("all");
            this.nCancel=this.DOM.getNode("cancel");
            this.nAll.addEventListener("mouseenter",()=>{this.nCancel.hidden=false;this.nSpinner.hidden=true;});
            this.nAll.addEventListener("mouseleave",()=>{this.nSpinner.hidden=false;this.nCancel.hidden=true;});
            this.nCancel.addEventListener("click",()=>{this.cancelled=true;this.#_cancel();this.DOM.drawAll();});
        }
        this.setPartialEvents(this.#fade, this.#fade);

    }
    setCancel(cancel){
        this.#_cancel=cancel;
    }
    constructor(data={},hasInfo=true, cancelable=false, styles={}){
        super();
        this.styles=Object.assign({
            "spinner":"border"
        },styles);
        this.hasInfo=hasInfo;
        this.cancelable=cancelable;
        this.cancelled=false;
        this.init(this);
    }
}
export {Loading, SpinnerLoading};