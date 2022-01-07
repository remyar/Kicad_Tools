const PIN_INVISIBLE = 1;

class Pin {
    constructor(aParent, aName, aNumber, aOrientation, aPinType, aLength, aNameTextSize, aNumTextSize, aConvert, aPos, aUnit) {
        // this.aParent = aParent;
        this.m_position = aPos;
        this.m_length = aLength;
        this.m_orientation = aOrientation;
        this.m_shape = 'line';
        this.m_type = aPinType;
        this.m_attributes = 0;
        this.m_numTextSize = aNumTextSize;
        this.m_nameTextSize = aNameTextSize;
        this.SetName(aName);
        this.SetNumber(aNumber);
        this.SetUnit(aUnit);
        this.SetConvert(aConvert);
    }

    SetName(aName) {
        this.m_name = aName;
        this.m_name = this.m_name.replace(' ', '_');
    }
    GetName() {
        return this.m_name || "";
    }
    SetNumber(aNumber) {
        this.m_number = aNumber;
        this.m_number = this.m_number.replace(' ', '_');
    }
    SetConvert(aConvert) {
        this.m_convert = aConvert;
    }
    GetConvert() {
        return this.m_convert;
    }
    SetUnit(aUnit) {
        this.m_unit = aUnit;
    }
    GetUnit() {
        return this.m_unit;
    }
    IsVisible() { return (this.m_attributes & PIN_INVISIBLE) == 0; }
    SetVisible(aVisible) {
        if (aVisible)
            this.m_attributes &= ~PIN_INVISIBLE;
        else
            this.m_attributes |= PIN_INVISIBLE;
    }
    GetType() {
        return this.m_type;
    }
    GetShape() { return this.m_shape; }
    SetShape(aShape) { this.m_shape = aShape; }
    GetOrientation() { return this.m_orientation; }
    SetOrientation(aOrientation) { this.m_orientation = aOrientation; }
    SetPosition(p) {
        this.m_position = { ...p };
    }
    GetPosition() {
        return this.m_position;
    }
    GetLength() { return this.m_length; }
    SetLength(aLength) { this.m_length = aLength; }
    GetNameTextSize() { return this.m_nameTextSize; }
    SetNameTextSize(aSize) { this.m_nameTextSize = aSize; }
    GetNumberTextSize() { return this.m_numTextSize; }
    SetNumberTextSize(aSize) { this.m_numTextSize = aSize; }
    GetNumber() { return this.m_number; }
    GetShownNumber() { return this.m_number; }
    SetNumber(aNumber) {
        this.m_number = aNumber;

        // pin number string does not support spaces
        this.m_number = this.m_number.replace(" ", "_");
    }
    GetAlternates() { return this.m_alternates || []; }
    Type() {
        return "LIB_PIN_T";
    }

}

export default Pin;