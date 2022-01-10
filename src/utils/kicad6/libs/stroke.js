import convert_to_biu from './convert_to_biu';

class STROKE {
    constructor(aWidth = convert_to_biu.Mils2iu(6), aPlotStyle = 'default', aColor = { r: 0, g: 0, b: 0, a: 0 }) {
        this.m_width = aWidth;
        this.m_plotstyle = aPlotStyle;
        this.m_color = aColor;
    }

    GetWidth() { return this.m_width; }
    SetWidth(aWidth) { this.m_width = aWidth; }
    GetPlotStyle() { return this.m_plotstyle; }
    SetPlotStyle(aPlotStyle) { this.m_plotstyle = aPlotStyle; }
    GetColor() { return this.m_color; }
    SetColor(aColor) { this.m_color = aColor; }
}

export default STROKE;