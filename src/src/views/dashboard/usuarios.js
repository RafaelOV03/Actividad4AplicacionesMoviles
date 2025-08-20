import { Partial, Display} from "/src/partials/common.js";
import { Crud } from "/src/partials/stdbs/crud.js";
import { Modal } from "/src/partials/stdbs/modal.js";
import { gFetch } from "/src/modules/fetch.js";

class MainPage extends Partial{
    createNodes(){
        let json=[{n:"div",a:{class:"container-xxl py-3 d-flex flex-column h-100"},
            c:[
                {n:"div",a:{class:"d-flex"},c:[
                    {n:"button",a:{style:"","class":"mb-2 btn btn-primary","type":"button","data-bs-toggle":"offcanvas","data-bs-target":"#offcanvasWithBothOptions","aria-controls":"offcanvasWithBothOptions"},t:"Menu"},
                    {n:"h2",a:{class:"text-center w-100",id:this.DOM.getId("text")},t:"Base de datos - Usuarios"},
                ]},
                {n:"div",a:{class:"card h-100"},c:[
                    {n:"div",a:{class:"card-body h-100"},c:[
                        this.appendChild("crud",this.crud),
                    ]},
                ]},
                {n:"div",a:{"class":"offcanvas offcanvas-start","data-bs-scroll":"true","tabindex":"-1","id":"offcanvasWithBothOptions","aria-labelledby":"offcanvasWithBothOptionsLabel"},c:[{n:"div",a:{"class":"offcanvas-header"},c:[{n:"h5",a:{"class":"offcanvas-title","id":"offcanvasWithBothOptionsLabel"},t:"Base de datos"},{n:"button",a:{"type":"button","class":"btn-close","data-bs-dismiss":"offcanvas","aria-label":"Close"}}]},{n:"div",a:{"class":"offcanvas-body"},c:[{n:"div",a:{"class":"list-group"},c:[{n:"a",a:{"href":"/dashboard/productos","class":"list-group-item list-group-item-action d-flex gap-3 py-3","aria-current":"true"},c:[{n:"div",a:{"class":"d-flex gap-2 w-100 justify-content-between"},c:[
                    {n:"div",c:[{n:"h6",a:{"class":"mb-0"},t:"Productos"},{n:"p",a:{"class":"mb-0 opacity-75"},t:"Productos, imagenes, tags, tags de producto"}]}]}]},{n:"a",a:{"href":"/dashboard/ventas","class":"list-group-item list-group-item-action d-flex gap-3 py-3","aria-current":"true"},c:[{n:"div",a:{"class":"d-flex gap-2 w-100 justify-content-between"},c:[{n:"div",c:[
                        {n:"h6",a:{"class":"mb-0"},t:"Ventas"},{n:"p",a:{"class":"mb-0 opacity-75"},t:"Ventas, detalles de ventas"}]}]}]},{n:"a",a:{"href":"/dashboard/usuarios","class":"list-group-item list-group-item-action d-flex gap-3 py-3","aria-current":"true"},c:[{n:"div",a:{"class":"d-flex gap-2 w-100 justify-content-between"},c:[{n:"div",c:[
                            {n:"h6",a:{"class":"mb-0"},t:"Usuarios"},{n:"p",a:{"class":"mb-0 opacity-75"},t:"Usuarios, roles, permisos, permisos de rol"}]}]}]}]}]}]}
            ]
        }];
        return json;
    }
    createEvents(){}
    constructor(){
        super();
        this.page={name:"Home"};
        this.crud=new Crud({
                url:"/dashboard/$PREFIX",
                values:[
                    {
                        name:"Usuario",prefix:"usuario",
                        columns:{
                            id:{name:"#ID"},
                            nombres:{name:"Nombres"},
                            apellidos:{name:"Apellidos"},
                            username:{name:"Usuario"},
                            rol:{name:"Rol",type:"object",format:"#%: %",formatArgs:["id","nombre"]},
                            
                        }
                    },
                    {
                        name:"Rol",prefix:"rol",
                        columns:{
                            id:{name:"#ID"},
                            nombre:{name:"Rol"},
                            descripcion:{name:"Descripcion"},
                        },
                        form:{
                            validation:true,
                            rows:[
                                {name:"_",text:"No puedes crear o modificar usuarios",input:{type:"hidden"}},
                            ]
                        }
                    },
                    {
                        name:"Permiso",prefix:"permiso",
                        columns:{
                            id:{name:"#ID"},
                            nombre:{name:"Permiso"},
                            descripcion:{name:"Descripcion"},
                        },
                        form:{
                            validation:true,
                            rows:[
                                {name:"nombre",label:"Nombre",input:{type:"text",placeholder:"Nombre"}},
                                {name:"descripcion", label:"Descripcion",input:{type:"textarea",placeholder:"Descripcion"}},
                            ]
                        }
                    },
                    {
                        name:"Rol-Permiso",prefix:"rolpermiso",
                        columns:{
                            id:{name:"#ID"},
                            rol:{name:"Rol",type:"object",format:"#%: %",formatArgs:["id","nombre"]},
                            permiso:{name:"Permiso",type:"object",format:"#%: %",formatArgs:["id","nombre"]},
                        },
                        form:{
                            validation:true,
                            rows:[
                                {name:"rol_id", label:"Rol",input:{type:"number",placeholder:"Rol"}},
                                {name:"permiso_id",label:"Permiso",input:{type:"number",placeholder:"Tag"}},
                            ]
                        }
                    },
                ]
            });
        this.init(this);
    }
}
export {MainPage};