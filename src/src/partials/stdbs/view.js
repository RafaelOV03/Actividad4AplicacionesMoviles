import { Partial, Env } from "/src/partials/common.js";
import { SpinnerLoading } from "/src/partials/stdbs/loading.js";
import { gUrl } from "/src/modules/urlinfo.js";
import { FetchEnv, gFetch } from "/src/modules/fetch.js";
class EnvBS extends Env{
    #_isBody=false;
    #logged=false;
    #session;
    createNodes(){
        let json = [{n:"div",a:{
            class:`${this.#_isBody?"v":""}h-100`},
            c:[this.appendChild("template",new Partial())]
        }];
        return json;
    }
    createEvents(){
        this.setLoading(()=>{
            return new SpinnerLoading();
        });
        let token=localStorage.getItem("session-token");
        if(token)this.login(token);
        //.then((session)=>{
        //    this.callTemplate("login",session);
        //    this.callMain("login",session);
        //});
    }
    getSession(){
        if(this.#logged){
            return this.#session;
        }return null;
    }
    async login(token){
        this.ApiRest.appendHeaders({"Authorization":`Bearer ${token}`});
        await this.ApiRest.get("/login").then(
            json=>{
                this.#session=json;
                this.#logged=true;
                localStorage.setItem("session-token",token);
            }
        ).catch(()=>{this.#logged=false;});
        return new Promise(resolve=>{resolve(this.#session);});
    }
    constructor(root){
        super(root);
        this.#_isBody=(root==document.body);//Intentar verificar si el entorno ocupa toda la pagina
        this.ApiRest=new FetchEnv("http://localhost:8000/api");
        this.init(this);
    }
}
export {EnvBS};