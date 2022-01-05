let idxToken = 0;
let tokens = [];

function generateTokens(line){
    tokens = line.trim().split(/[\s\r\n\t]+/);
    idxToken = 0;
}

function GetNextToken(){
    idxToken++;
    return tokens[idxToken - 1];
}

function length(){
    return tokens.length;
}

function HasMoreTokens(){
    return (tokens.length - idxToken ) > 0 ? true : false;
}

export default {
    generateTokens,
    GetNextToken,
    length,
    HasMoreTokens
}