import { Partial, Display } from "/src/partials/common.js";
import { EventValidation } from "/src/modules/validation.js";
import { SearchBar } from "/src/partials/stdbs/navigation.js";
/*
    Datos de input:
    {   
        cancelable: //Verdadero si quieres que tenga una opcion para cancelar (puede ser usado para inputs que manejan muchos datos)
        inputs:     //Datos de la lista de inputs
        [{  placeholder:    //Place holder de input (usar gLocales para traducir el texto)
            ,type:"text"     //Tipo de input (valores disponibles: "text", "number", "textarea", "date")
            ,args:{"space":false,"number":true,"lowbar":false}}]    //Argumentos adicionales (varia segun el tipo de input)
        }]
    }
*/
class TextInput extends Partial{
    getValue(){
        if(this.data.type==="number") return Number.parseFloat(this.nInput.value);
        return this.nInput.value;
    }
    createNodes(){
        return [{n:this.data.type==="textarea"?"textarea":"input",a:{id:this.DOM.getId("input"),rows:this.style.rows, type:this.data.type,class:"form-control", "aria-label":this.data.placeholder, "placeholder":this.data.placeholder}}];
    }
    createEvents(){
        this.nInput=this.DOM.getNode("input");
        switch (this.data.type){
            case "number":
                EventValidation.numberInput(this.nInput,this,this.data.typeArgs);
                this.nInput.setAttribute("type","text");
                break;
            default: EventValidation.textInput(this.nInput,this,this.data.typeArgs);
        }
    }
    static defData={type:"text",placeholder:"",typeArgs:{}};
    static defStyles={rows:4};
    constructor(data={}, styles={}){
        super();
        this.data=Partial.assignJson(data,TextInput.defData);
        this.style=Partial.assignJson(styles,TextInput.defStyles);
        this.init(this);
    }
}
class SwitchInput extends Partial{
    getValue(){return this.nInput.checked;}
    createNodes(){
        return [{n:"div",a:{class:"form-check form-switch"},c:[
            {n:"input",a:{class:"form-check-input",type:"checkbox",id:this.DOM.getId("input"),"switch":""}},
            {n:"label",a:{class:"form-check-label","for":this.DOM.getId("input")},t:this.data.placeholder}
        ]}];
    }
    createEvents(){this.nInput=this.DOM.getNode("input");}
    static defData={placeholder:""};
    static defStyles={};
    constructor(data={}, styles={}){
        super();
        this.data=Partial.assignJson(data,SwitchInput.defData);
        this.style=Partial.assignJson(styles,SwitchInput.defStyles);
        this.init(this);
    }
}
class FileInput extends Partial{
    getValue(){
        let file = this.nInput.files[0];
        if(file)return file;
        return null;
    }
    createNodes(){
        let json=[{n:"input",a:{id:this.DOM.getId("input"),type:"file",class:"form-control", "aria-label":this.data.placeholder, "placeholder":this.data.placeholder}}];
        if(this.data.multiple) json.a.multiple="";
        return json;
    }
    createEvents(){this.nInput=this.DOM.getNode("input");}
    static defData={type:"text",placeholder:"",multiple:false};
    static defStyles={};
    constructor(data={}, styles={}){
        super();
        this.data=Partial.assignJson(data,FileInput.defData);
        this.style=Partial.assignJson(styles,FileInput.defStyles);
        this.init(this);
    }
}
function __newInput(name, args, includeGroup=false){
    switch(name){
        case "input": return new TextInput(args);
        case "switch": return new SwitchInput(args);
        case "file": return new FileInput(args);
        default:
            if(includeGroup&&name==="group")return new InputGroup(args);
            throw new Error(`Input type "${name}" is not supported.`);
    }
}

