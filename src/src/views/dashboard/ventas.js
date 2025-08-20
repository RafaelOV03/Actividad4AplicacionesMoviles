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
    createEvents(){
    }
    constructor(){
        super();
        this.page={name:"Home"};
        this.crud=new Crud({
            url:"/dashboard/$PREFIX",
            values:[
                {
                    name:"Venta",prefix:"venta",
                    columns:{
                        id:{name:"#ID"},
                        fecha:{name:"Fecha"},
                        total:{name:"Total"},
                        estado:{name:"Estado"},
                        usuario:{name:"Usuario",type:"object",format:"#%: % % (%)",formatArgs:["id","nombres", "apellidos","username"]},
                    },form:{
                        validation:true,
                        rows:[
                            {name:"fecha",label:"Fecha",input:{type:"date",placeholder:"Fecha"}},
                            [
                                {name:"total",label:"Total",input:{placeholder:"Total"}},
                                {name:"estado",label:"Estado",input:{placeholder:"Estado"}},
                            ],
                            {name:"user_id", label:"Usuario",input:{type:"number",placeholder:"Usuario"}},
                        ]
                    }
                },
                {
                    name:"Detalle Venta",prefix:"detalleventa",
                    columns:{
                        id:{name:"#ID"},
                        precio:{name:"Precio"},
                        cantidad:{name:"Cantidad"},
                        atributos:{name:"Atributos"},
                        subtotal:{name:"Sub-total"},
                    },
                    form:{
                        validation:true,
                        rows:[
                            {name:"precio",label: "Precio", input:{type:"number", placeholder:"Precio",typeArgs:{decimal:true}}},
                            {name:"cantidad",label: "Cantidad", input:{type:"number", placeholder:"Cantidad"}},
                            {name:"atributos",label:"Atributos",input:{type:"text",placeholder:"Atributos"}},
                            {name:"subtotal",label: "Sub-total", input:{type:"number", placeholder:"Sub-total",typeArgs:{decimal:true}}},
                            {name:"producto_id",label: "Producto", input:{type:"number", placeholder:"Producto"}},
                            {name:"venta_id",label: "Venta", input:{type:"number", placeholder:"Venta"}},
                        ]
                    }
                },
            ]
        });
        this.init(this);
    }
}
export {MainPage};