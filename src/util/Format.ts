import {stringRepeat} from './Strings'; 
const FORMATTERS = {
    "d":(item:number|any,extra:string):string=>{
        if (extra.charAt(0)=== "."){
            return item.toFixed(+extra.substr(1));
        }else if (/^[0-9]+$/.test(extra)){
            let len = parseInt(extra); 
            let v = item+"";
            if (v.length < len){
                return stringRepeat("0",len-v.length)+v; 
            }
            return v; 
        }else {
            return item; 
        }
    },
    "x":(item:number|any):string=>{
        return item.toString(16); 
    },
    "o":(item:any):string=>{
        if (typeof item === "object"){
            if (item.toJSON){
                return JSON.stringify(item.toJSON()); 
            }
            return item.toString(); 
        }
        return item; 
    },
    "s":(item:any):string=>{
        return item; 
    }
}
export function printf(format:string,...args:any[]){
    let final = args.reduce<string>((prev,current,cIdx)=>{
        return prev.replace(/%([0-9]+?d|\.[0-9]+?d|d|x|s|o)/,(all:string,a:string)=>{
            let len = a.length,
                f = a.charAt(len-1);
            return FORMATTERS[f](current,a.substr(0,len-1)); 
        }); 
    },format); 
    return final;
}