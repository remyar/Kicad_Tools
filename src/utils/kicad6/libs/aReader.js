
let file = [];
let lineIdx = 0;

function openFile(str){
    file = str.split('\n').map((l) => {return l.replace('\r' , '');});
    lineIdx = 0;
}

function Line(){
    lineIdx++;
    return file[lineIdx-1].trim();
}

function nbLines(){
    return file.length;
}

function linesRemaining(){
    return file.length - lineIdx;
}

function rewind(){
    lineIdx--;
}

export default {
    openFile,
    Line,
    nbLines,
    linesRemaining,
    rewind
}