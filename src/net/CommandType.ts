/**
 * The supported command types. 
 * 
 * @export
 * @enum {number}
 */
export enum CommandType {
    CommandAssignID         = 0x00001,
    CommandPeerConnected    = 0x00002,
    CommandPeerDisconnected = 0x00003,
    CommandList             = 0x00004,
    CommandTerminate        = 0x00005,
    CommandBroadcast        = 0x00006,
}
