import {gUrl} from "/src/modules/urlinfo.js";
import {FetchEnv} from "/src/modules/fetch.js";
let ID=0;
class Display{
    //Remover todos los hijos de un nodo
    static DOM = {

    }
    static setSPALinks(nodeList, env){
        for(const i of nodeList){
            let links = [];
            if (i.tagName==="A") links.push(i);
            links.push(...i.querySelectorAll('a'));
            for(const j of links) j.addEventListener("click",(e)=>{
                e.preventDefault();
                env.goToView(e.currentTarget.href);
            });
        }
    }
    static removeChildren(parent){
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
    //Funcion para crear un nodo a partir de un objeto JSON
    static createNodeJson(json){
        let node=document.createElement(json["n"]);
        if(json.hasOwnProperty("a"))
            for(let index in json["a"])node.setAttribute(index,json["a"][index]);
        if(json.hasOwnProperty("t"))node.textContent=json["t"];
        else if(json.hasOwnProperty("c"))this.appendJson(json["c"],node);
        return node;
    }
    static appendJson(json,parent){
        let nodes=[];
        for(let tag of json){
            if(tag.hasOwnProperty("n")){
                let node=this.createNodeJson(tag);
                parent.appendChild(node);
                nodes.push(node);
            }
        }return nodes;
    }
    static jReplaceChild(parent, json){
        this.removeChildren(parent);
        return this.appendJson(json,parent);
    }
    static dInsertBefore(node, list){
        for(let i=list.length-1;i>=0;i--) {
            node.parentNode.insertBefore(list[i],node.nextSibling);
        }
    }
    static jInsertBefore(node,json){
        let list = this.appendJson(json,node.parentNode);
        this.dInsertBefore(node, list);
        return list;
    }
    static dGetChildIndex(node){
        let i=0;while((node=node.previousSibling)!=null)++i;
        return i;
    }
    //Funcion para animar un nodo cuando empieza a mostrarse en pantalla
    static async setNodeInterpolation(node, attr, time=.3, startAt=.0, easing="ease-in-out"){
        node.style.transition=`all 0s`;
        for(let name in attr)node.style[name]=attr[name][0];
        void node.offsetWidth;
        await new Promise(r => setTimeout(r, startAt*1000));
        node.style.transition=`all ${time}s ${easing}`;
        for(let name in attr)node.style[name]=attr[name][1];
        await new Promise(r => setTimeout(r, time*1000));
    }
    static tAlert(message,type=""){
        let toastnode=document.getElementById("gToast1");
        if(toastnode)toastnode.remove();
        let json=[
            {n:"div",a:{"id":"gToast1",class:"toast-container position-fixed bottom-0 end-0 p-3"},
                c:[{n:"div",a:{"id":"gToast","class":`toast align-items-center ${type}`,"role":"alert","aria-live":"assertive","aria-atomic":"true"},c:[{n:"div",a:{"class":"d-flex"},c:[{n:"div",a:{"class":"toast-body"},t:message},{n:"button",a:{"type":"button","class":"btn-close me-2 m-auto","data-bs-dismiss":"toast","aria-label":"Close"}}]}]}]
            }
        ];
        this.appendJson(document.body,json);
        let toast = new bootstrap.Toast(document.getElementById("gToast"), {});
        toast.show();
    }
}
class Partial{
    #_nodeList=new Set();
    #_nodeparent=null;
    #_children=[];//Esta lista almacena todos los nombres de los hijos pendientes
    #_createNode=function(){return [];};
    #_createEvent=async function(){};
    //Funciones estaticas
    static assignJson(target,defaults){
        for(const n in defaults){
            switch(typeof defaults[n]){
                case "object":
                    if(Array.isArray(defaults[n])){
                        if(!target.hasOwnProperty(n)){target[n]=[];}
                        for(const i in target[n]){
                            target[n][i]=this.assignJson(target[n][i],defaults[n][0]);
                        }
                    }else{
                        target[n]=this.assignJson(target[n]||{},defaults[n]);
                    }break;
                default:
                    if(!target.hasOwnProperty(n))target[n]=defaults[n];
            }
        }return target;
    } 
    init(thisClass){
        if(thisClass.createNodes)this.#_createNode=thisClass.createNodes;
        if(thisClass.createEvents)this.#_createEvent=thisClass.createEvents;
    }
    #_bindChild(name,child){
        this.child[name]=child;
        child.parent=this;
        child.env=this.env;
    }
    appendChild(name,child){
        if(!this.child.hasOwnProperty(name)){
            this.#_bindChild(name,child);
            this.#_children.push(name);
            return {n:`partial`,a:{n:this.child[name].ID}};
        }console.warn(`Ya existe el hijo "${name}"`);
        return {};
    }
    getChild(...children){
        let curPartial=this;
        for(const i of children){
            curPartial=curPartial.child[i];
            if(!curPartial)break;
        }return curPartial;
    }
    constructor(){
        this.ID=(++ID);
        this.env=null;
        this.nodeData={};
        this.parent=null;
        this.child={};

        this.data={};
        this.style={};
        
        this.DOM={
            //Eliminar a todos los hijos
            removeAll:()=>{
                for(const n of this.#_nodeList){
                    n.remove();
                    this.#_nodeList.delete(n);
                }
                for(const c in this.child){
                    this.child[c].DOM.removeAll();
                }this.child={};this.#_children=[];
            },
            //Crear un nuevo nodo a partir de un JSON
            parseJson:(json, parent=this.#_nodeparent)=>{
                let nodes = Display.appendJson(json,parent);
                if(this.env)Display.setSPALinks(nodes, this.env);
                if(parent==this.#_nodeparent)
                    for(const n of nodes)this.#_nodeList.add(n);
                this.DOM.drawChildren();
            },
            //Crear todos los hijos pendientes
            drawChildren:()=>{
                for(const name of this.#_children){
                    let child = this.child[name];
                    let node=this.#_nodeparent.querySelector(`partial[n="${child.ID}"]`);
                    if(node){
                        child.DOM.drawAll(node.parentNode);
                        Display.dInsertBefore(node,child.DOM.getNodes());
                        node.remove();
                    }
                }this.#_children=[];
            },
            //Crear todos los nodos y mostrarlos en parent, null para crearlo en el padre por defecto
            drawAll:(parent=null)=>{
                if(parent)this.DOM.setParent(parent);
                this.DOM.removeAll();
                this.child={};//Eliminar todos los hijos
                if(this.#_nodeparent){
                    try{
                        this.DOM.parseJson(this.#_createNode());
                        this.#_createEvent();
                    }catch(e){console.error(`Error en nodo ${this.ID}: ${e.message}\n${e.stack}`);}
                }else console.warn(`El Nodo "${this.ID}" es huerfano`, this);
            },
            replaceChild:(name, newChild)=>{
                let child = this.child[name];
                if(child){
                    newChild.DOM.setParent(this.child[name].DOM.getParent());
                    this.child[name].DOM.removeAll();
                    this.#_bindChild(name,newChild);
                    this.child[name].DOM.drawAll();
                }else (console.warn(`No se encontro el hijo "${name}" en el nodo ${this.ID}`));
            },
            getParent:()=>{return this.#_nodeparent;},
            getNodes:()=>{return [...this.#_nodeList];},
            getId:(subID=null)=>{return `${this.ID}${subID?`-${subID}`:''}`;},
            getNode:(subID=null)=>{return document.getElementById(this.DOM.getId(subID));},
            setParent:(nParent)=>{this.#_nodeparent=nParent;},
        };
    }
};
class Loading extends Partial{
    #_response=async(partial)=>{partial.destroy()};
    #_load=async()=>{};
    #_success=async()=>{};
    #_error=async(partial,e)=>{console.error(e);partial.destroy()};
    #_drawParent;
    set(parent, load=this.#_load, response=this.#_response){
        this.setDrawParent(parent);
        this.setLoadEvents(load, response);
        return this;
    }
    async refresh(){
        this.create();
        try{
            await this.#_load(this);
        }catch(e){
            //Si ocurre un error, se cancela la carga
            await this.#_error(this, e);
            return;
        }
        await this.#_success(this);
        this.#_response(this);
    }
    create(){
        this.nGroup=Display.createNodeJson(
            {n:"div",c:[
                {n:"div"},
                {n:"div"},
            ]}
        );
        this.nLoading=this.nGroup.children[0];
        this.nContent=this.nGroup.children[1];
        while (this.#_drawParent.firstChild) {
            this.nContent.appendChild(this.#_drawParent.firstChild);
        }this.#_drawParent.appendChild(this.nGroup);
        this.DOM.setParent(this.nLoading);
        this.DOM.drawAll();
    }
    destroy(){
        while (this.nContent.firstChild) {
            this.#_drawParent.appendChild(this.nContent.firstChild);
        }
        this.DOM.removeAll();
        this.DOM.setParent(this.#_drawParent);
        this.nGroup.remove();
    }
    setLoadEvents(load, response=this.#_response){
        this.#_load=load;
        this.#_response=response;
    }
    setPartialEvents(success=this.#_success, error=this.#_error){
        this.#_success=success;
        this.#_error=error;
    }
    setDrawParent(parent){
        this.#_drawParent=parent;
    }
    constructor(){
        super();
        this.#_drawParent=this.DOM.getParent();
        this.init(this);
    }
}
class Env extends Partial{
    #_templates={};
    #_getLoading=()=>{return new Loading();};
    #curMain=null;
    #curTemplate=null;
    createNodes(){
        let json = [this.appendChild("template",new Partial())];
        return json;
    }
    createEnv(){
        this.DOM.drawAll(this.root);
    }
    async loadTemplate(id){
        let imp=await import(`/src/templates/${id}.js`);
        let template = new imp.MainTemplate(this);
        if(!this.#_templates.hasOwnProperty(id))this.#_templates[id]=template;
    }
    callTemplate(eventName,...args){
        if(this.#curTemplate.hasOwnProperty(eventName))this.#curTemplate[eventName](...args);
    }
    callMain(eventName,...args){
        if(this.#curMain.hasOwnProperty(eventName))this.#curMain[eventName](...args);
    }
    changeTemplate(id){
        if(!this.#_templates.hasOwnProperty(id)){
            console.warn(`Plantilla "${id}" no encontrada`);
            return;
        }this.#curTemplate=this.#_templates[id];
        this.DOM.replaceChild("template", this.#curTemplate);
    }
    async goToView(url,replace=url===this.urlInfo.url.href){
        if(replace){
            history.replaceState({},"",url);
        }else history.pushState({},"",url);
        await this.loadMain(url);
    }
    async loadMain(url=window.location){
        this.urlInfo=gUrl.getPathInfo(url);//Obtener la informacion de la URL
        let template = this.getChild("template");
        if(template.getChild("main")){
            this.#_getLoading().set(template.DOM.getNode("main"),
                async (partial)=>{
                    try{
                        let imp;
                        try{
                            imp=await import(`/src/views${this.urlInfo.fileName}?update=${Date.now()}`);
                        }catch(e){
                            let status=Number.parseInt(e.message);
                            if(isNaN(status)){
                                status=404;
                                console.error("Page Error:",e);
                            }
                            imp=await import(`/src/views_status/${status}.js`);
                        }
                        FetchEnv.abortAllFetchs();//Abortar todos los fetchs cancelables
                        let newMain = new imp.MainPage(this);
                        this.#curMain=newMain;
                    }catch(error){
                        if(this.#curMain) console.error(`Error al cargar la pagina: ${error.name}, ${error.message}`);
                        else throw error;
                    }
                },(partial)=>{
                    partial.destroy();
                    if(this.#curMain.page){
                        document.title=this.#curMain.page.name;
                        template.DOM.replaceChild("main", this.#curMain);
                    }
                }
            ).refresh();
        }else console.warn("No se encontro la vista main, asegurate de vincular un partial 'main' en la plantilla");
    }
    setLoading(load){
        this.#_getLoading=load;
    }
    constructor(root){
        super();
        this.root=root;
        this.urlInfo=gUrl.getPathInfo(window.location);
        this.env=this;//Asignarse a si mismo como entorno para heredarselo a lo hijos
        this.init(this);
    }
}
export {Display, Partial, Loading, Env};