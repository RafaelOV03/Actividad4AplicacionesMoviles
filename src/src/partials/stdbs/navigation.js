import { Partial, Display } from "/src/partials/common.js";
import { gLocales } from "/src/modules/locales.js";
import { EventValidation } from "../../modules/validation.js";
//Barra de busqueda
class SearchBar extends Partial{
    #data={};#s={};
    #search=()=>{};#update=()=>{};
    #dUpdateSearchIndex(parent, prevIndex){
        if(this.rList.length>prevIndex){
            parent.children[prevIndex].classList.remove("bg-body-secondary");}
        if(this.rList.length>this.rIndex){
            parent.children[this.rIndex].classList.add("bg-body-secondary");}
    }
    dRefreshResults(){
        let json=[];
        Display.removeChildren(this.nResults);
        if(this.rList.length>0)
            for(let r of this.rList)
                json.push({"n":"li","a":{class:"list-group-item"},"t":r["v"]});
        else json.push({"n":"li","a":{class:"list-group-item disabled text-center","aria-disabled":"true"},"t":gLocales("Not Found")});
        Display.appendJson(json,this.nResults);
        //Asignar eventos a los resultados
        if(this.rIndex>=this.rList.length&&this.rList.length)this.rIndex=this.rList.length-1;
        for(let c of this.nResults.children){
            c.addEventListener("mouseover", (e)=>{
                let prevIndex=this.rIndex;
                this.cursorOnResults=true;
                this.rIndex=Display.dGetChildIndex(e.target);
                this.#dUpdateSearchIndex(this.nResults,prevIndex);
            });c.addEventListener("click", ()=>{
                this.nInput.value=this.rList[this.rIndex]["v"];
                this.nInput.focus();
            });
        }this.#dUpdateSearchIndex(this.nResults,0);
    }
    createEvents(){
        //Obtener nodos
        this.nInput=this.DOM.getNode("input");
        this.nButton=this.DOM.getNode("button");
        this.nButton.addEventListener("click",(e)=>{this.#search(this.nInput.value);});
        //Actualizar resultados:
        this.nInput.addEventListener("keyup", (e) => {
            if(e.target.value!=this.prevValue){
                this.#update(e.target.value);
            }
        });
        if(this.data.showResults){
            this.nResults=this.DOM.getNode("results");
            this.nInput.addEventListener("focusin", (e) => {
                if(!this.cursorOnResults){
                    let prevIndex=this.rIndex;this.rIndex=0;this.#dUpdateSearchIndex(this.nResults,prevIndex);
                }this.nResults.hidden=false;
                this.#dUpdateSearchIndex(this.nResults,0);
            });this.nInput.addEventListener("focusout", (e) => {
                if(!this.cursorOnResults)
                    this.nResults.hidden=true;
            });
            this.nResults.addEventListener("mouseout", (e)=>{this.cursorOnResults=false;});
            this.nInput.addEventListener("keydown", (e) => {
                if(this.rList.length){
                    let prevIndex=this.rIndex;
                    switch(e.code){
                        case "ArrowUp":
                            this.rIndex--;break;
                        case "ArrowDown":
                            this.rIndex++;break;
                    }if(this.rIndex>=this.rList.length){
                        this.rIndex=0;
                    }else if(this.rIndex<0){
                        this.rIndex=this.rList.length-1;
                    }switch(e.code){
                        case "ArrowUp":case "Tab":case "ArrowDown":
                            e.target.value=this.rList[this.rIndex]["v"];break;
                    }this.#dUpdateSearchIndex(this.nResults,prevIndex);
                }
            });
            this.dRefreshResults();
        }
        this.nInput.addEventListener("keydown", (e) => {
            switch(e.code){
                case "Enter": 
                    this.#search(e.target.value);break;
            }switch(e.code){
                case "ArrowUp":case "Tab":case "ArrowDown":
                    e.preventDefault();
            }this.prevValue=e.target.value;
        });
    }
    createNodes(){
        let json=[{"n":"div","a":{class:"position-relative"},"c":[{"n":"div","a":{class:"input-group"},"c":[{"n":"input","a":{id:this.DOM.getId("input"),type:"text",class:"form-control rounded-start-pill","placeholder":gLocales("Search")}},{"n":"button","a":{id:this.DOM.getId("button"),class:"btn btn-outline-secondary rounded-end-pill",type:"button"},"c":[{"n":"i","a":{class:"fas fa-search"}}]}]},{"n":"ul","a":{id:this.DOM.getId("results"),class:"list-group w-100 position-absolute top-100 start-50 translate-middle-x z-3","hidden":""}}]}];
        return json;
    }
    getValue(){
        return this.nInput.value;
    }
    setSearchEvent(searchEvent){
        this.#search=searchEvent;
    }
    setUpdateEvent(updateEvent){
        if(this.data.showResults){
            this.#update=async (input) => {
                this.rList=await updateEvent(input);
                this.dRefreshResults();
            };
        }else this.#update=async (input)=>{updateEvent(input);};
    }
    static defaultData = {
        showResults:false,
    }
    constructor(data={}){
        super();
       this.data=Partial.assignJson(data,SearchBar.defaultData);
        if(this.data.showResults){
            this.rIndex=0;
            this.rList=[];
        }this.cursorOnResults=false;
        this.prevValue=null;
        this.init(this);
    }
};
class Pagination extends Partial {
    #prevIndex=0;#data={};
    static #jAddItem(name){
        return {n:"li",a:{class:"page-item"},c:[{n:"button",a:{class:"page-link"},t:name}]};
    }
    createNodes(){
        let buttons=["‹","›"];let page=[];
        if(this.data.hasFirstLast)buttons=["«",...buttons,"»"];
        for(const t of buttons){page.push(Pagination.#jAddItem(t));}
        let json=[{n:"nav",a:{"aria-label":"...",class:"d-flex justify-content-between align-items-center"},c:[{n:"div",a:{class:"d-flex gap-1 align-items-center"},c:[{n:"div",a:{class:"col-auto"},c:[{n:"span",a:{class:"form-text"},t:gLocales("Page")}]},{n:"div",a:{class:"col-sm-2"},c:[{n:"input",a:{id:this.DOM.getId("input"),class:"form-control form-control-sm","aria-label":".form-control-sm"}}]},{n:"div",a:{class:"col-auto"},c:[{n:"span",a:{id:this.DOM.getId("info"),class:"form-text"}}]}]},{n:"ul",a:{class:"pagination mb-0",id:this.DOM.getId("pagination")},c:page}]}];
        return json;
    }
    createEvents(){
        this.nMessage=this.DOM.getNode("info");
        this.nInput=this.DOM.getNode("input");
        this.nPagination=this.DOM.getNode("pagination");
        this.nPagFirst=this.nPagination.childNodes[0+this.data.hasFirstLast];
        this.nPagLast=this.nPagination.childNodes[this.nPagination.childNodes.length-(1+this.data.hasFirstLast)];
        //Input:
        EventValidation.numberInput(this.nInput,this);
        this.nInput.addEventListener("input",(e)=>{
            let value=parseInt(e.target.value);
            if(!isNaN(value)) this.setPageNum(value);
        });
        let b=this.nPagination.querySelectorAll("button");
        //Botones
        b[0+this.data.hasFirstLast].addEventListener("click",()=>{this.setPageNum(this.data.index-1);});
        b[b.length-(1+this.data.hasFirstLast)].addEventListener("click",()=>{this.setPageNum(this.data.index+1);});
        if(this.data.hasFirstLast){
            b[0].addEventListener("click",()=>{this.setPageNum(1);});
            b[b.length-1].addEventListener("click",()=>{this.setPageNum(this.data.pageNum);});
        }
        this.#updatePageNum();
       this.data.pageEvent(this.data.index);
        let pag = this.nPagination.querySelectorAll("button");
        for(let i=0;i<pag.length;i++)
            Display.setNodeInterpolation(pag[i],{"opacity":["0%", "100%"]}, .2, i*.05);
    }
    #dUpdatePagination(){
        let lItemsAction="add";let rItemsAction="remove";
        if(this.data.index>1)lItemsAction="remove";
        if(this.data.index>=this.data.pageNum)rItemsAction="add";
        this.nPagFirst.classList[lItemsAction]("disabled");
        this.nPagLast.classList[rItemsAction]("disabled");
        if(this.data.hasFirstLast){
            this.nPagFirst.previousSibling.classList[lItemsAction]("disabled");
            this.nPagLast.nextSibling.classList[rItemsAction]("disabled");
        }
        let offset=Math.ceil(this.data.index-this.data.maxPages/2);
        let index=1;
        if(offset>this.data.pageNum-this.data.maxPages+1)offset=this.data.pageNum-this.data.maxPages+1;if(offset<1)offset=1;
        for(let i=0;i<this.nButtonList.length;i++){
            let num = offset+i;
            this.nButtonList[i].childNodes[0].textContent=num;
            if(num==this.data.index)index=i;
        }
        if(this.nButtonList[this.#prevIndex])
            this.nButtonList[this.#prevIndex].classList.remove("active");
        this.nButtonList[this.#prevIndex=index].classList.add("active");
        this.nInput.value=this.data.index;
        this.nMessage.textContent=gLocales("of",this.data.pageNum);
    }
    #updatePageNum(index=0){
        let size=this.data.maxPages<this.data.pageNum?this.data.maxPages:this.data.pageNum;
        while(this.nPagFirst.nextSibling!=this.nPagLast||!this.nPagFirst.nextSibling)
            this.nPagFirst.nextSibling.remove();
        this.nButtonList=[];
        for(let i=size;i>0;i--){
            this.nButtonList=[...Display.jInsertBefore(this.nPagFirst,[Pagination.#jAddItem(index+i)]),...this.nButtonList];
        };
        let numSize=this.data.pageNum.toString().length+3;
        this.nButtonList.forEach(i=>{
            i.childNodes[0].addEventListener("click",(e)=>{
                this.setPageNum(parseInt(e.target.textContent));e.target.blur();
            });
            i.childNodes[0].style.width=`${numSize}ch`;
        });
       this.data.index=((this.data.index>this.data.pageNum)?this.data.pageNum:(this.data.index<1)?1:this.data.index);
        this.#dUpdatePagination();
    }
    setPageNum(num){
        if(this.data.index!=num){
           this.data.index=((num>this.data.pageNum)?this.data.pageNum:(num<1)?1:num);
            this.#dUpdatePagination();
        }
       this.data.pageEvent(this.data.index);
    }
    setPageSize(num){
        if(this.data.pageNum!=num){
           this.data.pageNum=num;
            this.#updatePageNum();
        }
    }
    setPageEvent(pageEvent){
       this.data.pageEvent=pageEvent;
       this.data.pageEvent(this.data.index);
    }
    getPageNum(){
        returnthis.data.index;
    }
    static defaultData = {
        index:1,
        pageNum:15,
        maxPages:5,
        hasFirstLast:true,
        pageEvent:()=>{},
    }
    constructor(data={}){
        super();
       this.data=Partial.assignJson(data,Pagination.defaultData);
        this.init(this);
    }
};
class Tab extends Partial{
    #data={};#s={};#prevIndex=0;
    #tabEvent=()=>{};
    createNodes(){
        let json=[
            {n:"ul",a:{class:"nav nav-tabs", id:this.DOM.getId("tabs")}}
        ];
        return json;
    }
    createEvents(){
        this.nTabs=this.DOM.getNode("tabs");
        this.#updateTabs();
    }
    #updateTabActive(index){
        if(this.nButtons[this.#prevIndex]!=undefined)this.nButtons[this.#prevIndex].classList.remove("active");
        this.nButtons[this.#prevIndex=index].classList.add("active");
    }
    #updateTabs(){
        let tabs = [];
        for(const i of this.data.data)
            tabs.push({n:"li",a:{class:"nav-item"},c:[{n:"button",a:{class:"nav-link",type:"button"},"t":i.name}]});
        console.log(this.nTabs,tabs);
        Display.jReplaceChild(this.nTabs,tabs);
        this.nButtons=this.nTabs.querySelectorAll("button");
        for(const i in this.data.data){
            this.nButtons[i].addEventListener("click",()=>{
                this.#updateTabActive(i);
                this.#tabEvent(this.data.data[i].value);
            });
        }this.#updateTabActive(0);
    }
    setTabEvent(tabEvent){
        this.#tabEvent=tabEvent;
    }
    static defaultData = {
        data:[{name:"Tab"}],
    }
    constructor(data={}){
        super();
       this.data=Partial.assignJson(data,Tab.defaultData);
        for(let i=0;i<this.data.data.length;i++)
            if(!this.data.data[i].hasOwnProperty("value"))
               this.data.data[i].value=this.data.data[i].name;
        this.init(this);
    }
}
class Filter extends Partial{
    createNodes(){
        
    }
    constructor(){
        super();
        
        this.init(this);
    }
}
export {SearchBar, Pagination, Tab, Filter};