export type CommandResultCallback = ((resp:CommandResult|Error)=>void) & {__id:number;};
