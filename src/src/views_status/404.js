import { Partial } from "/src/partials/common.js";
class MainPage extends Partial{
    createNodes(){
        let json = [
            {n:"div", a:{class:"container py-4 h-100 d-flex flex-column justify-content-between"}, t:
                "Error: Pagina no encontrada"
            }
        ];
        json = [
            {n:"div", a:{class:"d-flex flex-column align-items-center justify-content-center px-2 h-100"}, c:[
                {n:"div", a:{class:"text-center"}, c:[
                    {n:"h1", a:{class:"display-1 fw-bold"}, t:"404"},
                    {n:"p", a:{class:"fs-2 fw-medium mt-4"}, t:"Pagina no encontrada!"},
                    {n:"p", a:{class:"mt-4 mb-5"}, t:"La página que estás buscando no existe o ha sido movida."}
                ]},
                {n:"a", a:{href:"/", class:"btn btn-primary fw-semibold rounded-pill px-4 py-2"}, c:[
                    {n:"span", t:"Ir a Inicio"}
                ]}
            ]},
            
        ];
        return json;
    }
    createEvents(){}
    constructor(){
        super();
        this.page={
            name:"Error 404",
        };
        this.init(this);
    }
}
export {MainPage};