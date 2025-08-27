class FetchData{
    abort(){
        this.controller.abort();
    }
    constructor(ID,cancelable=true){
        this.ID=ID;
        this.cancelable=cancelable;
        this.controller=new AbortController();
    }
}
let gFetchDataList = []; //Lista de todos los fetchData
let globalID = 1;
class FetchEnv{
    #list={};
    #aborted={};
    #getController(ID){
        if(this.#list.hasOwnProperty(ID)){
            return this.#list[ID];
        }return null;
    }
    static abortAllFetchs(){
        for(const fetchenv of gFetchDataList){
            fetchenv.abortAll();
        }
    }
    //Abortar todos los fetch cancelables
    abortAll(){
        for(const ID in this.#list){
            if(this.#list[ID].cancelable){
                this.abort(ID);
            }
        }
    }
    abort(ID,error=true){
        let data=this.#getController(ID);
        if(data){
            data.abort();delete this.#list[ID];
            if(error)this.#aborted[ID]=true;
        }
    }
    async #fetch(url,type="json",ID=`fetch-${++globalID}`,cancelable=true,options={headers:this.headers}){
        let fetchError={"error":503,message:"Unavailable"};
        if(ID!==null){//Si es nulo, no se crea ningun fetchData nuevo 
            this.abort(ID,false);
            options.signal=(this.#list[ID]=new FetchData(ID,cancelable)).controller.signal;
        }
        try{
            let response=await fetch(`${this.mainUrl}${url}`,options);
            let value=await response[type]();
            delete this.#list[ID];
            return new Promise((resolve, reject)=>{
                if(response.ok)resolve(value);
                else reject(value);
            });
        }catch(e) {
            switch(e.name){
                case "TypeError":
                    fetchError.message=`${e.name}: ${e.message}`;
                    break;
                case "AbortError":
                    if(!this.#aborted.hasOwnProperty(ID)){
                        return {then:()=>{},catch:()=>{},finally:()=>{}};//Promise falso
                    }delete this.#aborted[ID];
                fetchError.message=`${e.message}`;
            }
        }return new Promise((resolve, reject)=>{
            reject(fetchError);
        });
    }
    async updateStorage(url,storage=localStorage){
        let name=`${this.mainUrl}${url}`;
        var value=JSON.parse(storage.getItem(name))||{version:"",data:{}};
        let newVersion="";
        await this.get(`${url}?v=1`).then(json=>{
            newVersion=json;
        });
        if(value.version!=newVersion)
            await this.get(url).then(json=>{
                value.version=newVersion;
                value.data=json;
                storage.setItem(name,JSON.stringify(value));    
            });
        return value.data;
    };
    async get(url,type="json",ID=`fetch-${++globalID}`,cancelable=true){
        return await this.#fetch(url,type,ID,cancelable,{
            method:"GET",
            headers:this.headers,
        });
    }
    async post(url, data="", type="json", ID=`fetch-${++globalID}`, cancelable=true){
        let form;
        if(data instanceof FormData) form=data;
        else{
            form=new FormData();
            if(typeof data==="object"){
                for(const i in data){
                    if(typeof data[i]==="object")data[i]=JSON.stringify(data[i]);
                    form.append(i,data[i]);
                }
            }else form.append("body",data);
        }
        return await this.#fetch(url,type,ID,cancelable,{
            method:"POST",
            body:form,
            headers:this.headers
        });
    }
    async login(url, data, onSuccess){
        await this.#fetch(url, 
            (json)=>{
                localStorage.setItem("session",json.token);
                this.headers["Authorization"]=`Bearer ${json.token}`;
                delete json.token;
                onSuccess(json);
            },{
                method:"POST",
                body:data,
                headers:this.headers
            }
        );
    }
    async isLogged(url="/user"){
        let response = null;
        await this.get(url,(json)=>{
            if(json.error)return;
            response=json;
        });
        return response;
    }
    async appendHeaders(headers){
        Object.assign(this.headers,headers);
    }
    constructor(mainUrl,headers={
        "Accept-Language": navigator.language,
        "Accept":"Application/json",
    }){
        this.headers=headers;
        this.mainUrl=mainUrl;
        gFetchDataList.push(this);
    }
}
let gFetch=new FetchEnv("http://192.168.30.236:8000/api",{
        "Accept-Language": navigator.language,
    });
export {FetchEnv, gFetch};