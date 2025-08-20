class EventValidation {
    static numberInput(node,partial,args){
        args=Object.assign({negative:false,decimal:false},args);
        let str=`[^\\d${args.decimal?".":""}${args.negative?"-":""}]`;
        let regexList=[[new RegExp(str,"g"),""]];
        if(args.decimal)regexList.push([/(\..*)\./g, '$1']);
        if(args.negative)regexList.push([/(?!^)-/g, ""]);
        partial.nodeData[`${node.id}-regex`]=regexList;
        node.addEventListener("input",(e)=>{
            if(e.data)for(const i of partial.nodeData[`${e.target.id}-regex`])e.target.value=e.target.value.replace(...i);
        });//node.addEventListener("focusout",(e)=>{if(e.target.value=="")e.target.value="0";});
        node.addEventListener("focusin",(e)=>{if(e.target.value.replace("0",'')=='')e.target.select();});
    }
    static textInput(node,partial,args){
        if(Object.values(args).length){
            args=Object.assign({space:true,number:true,lowbar:true},args);
            let str=`[^\\w${args.space?' ':''}]`;
            let regexList=[[new RegExp(str,"g"),'']];
            if(!args.number)regexList.push([/[\d]/g, '']);
            if(!args.low_bar)regexList.push([/[_]/g, '']);
            partial.nodeData[`${node.id}-regex`]=regexList;
            node.addEventListener("input",(e)=>{
                if(e.data)for(const i of partial.nodeData[`${e.target.id}-regex`])e.target.value=e.target.value.replace(...i);
            });
        }
    }
}
class EventList {
    static setumber(e,negative=false,decimal=false){
        let invalid=false;
        if(!e.ctrlKey){
            if(e.keyCode<48||e.keyCode>57)invalid=true;
            switch(e.code){
                case"Backspace":case"Delete":
                case"ArrowLeft":case"ArrowRight":
                case"ControlLeft":case"ControlRight":
                case"Home":case"home":
                case"PageUp":case"PageDown":
                    invalid=false;
            }
            if(e.code=="Slash"&&negative&&(!e.target.selectionStart))invalid=false;
            if(e.code=="Period"&&decimal&&(e.target.value.split(".").length==2))invalid=false;
        }if(invalid)e.preventDefault();
    }
}
export {EventValidation};