class InputGroup extends Partial {
    #onlyInput=true;
    getValue(){
        let result=[];
        for(const i in this.data.inputs){
            result.push(this.getChild(i).getValue());
        }return result;
    }
    createNodes(){
        let inputs=[];
        for(const i in this.data.inputs){
            switch(this.data.inputs[i].type){
                case "switch": this.#onlyInput=false;
            }inputs.push(this.appendChild(i,__newInput(this.data.inputs[i].type,this.data.inputs[i].args,false)));
        }
        if(!this.#onlyInput){
            inputs=[{n:"div",a:{class:"d-flex align-items-center flex-wrap gap-3 w-100"},c:inputs}];
        }
        this.lastInput=inputs.length-1;
        if(this.data.validation)
            inputs.push({n:"div", a:{class:"valid-feedback", id:this.DOM.getId("validation")}});
        let json=[{n:"div",a:{id:this.DOM.getId("group"),class:this.#onlyInput?"input-group":"d-flex gap-1"},c:inputs}];
        if(json.length>1)json=[{n:"div", a:{class:"col mb-2"}, c:json}];
        return json;
    }
    createEvents(){
        this.nGroup=this.DOM.getNode("group");
        this.nInputs=this.nGroup.querySelectorAll("input,textarea");
    }
    static defData = {
        inputs:[{type:"input", args:TextInput.defData}],
    }
    constructor(data={}, styles={}){
        super();
        this.data=Partial.assignJson(data,InputGroup.defData);
        this.init(this);
    }
}
class Form extends Partial {
    #_names=[];
    getValue(){
        let result={};
        for(const i in this.data.rows){
            result[this.#_names[i]]=this.getChild(i).getValue();
        }return result;
    }
    createNodes(){
        let json=[];
        for(const i in this.data.rows){
            const row=this.data.rows[i];
            this.#_names.push(row.name);
            let input=[this.appendChild(i,__newInput(row.type,row.args,true))];
            input.unshift({n:"label",a:{"for":this.getChild(i).DOM.getId("input"),class:"form-label"},t:row.label});
            if(input.length>1)input=[{n:"div",a:{class:"mb-3"},c:input}];
            json=[...json,...input];
        }
        if(json.length>1)json=[{n:"div",a:{class:"d-flex gap-2 row mx-0"},c:json}];
        return [{n:"form",c:json}];
    }
    createEvents(){
        for(const i of this.data.rows){
            if(i.length>1){
                for(const j of i){
                }
            }
        }
    }
    setValidation(validateAll=false,errors){
        if(!errors)return;
        for(const i in this.c){
        }
    }
    static defData = {
        rows:[{name:"",type:"input",label:"",args:{}}],
        cancelable:false,
        validation:false,
    };
    constructor(data={}, styles={}){
        super();
        this.data=Partial.assignJson(data,Form.defData);
        this.styles=Partial.assignJson(data,Form.defData);
        this.init(this);
    }
}

class InputGroup1 extends Partial {
    #actived=true;#onlyInput=true;
    getValue(){
        if(!this.#actived)return null;
        let result=[];
        if(this.nInputs.length==1)
            result=this.c[0].getValue();
        else
            for(const n in this.c) result.push(this.c[n].getValue());
        return result;
    }
    getName(){
        returnthis.data.name;
    }
    createNodes(){
        let inputs=[];
        for(const i in this.data.inputs){
            switch(this.data.inputs[i].type){
                case "switch":
                    this.#onlyInput=false;
            }
            inputs.push(this.appendChild(i,new TextInput(this.data.inputs[i])));
        }
        if(!this.#onlyInput){
            inputs=[{n:"div",a:{class:"d-flex align-items-center flex-wrap gap-3 w-100"},c:inputs}];
        }
        this.lastInput=inputs.length-1;
        if(this.data.validation)
            inputs.push({n:"div", a:{class:"valid-feedback", id:this.DOM.getId("validation")}});
        if(this.data.cancelable)
            inputs.push({n:"button",a:{id:this.DOM.getId("cancel"),type:"button",class:"btn btn-outline-secondary"},c:[{n:"i",a:{class:"fa fa-times","aria-hidden":"true"}}]});
        let json=[{n:"div",a:{id:this.DOM.getId("group"),class:this.#onlyInput?"input-group":"d-flex gap-1"},c:inputs}];
        if(this.data.label) json.unshift({n:"label",a:{"for":this.DOM.getId("label"),class:"form-label"},t:this.data.label});
        if(this.data.text) json.push({n:"div", a:{class:"form-text"},t:this.data.text});
        if(json.length>1)json=[{n:"div", a:{class:"col mb-2"}, c:json}];
        return json;
    }
    createEvents(){
        this.nGroup=this.DOM.getNode("group");
        this.nInputs=this.nGroup.querySelectorAll("input,textarea");
        if(this.data.validation){
            this.nValidation=this.DOM.getNode("validation");
            this.nGroup.classList.add("has-validation");
            for(const n of this.nInputs)
                n.addEventListener("focusin",()=>{this.removeValidation();});
        }
        if(this.data.cancelable){
            this.nCancel=this.DOM.getNode("cancel");
            for(const n of this.nInputs)
                n.addEventListener("focusin",()=>{this.#activateInputs();});
            this.nCancel.addEventListener("click",()=>{
                this.#cancelInputs();
            });this.#cancelInputs();
        }
    }
    setValidation(valid,message){
        if(this.data.validation){
            this.nInputs.forEach((i)=>{
                i.classList[valid?"add":"remove"]("is-valid");
                i.classList[valid?"remove":"add"]("is-invalid");
            });
            this.nValidation.textContent=message;
            this.nValidation.classList[valid?"add":"remove"]("valid-feedback");
            this.nValidation.classList[valid?"remove":"add"]("invalid-feedback");
        }else warn.error(`El InputGroup ${this.ID} no acepta validaciones`);
    }
    removeValidation(){
        if(this.data.validation){
            this.nInputs.forEach((i)=>{i.classList.remove("is-valid");i.classList.remove("is-invalid");});
        }else console.warn(`El InputGroup ${this.ID} no acepta validaciones`);
    }
    #activateInputs(){
        if(!this.#actived){
            this.nInputs.forEach((i) => {
                i.classList.remove("bg-secondary-subtle","text-secondary-emphasis");
            });
            Display.dInsertBefore(this.nGroup.childNodes[this.lastInput],[this.nCancel]);
            this.#actived=true;
        }
    }
    #cancelInputs(){
        if(this.#actived){
            this.nInputs.forEach((i) => {
                i.classList.add("bg-secondary-subtle","text-secondary-emphasis");
            });
            this.nCancel.remove();
            this.#actived=false;
        }
    }
    static defData = {
        name:"",
        label:undefined,
        text:"",
        cancelable:false,
        validation:false,
        inputs:[TextInput.defData],
    }
    constructor(data={}, styles={}){
        super();
        //Configuracion
        if(data.hasOwnProperty("input"))
            {data.inputs=[data.input];delete data.input;}
       this.data=Partial.assignJson(data,InputGroup.defData);
        if(this.data.label==undefined)this.data.label=this.data.name;
        if(!this.data.inputs.length)this.data.inputs=[Input.defData];
        this.init(this);
    }
}
class Form1 extends Partial {
    #data={};#s={};
    getValue(){
        const form = new FormData();
        for(const v in this.c){
            let value = this.c[v].getValue();
            if(value!=null)form.append(this.c[v].getName(),value);
        }return form;
    }
    createNodes(){
        let json=[];
        for(const i of this.data.rows){
            let inputs=[];
            for(const j of i)
            if(inputs.length>1)inputs=[{n:"div",a:{class:"d-flex gap-2 row mx-0"},c:inputs}];
            json=[...json,...inputs];
        }
        return [{n:"form",c:json}];
    }
    createEvents(){
        for(const i of this.data.rows){
            if(i.length>1){
                for(const j of i){
                    this.c[j.name].DOM.getNodes()[0].classList.add("p-0");
                }
            }
        }
    }
    setValidation(validateAll=false,errors){
        if(!errors)return;
        for(const i in this.c){
            if(errors.hasOwnProperty(i)){
                this.c[i].setValidation(false,errors[i][0]);
            }else if(validateAll) this.c[i].setValidation(true,"");
            else this.c[i].removeValidation();
        }
    }
    static defData = {
        rows:undefined,
        cancelable:false,
        validation:false,
    };
    constructor(data={}, styles={}){
        super();
        this.data=Partial.assignJson(data,Form.defData);
        let groupDefault=InputGroup.defData;
        groupDefault.cancelable=data.cancelable;
        groupDefault.validation=data.validation;
        for(const i in this.data.rows){
            if(!Array.isArray(this.data.rows[i]))
               this.data.rows[i]=[this.data.rows[i]];
            for(const j in this.data.rows[i]){
               this.data.rows[i][j]=Partial.assignJson(this.data.rows[i][j],groupDefault);
            }
        }
        this.#s=Object.assign(Input.defaultStyles,styles);
        this.init(this);
    }
}
export {TextInput, SwitchInput, FileInput, InputGroup, Form};