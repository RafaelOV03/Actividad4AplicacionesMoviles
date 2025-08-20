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
                    {n:"h2",a:{class:"text-center w-100",id:this.DOM.getId("text")},t:"Base de datos - Productos"},
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
                    name:"Productos",prefix:"producto",
                    columns:{
                        id:{name:"#ID"},
                        nombre:{name:"Nombre"},
                        descripcion:{name:"Descripcion", type:"textarea"},
                        precio:{name:"Precio"},
                        stock:{name:"Stock"},
                        atributos:{name:"Atributos"}
                    },form:{
                        validation:true,
                        rows:[
                            {name:"nombre",label:"Nombre del producto",input:{placeholder:"Nombre"}},
                            {name:"descripcion",label:"Descripcion del producto",input:{type:"textarea",placeholder:"Descripcion"}},
                            [
                                {name:"precio",label: "Precio", text: "", input:{type:"number", placeholder:"Precio",typeArgs:{decimal:true}}},
                                {name:"stock",label: "Stock", text:"Dejar en blanco si es posible",input:{type:"number",placeholder:"Stock"}}
                            ],
                            {name:"atributos", label:"Atributos",input:{placeholder:"Atributos"}},
                        ]
                    }
                },
                {
                    name:"Imagenes",prefix:"imagenproducto",
                    columns:{
                        id:{name:"#ID"},
                        url:{name:"Imagen",type:"img"},
                        detalles:{name:"Detalles"},
                        producto:{name:"Producto",type:"object",format:"#%: % (%$)",formatArgs:["id","nombre","precio"]},
                    },
                    form:{
                        validation:true,
                        rows:[
                            {name:"imagen",label:"Imagen del producto",input:{type:"file"}},
                            {name:"detalles",label:"Descripcion de la imagen",input:{type:"textarea",placeholder:"Descripcion"}},
                            {name:"producto_id", label:"Producto",input:{type:"number",placeholder:"Producto"}},
                        ]
                    }
                },
                {
                    name:"Tag-Producto",prefix:"tagproducto",
                    columns:{
                        id:{name:"#ID"},
                        producto:{name:"Producto",type:"object",format:"#%: % (%$)",formatArgs:["id","nombre","precio"]},
                        tag:{name:"Tag",type:"object",format:"#%: %",formatArgs:["id","nombre"]},
                    },
                    form:{
                        validation:true,
                        rows:[
                            {name:"tag_id",label:"Tag",input:{type:"number",placeholder:"Tag"}},
                            {name:"producto_id", label:"Producto",input:{type:"number",placeholder:"Producto"}},
                        ]
                    }
                },
                {
                    name:"Tags",prefix:"tag",
                    columns:{
                        id:{name:"#ID"},
                        nombre:{name:"Tag"},
                        descripcion:{name:"Descripcion", type:"textarea"},
                        categoria:{name:"Categoria",type:"object",format:"#%: %",formatArgs:["id","nombre"]},
                    },
                    form:{
                        validation:true,
                        rows:[
                            {name:"nombre",label:"Nombre",input:{type:"text",placeholder:"Nombre"}},
                            {name:"descripcion", label:"Descripcion",input:{type:"textarea",placeholder:"Descripcion"}},
                        ]
                    }
                }
            ]
        });
        this.init(this);
    }
}
export {MainPage};