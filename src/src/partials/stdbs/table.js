import { Partial, Display, Loading } from "/src/partials/common.js";
import { gLocales } from "/src/modules/locales.js";
class Table extends Partial{
    #data={};
    #rows=[];
    #head=[];
    #prevRowNode=null;
    #rowFunc=async (id)=>{};
    #dUpdateRows(){
        Display.removeChildren(this.nRows);
        let rows=[];
        for(let row of this.#rows){
            let span=0;let cells=[];let i=0;
            for(let column in this.#head){
                if(row.hasOwnProperty(column)){
                    let value=row[column];
                    if(value==null){
                        span++;cells[i-span]["a"]={colspan:(1+span).toString()};
                    }else {switch(this.#head[column].type){
                        case "object":
                            let t=this.#head[column].format;
                            for(const arg of this.#head[column].formatArgs)
                                t=t.replace(`%`,value[arg]);
                            cells.push({n:"td",t:t});
                            break;
                        case "img":
                            cells.push({n:"td",a:{class:"w-25"},c:[{n:"img",a:{src:value,height:50}}]});
                            break;
                        case "textarea":
                            if(value.length>50)value=value.substring(0,50)+"...";
                        default:
                            cells.push({n:"td",t:value});
                    }span=0;}
                };i++;
            }rows.push({n:"tr",a:this.data.hover.enabled?{"data-table-id":row["id"]}:{},c:cells});
        }let nRows = Display.appendJson(rows,this.nRows);
        if(this.#rows&&this.data.hover.enabled)for(const row of nRows){
            row.addEventListener("click",
                async (e)=>{
                    if(this.#prevRowNode)this.#prevRowNode.classList.remove("table-active");
                    (this.#prevRowNode=e.currentTarget).classList.add("table-active");
                    await this.#rowFunc(e.currentTarget.getAttribute("data-table-id"));
                }
            );
        }
    }
    #dUpdateAll(){
        Display.removeChildren(this.nHead);
        let head=[];
        for(const h in this.#head)
            head.push({n:"th",a:{"scope":"col"},t:this.#head[h].name});
        Display.appendJson(head,this.nHead);
        this.#dUpdateRows();
    }
    createNodes(){
        let json=[{n:"table",a:{class:`table ${this.data.hover.enabled?"table-hover":""}`},c:[{n:"thead",c:[{n:"tr",a:{id:this.DOM.getId("headRow")}}]},{n:"tbody",a:{id:this.DOM.getId("bodyRows")}}]}];
        return json;
    }
    createEvents(){
        this.nHead=this.DOM.getNode("headRow");
        this.nRows=this.DOM.getNode("bodyRows");
        this.#dUpdateAll();
    }
    setRows(rows){
        this.#rows=rows;
        this.#dUpdateRows();
    }
    setData(head, rows=[]){
        this.#rows=rows;
        this.#head=head;
        this.#dUpdateAll();
    }
    setRowEvent(event){
        this.#rowFunc=event;
    }
    static defaultData={
        hover:{
            enabled:false,
            showID:false,
        },
    }
    constructor(data={}){
        super();
       this.data=Partial.assignJson(data,Table.defaultData);
        this.init(this);
    }
    /*
        Sintaxis:
            Head:
                {"Columna 1":{name:"",type:"",args:{...}},...}
            Rows:
                [{"Columna 1":"value"}]
    */
}
export {Table}