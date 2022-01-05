class Field {
    constructor(name, id = null) {
        this.id = id;
        this.name = name;
        this.value = "";
        this.position = { x: 0, y: 0 };
        this.textSize = { x: 1, y: 1 };
        this.angle = 0;
        this.textHJustify = 'C';
        this.textVJustify = 'C';
        this.italic = false;
        this.bold = false;
    }
    SetVisible(visible) {
        this.visible = visible;
    }
    Empty() {
        this.value = "";
    }
    SetText(val) {
        this.value = val;
    }
    GetId() {
        return this.id;
    }
    SetPosition(p) {
        this.position = { ...p };
    }
    SetTextSize(t) {
        this.textSize = { ...t };
    }
    SetTextAngle(a){
        this.angle = a;
    }
    SetHorizJustify(c){
        this.textHJustify = c;
    }
    SetVertJustify(c){
        this.textVJustify = c;
    }
    SetItalic(val){
        this.italic = val;
    }
    SetBold(val){
        this.bold = val;
    }
    SetName(val){
        this.name = val;
    }
}

export default Field;