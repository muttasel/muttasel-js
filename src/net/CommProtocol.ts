import {Connection} from './Connection';  
export interface CommProtocol {
    connect(url:string):Connection; 
    disconnect(data?:any):void;
}