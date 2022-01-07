

class Shape {
    constructor(aParent, aShape, aLineWidth = 0, aFillType = 'NO_FILL') {
        this.m_shape = aShape;
        this.m_lineWidth = aLineWidth;
        this.m_fillType = aFillType;
        this.m_points = [];
    }

    SetUnit(aUnit) { this.m_unit = aUnit; }
    getUnit() { return this.m_unit }
    SetConvert(aConvert) { this.m_convert = aConvert; }
    GetConvert() { return this.m_convert }
    SetStroke(aStroke, aPlotDashType) { this.m_stroke = aStroke; this.m_plotDashType = aPlotDashType; }
    AddPoint(pt) { this.m_points.push(pt) };
    SetFillMode(aFillType) { this.m_fillType = aFillType; }
    GetFillMode() { return this.m_fillType };
}


export default Shape