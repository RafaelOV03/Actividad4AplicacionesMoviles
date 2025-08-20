import { Partial, Display } from "../common.js"
class OffCanvas extends Partial{
    #data={};#s={}
    createNodes(){
        let json=[{n:"div",a:{"class":"offcanvas offcanvas-start","data-bs-scroll":"true","tabindex":"-1","id":"offcanvasWithBothOptions","aria-labelledby":"offcanvasWithBothOptionsLabel"},c:[{n:"div",a:{"class":"offcanvas-header"},c:[{n:"h5",a:{"class":"offcanvas-title","id":"offcanvasWithBothOptionsLabel"}},{n:"button",a:{"type":"button","class":"btn-close","data-bs-dismiss":"offcanvas","aria-label":"Close"}}]},{n:"div",a:{"class":"offcanvas-body"},c:[{n:"div",a:{"class":"list-group"},c:[{n:"a",a:{"href":"/dashboard/productos","class":"list-group-item list-group-item-action d-flex gap-3 py-3","aria-current":"true"},c:[{n:"div",a:{"class":"d-flex gap-2 w-100 justify-content-between"},c:[{n:"div",c:[{n:"h6",a:{"class":"mb-0"}},{n:"p",a:{"class":"mb-0 opacity-75"}}]}]}]},{n:"a",a:{"href":"/dashboard/ventas","class":"list-group-item list-group-item-action d-flex gap-3 py-3","aria-current":"true"},c:[{n:"div",a:{"class":"d-flex gap-2 w-100 justify-content-between"},c:[{n:"div",c:[{n:"h6",a:{"class":"mb-0"}},{n:"p",a:{"class":"mb-0 opacity-75"}}]}]}]},{n:"a",a:{"href":"/dashboard/usuarios","class":"list-group-item list-group-item-action d-flex gap-3 py-3","aria-current":"true"},c:[{n:"div",a:{"class":"d-flex gap-2 w-100 justify-content-between"},c:[{n:"div",c:[{n:"h6",a:{"class":"mb-0"}},{n:"p",a:{"class":"mb-0 opacity-75"}}]}]}]}]}]}]}];
        return json;
    }
    createEvents(){
    }
    constructor(data={}){
        super();
        this.init(this);
    }
}
export {OffCanvas};