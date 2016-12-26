export interface EventHandlerGenerator<T,V>{
    (fn:(e:T)=>void,ctx?:any):((evt:V)=>any);
}

export function handleEvent<T,V>(fn:(e:T)=>void,ctx?:any){
    return function(evt:V){
        return fn.call(ctx||null,evt);
    }
}