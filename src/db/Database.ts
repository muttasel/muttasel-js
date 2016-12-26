import {Connection} from '../net/Connection'; 
export class Database {
    _url:string;
    conn:net.Connection; 
    _refs:util.Dictionary<DatabaseRef>;
    constructor(cfg:DatabaseConfig){
        this._url = cfg.url;
        this.conn = null;
        this._refs = {};
        // this._onMessage = this._onMessage.bind(this); 
        if (cfg.type === ConnectionType.WebSocket){
            this.conn = new net.WebSocketConnection(cfg.url);
            // this.conn.on('message',this._onMessage as any);  
        }else {
            throw new Error("Currently, only WebSocket connections are supported!");
        }
    }

    // _onMessage(cmd:net.CommandResult){
    //     if (cmd.status){
    //         let ref = this._refs[cmd.path];
    //         ref._onMessage(cmd.payload);
    //     }
    // }

    ref(key:string):DatabaseRef{
        if (this._refs[key]){
            return this._refs[key]; 
        }
        return (this._refs[key] = new DatabaseRef(key,this));
    }

    on(path:string,cb:(snapshot:DatabaseSnapshot)=>void){
        if (this.conn){
            
        }
    }
}