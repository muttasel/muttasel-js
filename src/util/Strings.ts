export function stringRepeat(str:string,times:number,sep:string = ''):string{
    let array = new Array(times);
    for (var i=0;i<times;i++){
        array[i] = str; 
    }
    return array.join(sep); 
}