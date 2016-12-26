import {Message} from './Message'; 

export type ConnectionEventName = "message"|"close"|"error";
export type EventCallback = (resp:any)=>void & {__id?:number};  
export type CommandResultCallback = (msg:Message)=>void; 

export interface Connection {
    send(data:any):void; 
    addEventListener(eventName:ConnectionEventName,cb:CommandResultCallback);
    removeEventListener(eventName:ConnectionEventName,cb:CommandResultCallback);
    close():void;
}