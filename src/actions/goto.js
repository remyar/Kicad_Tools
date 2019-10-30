import {shell}  from 'electron';

export const GOTO_START = "GOTO_START";

function goto(url){
    shell.openExternal(url);
    return { type : GOTO_START };
}

export default {
    goto
}