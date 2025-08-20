import { gLocales } from "/src/modules/locales.js";
import { Partial } from "/src/partials/common.js";

class Modal extends Partial{
    #confirmEvent=async()=>{};
    createNodes(){
        let json=[{n:"div",a:{class:"modal fade",id:this.ID,"tabindex":"-1","aria-labelledby":this.DOM.getId("label"),"aria-hidden":"true"},c:[{n:"div",a:{class:"modal-dialog modal-lg"},c:[{n:"div",a:{class:"modal-content"},c:[{n:"div",a:{class:"modal-header"},c:[{n:"h1",a:{class:"modal-title fs-5",id:this.DOM.getId("label")},t:gLocales("Title")},{n:"button",a:{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"}}]},{n:"div",a:{class:"modal-body"},c:[
            this.appendChild("main",new Partial()),
        ]},{n:"div",a:{class:"modal-footer"},c:[{n:"button",a:{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"},t:gLocales("Close")},{n:"button",a:{type:"button",class:"btn btn-primary", id:this.DOM.getId("confirm")},t:gLocales("Confirm")}]}]}]}]}];
        return json;
    }
    createEvents(){
        this.nMain=this.DOM.getNode("main");
        this.nLabel=this.DOM.getNode("label");
        this.nConfirm=this.DOM.getNode("confirm");
        this.modal= new bootstrap.Modal(this.DOM.getNode(), {});
        this.nConfirm.addEventListener("click",async (e)=>{
            e.target.setAttribute("disabled","");
            await this.#confirmEvent();
            e.target.removeAttribute("disabled");
        });
    }
    openModal(){
        this.modal.show();
    }
    closeModal(){
        this.modal.hide();
    }
    setModalMain(partial, name=null, confirm=null){
        this.DOM.replaceChild("main",partial);
        
        if(name)this.nLabel.textContent=name;
        if(confirm)this.nConfirm.textContent=confirm;
    }
    setTitle(name){
        this.nLabel.textContent=name;
    }
    setConfirm(name){
        this.nConfirm.textContent=name;
    }
    setConfirmEvent(event){
        this.#confirmEvent=event;
    }
    constructor(){
        super();
        this.init(this);
    }
}

export {Modal};