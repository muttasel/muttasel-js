import {ConnectionType} from './ConnectionType';
export interface DatabaseConfig {
    url:string;
    type:ConnectionType; 
}