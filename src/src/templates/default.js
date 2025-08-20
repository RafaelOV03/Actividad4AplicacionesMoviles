import { Partial, Display } from "/src/partials/common.js";
import { gFetch } from "/src/modules/fetch.js";
import { gLocales } from "/src/modules/locales.js"
import { SearchBar } from "/src/partials/stdbs/navigation.js"
class MainNavBar extends Partial{
    createNodes(){
        let li=[{n:"li",a:{class:"nav-item"},c:[{n:"a",a:{class:"nav-link",href:gLocales("url")},t:gLocales("Inicio")}]}];
        let json=[{n:"div",a:{class:"navbar navbar-expand-md bg-body-tertiary shadow", id:this.DOM.getId("navbar")},c:[{n:"div",a:{class:"container-fluid"},c:[{n:"a",a:{class:"navbar-brand d-flex",href:"/"},c:[{n:"img",a:{src:"/assets/img/notfound-icon.png",alt:"Logo",width:"40",height:"40",class:"d-inline-block align-text-top"}},{n:"span",a:{class:"align-self-center"},t:gLocales("PagName")}]},
            {n:"button",a:{class:"navbar-toggler",type:"button","data-bs-toggle":"collapse","data-bs-target":"#"+this.DOM.getId("collapse"),"aria-controls":this.DOM.getId("collapse"),"aria-expanded":"false","aria-label":"Toggle navigation"},c:[{n:"span",a:{class:"navbar-toggler-icon"}}]},            
            {n:"div",a:{class:"collapse navbar-collapse gap-2",id:this.DOM.getId("collapse")},c:[
                {n:"ul",a:{class:"navbar-nav me-auto",id:this.DOM.getId("items")},c:li},
                {n:"div",a:{class:"my-2 w-100"},c:[this.appendChild("searchBar",new SearchBar())]},
                {n:"div",a:{class:"d-flex gap-2 justify-content-end",id:this.DOM.getId("profile")}},
            ]}
        ]}]}];
        return json;
        Display.setNodeInterpolation(this.DOM.getNode("navbar"),
            {"marginTop":["-3rem", "0rem"]}, .5
        );
    }
    createEvents(){
        this.nProfile=this.DOM.getNode("profile");
        this.updateProfile();
    }
    updateProfile(){
        let profile=[
            {n:"a",a:{class:"btn btn-secondary text-nowrap",href:"/singup",role:"button"},t:gLocales("Register")},
            {n:"a",a:{class:"btn btn-primary text-nowrap",href:"/login",role:"button"},t:gLocales("Login")},
        ];if(!json.error){
            profile=[
                {n:"div",c:[{n:"button",a:{"type":"button","class":"btn","data-bs-toggle":"dropdown","aria-expanded":"false"},c:[{n:"div",a:{"class":"d-flex align-items-center gap-2"},
                    c:[{n:"span",t:`${json.username}`},{n:"img",a:{"src":"/assets/img/profile.jpg","width":"30","height":"30","class":"rounded-circle"}}]}]},{n:"ul",a:{"class":"dropdown-menu dropdown-menu-end"},
                    c:[
                        {n:"h5",a:{class:"mx-3 text-center"},t:`${json.nombres} ${json.apellidos?json.apellidos:""}`},
                        json.rol=="Administrador"?{n:"li",c:[{n:"a",a:{"class":"dropdown-item","href":"/dashboard/productos"},t:"Dashboard"}]}:{},
                        {n:"li",c:[{n:"a",a:{"class":"dropdown-item","href":"#"},t:"Carrito"}]},
                        {n:"li",c:[{n:"a",a:{"class":"dropdown-item","href":"#"},t:"Historial de compras"}]},
                        {n:"li",c:[{n:"hr",a:{"class":"dropdown-divider"}}]},
                        {n:"li",c:[{n:"button",a:{"class":"dropdown-item",id:this.DOM.getId("logout")},t:"Log out"}
                    ]
                }]}]},
            ]
        }
        this.DOM.removeChildren(this.nProfile)
        this.DOM.appendJson(this.nProfile,profile);
        let button;if(button=this.DOM.getNode("logout")){
            button.addEventListener("click",async ()=>{
                await gFetch.get("/logout").then(async (json)=>{
                    if(!json.error){
                        env.c.template.setSession();
                        env.goToView("/");
                    }
                });
            });
        }
    }
    constructor(){
        super();
        this.init(this);
    }
}
//Plantilla por defecto
class MainTemplate extends Partial{
    createNodes(){
        let json=[{n:"div",a:{class:"h-100 d-flex flex-column"},c:[{n:"nav",c:[this.appendChild("nav", new MainNavBar())]},
            {n:"main",a:{class:"overflow-scroll h-100", id:this.DOM.getId("main")},c:[this.appendChild("main", new Partial())]}]}
        ];
        return json;
    }
    createEvents(){
        this.setSession();
    }
    async setSession(){
        await gFetch.get("/user").then(json=>{
            this.child.nav.updateProfile(json);
        }).catch(error=>{
            console.log("Error al obtener la sesion:", error);
        });
    }
    constructor(){
        super();
        this.init(this);
    }
}
export {MainTemplate};