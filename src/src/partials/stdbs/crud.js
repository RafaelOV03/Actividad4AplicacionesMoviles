import { Partial } from "/src/partials/common.js";
import { Table } from "./table.js";
import { Pagination, SearchBar, Tab} from "./navigation.js";
import { Modal } from "./modal.js";
import { Form } from "./inputs.js";
import { gLocales } from "/src/modules/locales.js";
import { gFetch } from "/src/modules/fetch.js";
class Crud extends Partial{
    #data={};#s={};#index=0;#curID=0;#curMode="store";
    createNodes(){
        let json=[{n:"div",a:{class:"d-flex flex-column h-100 gap-2"},c:[
            this.appendChild("tab",new Tab({
                data:this.navData
            })),
            {n:"div",a:{class:"d-flex justify-content-between"},c:[
                this.appendChild("search", new SearchBar()),
                {n:"div",a:{id:this.DOM.getId("buttons"),class:"d-flex justify-content-end gap-1"},c:[
                    {n:"button",a:{type:"button",class:"btn btn-primary",type:"store"},t:gLocales("Create")},
                    {n:"button",a:{type:"button",class:"btn btn-secondary",type:"update"},t:gLocales("Edit")},
                    {n:"button",a:{type:"button",class:"btn btn-danger",type:"delete"},t:gLocales("Delete")},
                ]},
            ]},
            {n:"div",a:{class:"table-responsive h-100"},c:[
                this.appendChild("table",new Table({
                    hover:{enabled:true, showID:true}
                })),
            ]},
            this.appendChild("pag",new Pagination()),
        ]}, this.appendChild("modal",new Modal()) ];
        return json;
    }
    createEvents(){
        this.nButtons=this.DOM.getNode("buttons").childNodes;
        for(const i of this.nButtons)
            i.addEventListener("click",()=>{
                this.#setModalForm(i.getAttribute("type"));
                this.child.modal.openModal();
            });
        this.nButtons[0].addEventListener("click",()=>{

        });
        this.child.pag.setPageEvent(this.#crudUpdateEvent);
        this.child.search.setSearchEvent(()=>{this.#crudUpdateEvent(1);});
        this.child.search.setUpdateEvent(()=>{this.#crudUpdateEvent(1);});
        this.child.tab.setTabEvent((index)=>{
            this.setCrudData(index);
            this.#crudUpdateEvent(1);
        });
        //Guardar ID de tabla:
        this.child.table.setRowEvent((id)=>{
            this.#curID=id;
        });
        //Crear datos:
        this.child.modal.setConfirmEvent(async()=>{
            let values=this.data.values[this.#index];
            let form = this.child.modal.c.main.getValue();
            switch (this.#curMode) {
                case "update":
                case "delete":
                    form.append("_id",this.#curID);
            }
            await gFetch.post(
                `${this.data.url.replace("$PREFIX",values.prefix)}/${this.#curMode}`,form,
            (json)=>{
                if(json.error){
                    this.child.modal.c.main.setValidation(false,json.errors);
                    return;
                }this.#crudUpdateEvent(this.child.pag.getPageNum());
                this.child.modal.closeModal();
            });
        });
        this.setCrudData();
    }
    setCrudData(index=0){
        this.#index=index;
        this.child.search.nInput.value="";
        this.child.table.setData(this.data.values[this.#index].columns);
        this.#setModalForm();
    }
    #setModalForm(mode="store"){
        let data = JSON.parse(JSON.stringify(this.data.values[this.#index]));
        this.#curMode=mode;
        let title = "Crear";
        switch(mode){
            case "update":
                data.form.cancelable=true; title="Editar";
            case "store": this.child.modal.setModalMain(new Form(data.form));
                break;
            case "delete":
                this.child.modal.setModalMain(new Form({
                    rows:[{name:"_",label:"¿Estas seguro de que quieres eliminar el dato?",input:{type:"hidden"}},],
                }));break;
        }
    }
    #crudUpdateEvent=async(index)=>{
        if(this.data.values) {
            let values=this.data.values[this.#index];
            await gFetch.get(`${this.data.url.replace("$PREFIX",values.prefix)}?page=${index}&search=${this.child.search.getValue()}`,"json",this.ID)
            .then(json=>{
                this.child.table.setRows(json.data);
                this.child.pag.setPageSize(json.total);
            });
        }
    }
    setData(table,pages){
       this.data.table=table;
       this.data.pages=pages;
    }
    setApiUrl(url){
       this.data.url=url;
    }
    static defaultData={
        url:"$PREFIX",
        values:[{name:"",prefix:"",columns:{},form:Form.defaultData}],
        pages:1,
        table:{},
        modalMode:"store",
    }
    constructor(data={}){
        super();
        this.data=Partial.assignJson(data,Crud.defaultData);
        this.navData = [];
        for(const i in this.data.values) this.navData.push({name:this.data.values[i].name,value:i});
        this.init(this);
    }
}
export {Crud};