import convert_to_biu from './libs/convert_to_biu';

let formatter = [];

function getPinAngle(aOrientation) {
    switch (aOrientation) {
        case 'R': return 0.0;
        case 'L': return 180.0;
        case 'U': return 90.0;
        case 'D': return 270.0;
        default:
            return 0.0;
    }
}


async function saveField(aField) {
    let line = [];
    let lines = [];
    if (aField == undefined) {
        throw Error("Invalid LIB_FIELD object.");
    }

    let fieldName = aField.GetName();
    if ((aField.GetId() >= 0) && (aField.GetId() < 4)) {
        fieldName = aField.GetName();
    }

    line.push("(property ");
    line.push('"');
    line.push(fieldName);
    line.push('" ');
    line.push('"');
    line.push(aField.GetText());
    line.push('" ');
    line.push("(id ");
    line.push(aField.GetId())
    line.push(') ');
    line.push("(at ");
    line.push(aField.GetPosition().x / 25.4);
    line.push(' ');
    line.push(aField.GetPosition().y / 25.4);
    line.push(' ');
    line.push(aField.GetTextAngle() / 10);
    line.push(')');

    lines.push(line.join(''));

    lines.push(')');
    return lines
}

async function savePin(aPin) {
    if (aPin.Type() != 'LIB_PIN_T') {
        throw Error("Invalid LIB_PIN object.");
    }

    let lines = [];

    let line = "(pin ";
    line += aPin.GetType();
    line += " ";
    line += aPin.GetShape();
    line += " (at ";
    line += aPin.GetPosition().x / 25.4;
    line += " ";
    line += aPin.GetPosition().y / 25.4;
    line += " ";
    line += (getPinAngle(aPin.GetOrientation()));
    line += ") ";
    line += "(length ";
    line += aPin.GetLength() / 25.4;
    line += ")";

    if (!aPin.IsVisible()) {
        line += " hide";
    }

    lines.push(line);

    // This follows the EDA_TEXT effects formatting for future expansion.
    line = "(name ";
    line += '"' + aPin.GetName() + '"';
    line += " (effects (font (size ";
    line += aPin.GetNameTextSize() / 25.4;
    line += " ";
    line += aPin.GetNameTextSize() / 25.4;
    line += "))))";

    lines.push(line);

    line = "(number ";
    line += '"' + aPin.GetNumber() + '"';
    line += " (effects (font (size ";
    line += aPin.GetNumberTextSize() / 25.4;
    line += " ";
    line += aPin.GetNumberTextSize() / 25.4;
    line += "))))";

    lines.push(line);

    if (aPin.GetAlternates()) {
        for (let alt of aPin.GetAlternates()) {
            line = "(alternate ";
            line += '"' + alt.second.m_Name + '"';
            line += " ";
            line += alt.second.m_Type;
            line += " ";
            line += alt.second.m_Shape;
            line += ")";
            lines.push(line);
        }
    }

    lines.push(')');

    return lines;
}

async function saveText(aText){
    if (aPin.Type() != 'LIB_TEXT_T') {
        throw Error("Invalid LIB_TEXT object.");
    }

    let lines = [];

    let line = "(text ";
    line += '"'+aText.GetText()+'"';
    line += " (at ";
    line += aText.GetPosition().x / 25.4;
    line += " ";
    line += aText.GetPosition().y / 25.4;
    line += " ";
    line += aText.GetTextAngle();
    line += ")";
    lines.push(line);
    return lines;
}

async function saveSymbolDrawItem(aItem) {
    let lines = [];
    switch (aItem.Type()) {
        case 'LIB_SHAPE_T':
            let shape = aItem;
            let fillMode = shape.GetFillMode();
            let stroke;

            
            break;
        case 'LIB_PIN_T':
            lines = await savePin(aItem);
            break;
        case 'LIB_TEXT_T':
            lines = await saveText(aItem);
            break;

    }
    return lines;
}

async function SaveSymbol(aSymbol) {
    let line = [];
    let lines = [];
    if (aSymbol == undefined) {
        throw Error("Invalid LIB_SYMBOL pointer.");
    }

    line.push("(symbol " + '"' + aSymbol.GetName() + '"');

    if (aSymbol.IsPower()) {
        line.push(" (power)");
    }

    if (aSymbol.ShowPinNumbers() == false) {
        line.push(" (pin_numbers hide)");
    }

    if ((aSymbol.GetPinNameOffset() != convert_to_biu.Mils2iu(20)) || !aSymbol.ShowPinNames()) {
        line.push(" (pin_names");
        if (aSymbol.GetPinNameOffset() != convert_to_biu.Mils2iu(20)) {
            line.push(" (offset " + (aSymbol.GetPinNameOffset() / 25.4) + ")");
        }
        if (!aSymbol.ShowPinNames()) {
            line.push(" hide");
        }
        line.push(")");
    }

    line.push(" (in_bom " + (aSymbol.GetIncludeInBom() ? "yes" : "no") + ")");
    line.push(" (on_board " + (aSymbol.GetIncludeOnBoard() ? "yes" : "no") + ")");

    lines.push(line.join(''));

    let fields = aSymbol.fields;
    for (let field of fields) {
        let _l = await saveField(field);
        lines.push(..._l);
    }

    if (aSymbol.UnitsLocked()) {
        name = u
    }

    let units = aSymbol.GetUnitDrawItems();

    for (let unit of units) {
        let name = aSymbol.GetName();

        lines.push('(symbol ' + name + '_' + unit.m_unit + '_' + unit.m_convert);

        let save_map = [];

        for (let item of unit.m_items) {
            save_map.push(item);
        }

        for (let item of save_map) {
            let _l = await saveSymbolDrawItem(item);
            lines.push(..._l);
        }

        lines.push(")");
    }

    lines.push(")");
    return lines;
}

async function Save(m_symbols) {
    let date_version = new Date();
    formatter = [];

    //  formatter.push("(kicad_symbol_lib (version " + date_version.getFullYear() + ("0" + (date_version.getMonth() + 1)).slice(-2) + ("0" + date_version.getDate()).slice(-2) + ") (generator kicad_symbol_editor)");

    formatter.push("(kicad_symbol_lib (version 20211014) (generator kicad_symbol_editor)");
    for (let symbol of m_symbols) {
        let _l = await SaveSymbol(symbol);
        formatter.push(..._l);
    }

    formatter.push(")");

    return formatter.join('\n');
}

export default {
    Save
}