import {Message} from './Message'; 
import {Connection,ConnectionEventName} from './Connection'; 
import {Dictionary} from '../util/Dictionary'; 
import {printf} from '../util/Format';
import {handleEvent,EventHandlerGenerator} from '../util/Events'; 
type SocketCallback = (event:any)=>void;
type WebSocketEventName = ConnectionEventName & "open"; 

export class WebSocketConnection implements Connection{
    _socket:WebSocket;
    _seq:number; 
    _$cbId:number;
    _events:Dictionary<any>; 
    _requests:Dictionary<SocketCallback>; 
    constructor(url:string,protocls?:string[]){
        let socket = new WebSocket(url,protocls||[]);
        this._onError = this._onError.bind(this); 
        this._onMessage = this._onMessage.bind(this); 
        this._onOpen = this._onOpen.bind(this); 
        this._onClose = this._onClose.bind(this);
        this._seq = 0; 
        this._$cbId = 0; 
        this._events = {
            'close':[],
            'open':[],
            'message':[],
            'error':[]
        }; 
        socket.addEventListener("open",this._onOpen);
        socket.addEventListener("close",this._onClose); 
        socket.addEventListener("message",this._onMessage); 
        socket.addEventListener("error",this._onError);  

        this._socket = socket; 
    }

    _onClose(ev:CloseEvent){
        this._events['close'].forEach(c => c(ev.code as any));
    }

    _onOpen(ev:Event){
        this._events['open'].forEach(c =>c(ev as any));
    }

    _onError(err:ErrorEvent){
        this._events['error'].forEach(c=>c(err.error));
    }
    
    _onMessage(msg:MessageEvent){
        let result = JSON.parse(msg.data) as Message;
        this._events['message'].forEach(c=>c(result));  
    }

    /**
     * 
     * 
     * @param {*} data
     * @returns {*}
     * 
     * @memberOf WebSocketConnection
     */
    send(data:any):any{
        if (data){
            let socket = this._socket; 
            switch(typeof data){
                case "number":
                case "string":
                socket.send(data); 
                break;
                case "function":
                let v = data(); 
                if (typeof v !== "function"){
                    return this.send(v); 
                }
                throw new Error(printf("Cannot send data %o of type %s over the channel",data,typeof data));
                case "object":
                socket.send((data && data.serialize && data.serialize())||(data && data.toJSON && JSON.stringify(data.toJSON()))||JSON.stringify(data)); 
                break;
                default:
                throw new Error(printf("Cannot send data of type %s over the channel",typeof data));
            }
        }
    }

    close(){
        this._socket.close(0,"Gracefully closing socket"); 
    }

    addEventListener(eventType:WebSocketEventName,cb:any,ctx?:any){
        if (typeof fn === "undefined"){
            throw new Error(printf("Event of type %s is not supported",eventType));
        }
        let fn = handleEvent(cb,ctx);  
        let id = (++this._$cbId);
        cb.__id = id;
        this._events[id] = fn; 
        this._socket.addEventListener(eventType,fn);
    }

    removeEventListener(eventType:WebSocketEventName,cb:CommandResultCallback){
        if (cb.__id){
            this._socket.removeEventListener(eventType,this._events[cb.__id])
            return;
        }
        throw new Error("Callback is not registered with this connection.");
    }

}