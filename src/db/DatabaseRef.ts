import {Database} from './Database';
import {printf} from '../util/Format'; 
type DatabaseRefEventType = "val"|"add_item"|"remove_item"|"set"; 
type DatabaseRefCallback = ((resp:any)=>void) & {__id?:number}; 
type DatabaseRefEventsContainer = {
    val:DatabaseRefCallback[],
    add_item:DatabaseRefCallback[],
    remove_item:DatabaseRefCallback[],
    set:DatabaseRefCallback[]};


export class DatabaseRef {
    _db:Database;  
    _key:string;
    _$cbid:number;
    _data:any;
    _events:DatabaseRefEventsContainer; //util.Dictionary<DatabaseRefCallback[]>; 
    constructor(key:string,database:Database){
        this._key = key;
        this._$cbid = 0;
        this._onClose = this._onClose.bind(this); 
        this._onMessage = this._onMessage.bind(this); 
        this._events = {
            val:[],
            add_item:[], 
            remove_item:[],
            set:[],
        }; 
        this._db = database;  
    }

    _onMessage(msg:CommandResultPayload){
        switch(msg.type){
            case ResultPayloadType.ADD_ITEM:
            this._events.add_item.forEach(c=>c(msg.data)); 
            this._events.val.forEach(c=>c(msg.data)); 
            break;
            case ResultPayloadType.REMOVE_ITEM:
            break;
            case ResultPayloadType.SET:
            break;
            default:
            throw new Error(printf("Unrecognised message type: %s",msg.type)); 
        }
    }

    _onClose(){

    }

    on(eventType:DatabaseRefEventType,cb:DatabaseRefCallback){
        if (!cb.__id){
            cb.__id = ++this._$cbid; 
            this._events[eventType].push(cb); 
        }
    }

    off(eventType:DatabaseRefEventType,cb:DatabaseRefCallback){
        if(!cb.__id){
            throw new Error(printf("Provided callback is not registered with this component."))
        }
        this._events[eventType] = this._events[eventType].filter((e)=>{
            return e.__id !== cb.__id;
        });
    }

}