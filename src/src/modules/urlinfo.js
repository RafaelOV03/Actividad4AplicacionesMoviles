import {gFetch} from "./fetch.js"
class UrlInfo{
    #parseUrl(urlArray,index){
        let list = this.urlList[index].format;
        if(urlArray.length!=list.length)return null;
        let result={fileName:"",data:{},queries:{}};
        for(let i = 0;i<urlArray.length;i++){
            switch(list[i].charAt(0)){
                case "#"://Simbolo de ID
                    result.data[list[i].substring(1)]=urlArray[i];
                    result.fileName+="/#";
                break;
                default:
                    if(list[i]!=urlArray[i])return null;
                    result.fileName+=`/${list[i]}`;
            }
        }for(let n in this.urlList[index].queries)result.queries[n]=this.urlList[index].queries[n];
        return result;
    }
    getPathInfo(url=window.location){
        if(typeof url == "string")url=new URL(url,window.location.origin);
        let result={fileName:url.pathname,data:{},queries:{}};
        if(result.fileName.slice(-1)=="/")result.fileName+=this.mainName;
        let array=url.pathname.split("/");
        if(array[0]==""){//El primer elemento debe estar vacio, significa que la url si empieza con "/"
            array.shift();
            for(let i in this.urlList){
                let temp=this.#parseUrl(array,i);
                if(temp){result=temp;break;}
            }
        }
        result.queries=Object.assign(result.queries,Object.fromEntries(new URLSearchParams(url.search).entries()));
        result.fileName+=".js";
        result.url=url;
        return result;
    }
    setUrlList(array){
        this.urlList=array;
    }
    setMainName(name){
        this.mainName=`${name}`;
    }
    constructor(){
        this.mainName="index";
        this.pathname="/";
        this.urlList=[];
    }
}
/*
    Estructura para rutas especiales:
    {
        default: "index",
        url:[
            {
                format:["user","#id","edit","#data"] //Formato de la url (#para una id personalizada)
                queries:{id: "1", v="0"}, //Queries de la url, aqui solo se define los valores por defecto
            };
        ]
    }
*/
let gUrl = new UrlInfo();
async function urlInit(){
    try{
        let temp = await gFetch.updateStorage("/url");
        gUrl.setMainName(temp.default);
        gUrl.setUrlList(temp.url);
    }
    catch(error){console.error("Url-Error:",error.message);}
}
export {UrlInfo, gUrl, urlInit};