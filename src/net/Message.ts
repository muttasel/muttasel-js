import {CommandType} from './CommandType';
/**
 * Represents a message sent to a websocket node. 
 * @export
 * @interface Message 
 */
export interface Message {
    command:CommandType; 
    sender:number;
    to:number;
    payload:any;
}
