
import aReader from './libs/aReader';
import convert_to_biu from './libs/convert_to_biu';
import tokens from './libs/tokens';
import Symbol from './libs/symbol';
import Field from './libs/field';

let m_libType = undefined;
let m_versionMinor;
let m_versionMajor;
const MANDATORY_FIELDS = 4;

async function Load(librarieFile) {

    aReader.openFile(librarieFile);

    let line = aReader.Line();
    if (!line.startsWith("EESchema-LIBRARY Version")) {
        throw Error("file is not a valid symbol or symbol library file");
    }

    line = line.replace("EESchema-LIBRARY Version", "").trim();

    m_versionMajor = parseInt(line);

    line = line.replace(m_versionMajor, '');

    if (!line.startsWith('.')) {
        throw Error("invalid file version formatting in header");
    }

    line = line.replace('.', '');

    m_versionMinor = parseInt(line);

    if (m_versionMajor < 1 || m_versionMinor < 0 || m_versionMinor > 99) {
        throw Error("invalid file version in header");
    }

    while (aReader.linesRemaining() > 0) {
        line = aReader.Line().trim();

        if (line.startsWith('#') || line == '') {      // Skip comments and blank lines.
            continue;
        }

        if (line.startsWith('DEF')) {
            // Read one DEF/ENDDEF symbol entry from library:
            try {
                aReader.rewind();
                let symbol = await LoadPart(aReader, m_versionMajor, m_versionMinor);
            } catch (err) {
                throw Error(err);
            }
        }
    }
}

async function LoadPart(aReader, aMajorVersion, aMinorVersion, aMap) {

    let line = aReader.Line().trim();

    while (line.startsWith('#')) {
        line = aReader.Line().trim();
    }

    if (!line.startsWith('DEF')) {
        throw Error("invalid symbol definition");
    }

    line = line.replace('DEF', '').trim();

    let num;
    let pos = 4;

    tokens.generateTokens(line);
    if (tokens.length() < 8) {
        throw Error("invalid symbol definition");
    }

    // Read DEF line:
    let name = tokens.GetNextToken();
    let prefix = tokens.GetNextToken();
    let tmp = tokens.GetNextToken();
    tmp = tokens.GetNextToken();

    if (!parseInt(tmp)) {
        throw Error("invalid pin offset");
    }

    let symbol = new Symbol();

    symbol.SetPinNameOffset(convert_to_biu.Mils2iu(parseInt(tmp)));

    tmp = tokens.GetNextToken();

    if (!(tmp == "Y" || tmp == "N")) {
        throw Error("expected Y or N");
    }

    symbol.SetShowPinNumbers((tmp == "Y") ? true : false);

    tmp = tokens.GetNextToken();

    if (!(tmp == "Y" || tmp == "N")) {
        throw Error("expected Y or N");
    }

    symbol.SetShowPinNames((tmp == "Y") ? true : false);

    tmp = tokens.GetNextToken();
    if (!parseInt(tmp)) {
        throw Error("invalid unit count");
    }

    symbol.SetUnitCount(parseInt(tmp));

    // Ensure m_unitCount is >= 1.  Could be read as 0 in old libraries.
    if (symbol.GetUnitCount() < 1) {
        symbol.SetUnitCount(1);
    }

    // Copy symbol name and prefix.

    // The root alias is added to the alias list by SetName() which is called by SetText().
    if (name == '') {
        symbol.SetName("~");
    } else if (!name.startsWith('~')) {
        symbol.SetName(name);
    } else {
        symbol.SetName(name.replace('~'));
        symbol.GetValueField().SetVisible(false);
    }

    // Don't set the library alias, this is determined by the symbol library table.
    symbol.SetLibId(symbol.GetName());
    let reference = symbol.GetReferenceField();

    if (prefix.startsWith('~')) {
        reference.Empty();
        reference.SetVisible(false);
    } else {
        reference.SetText(prefix);
    }

    // In version 2.2 and earlier, this parameter was a '0' which was just a place holder.
    // The was no concept of interchangeable multiple unit symbols.
    if (((aMajorVersion > 0) && (aMinorVersion > 0)) && ((aMajorVersion <= 2) && (aMinorVersion <= 2))) {
        throw Error("not supported at this time");
    } else {
        tmp = tokens.GetNextToken();

        if (tmp == "L") {
            symbol.LockUnits(true);
        } else if (tmp == "F" || tmp == "0") {
            symbol.LockUnits(false);
        } else {
            throw Error("expected L, F, or 0");
        }
    }

    // There is the optional power symbol flag.
    if (tokens.HasMoreTokens()) {
        tmp = tokens.GetNextToken();
        if (tmp == "P") {
            symbol.SetPower();
        } else if (tmp == "N") {
            symbol.SetNormal();
        } else {
            throw Error("expected P or N");
        }
    }

    line = aReader.Line().trim();

    // Read lines until "ENDDEF" is found.
    while (aReader.linesRemaining()) {
        if (line.startsWith('#')) {
        } else if (line.startsWith('Ti')) { // Modification date is ignored.
        } else if (line.startsWith('ALIAS')) { // Aliases
        } else if (line.startsWith('F')) { // Fields
            loadField(symbol, aReader);
        } else if (line.startsWith('DRAW')) { // Drawing objects.
            loadDrawEntries(symbol, aReader, aMajorVersion, aMinorVersion);
        } else if (line.startsWith('$FPLIST')) { // Footprint filter list
        } else if (line.startsWith('ENDDEF')) { // End of symbol description
            return symbol;
        }
        line = aReader.Line().trim();
    }

    throw Error("missing ENDDEF");
}

function loadField(aSymbol, aReader) {
    aReader.rewind();
    let line = aReader.Line();

    if (!line.startsWith('F')) {
        throw Error("Invalid field line");
    }

    line = line.replace('F', '');
    let id = parseInt(line.split(' ')[0]);
    if (id && id < 0) {
        throw Error("Invalid field ID");
    }

    let field;
    if (id >= 0 && id < MANDATORY_FIELDS) {
        field = aSymbol.GetFieldById(id);
    } else {
        field = new Field("", id);
        aSymbol.AddField(field);
    }

    // Skip to the first double quote.
    line = line.replace(id, '').trim().replace('"', '');

    if (line.length == 0) {
        throw Error("unexpected end of line");
    }

    let text = line.split('"')[0];
    // Doctor the *.lib file field which has a "~" in blank fields.  New saves will
    // not save like this.

    if (text.length == 1 && text[0] == '~') {
        field.SetText("");
    } else {
        field.SetText(text);
    }

    line = line.replace(text + '"', '').trim();

    let x = parseInt(line.split(' ')[0]);
    line = line.trim().replace(x, '').trim();
    let y = parseInt(line.split(' ')[0]);
    line = line.trim().replace(y, '').trim();
    field.SetPosition({ x, y });

    x = y = convert_to_biu.Mils2iu(parseInt(line.split(' ')[0].trim()));
    field.SetTextSize({ x, y });

    line = line.trim().replace(x, '').trim();

    let textOrient = line.split(' ')[0].trim();
    line = line.trim().replace(textOrient, '').trim();

    if (textOrient == 'H') {
        field.SetTextAngle(0);
    } else if (textOrient == 'V') {
        field.SetTextAngle(90);
    } else {
        throw Error("invalid field text orientation parameter");
    }

    let textVisible = line.split(' ')[0].trim();
    line = line.trim().replace(textVisible, '').trim();

    if (textVisible == 'V') {
        field.SetVisible(true);
    } else if (textVisible == 'I') {
        field.SetVisible(false);
    } else {
        throw Error("invalid field text visibility parameter");
    }

    // It may be technically correct to use the library version to determine if the field text
    // attributes are present.  If anyone knows if that is valid and what version that would be,
    // please change this to test the library version rather than an EOL or the quoted string
    // of the field name.
    if (line.trim().length != 0 && line != '"') {
        let textHJustify = line[0];
        line = line.trim().replace(textHJustify, '').trim();

        if (textHJustify == 'C') {
            field.SetHorizJustify(textHJustify)
        } else if (textHJustify == 'L') {
            field.SetHorizJustify(textHJustify)
        } else if (textHJustify == 'R') {
            field.SetHorizJustify(textHJustify)
        } else {
            throw Error("invalid field text horizontal justification");
        }

        let attributes = line.split(' ')[0].trim();
        line = line.trim().replace(attributes, '').trim();

        if (!(attributes.length == 3 || attributes.length == 1)) {
            throw Error("invalid field text attributes size");
        }

        switch (attributes[0]) {
            case 'C': field.SetVertJustify('C'); break;
            case 'B': field.SetVertJustify('B'); break;
            case 'T': field.SetVertJustify('T'); break;
            default: throw Error("invalid field text vertical  justification");
        }

        if (attributes.length == 3) {
            let attr_1 = attributes[1];
            let attr_2 = attributes[2];

            if (attr_1 == 'I')        // Italic
                field.SetItalic(true);
            else if (attr_1 != 'N')   // No italics is default, check for error.
                throw Error("invalid field text italic parameter");

            if (attr_2 == 'B')       // Bold
                field.SetBold(true);
            else if (attr_2 != 'N')   // No bold is default, check for error.
                throw Error("invalid field text bold parameter");

        }
    }

    // Fields in RAM must always have names.
    if (id >= 0 && id < MANDATORY_FIELDS) {
        // Fields in RAM must always have names, because we are trying to get
        // less dependent on field ids and more dependent on names.
        // Plus assumptions are made in the field editors.
        //field.name =  GetDefaultFieldName(id);

        // Ensure the VALUE field = the symbol name (can be not the case
        // with malformed libraries: edited by hand, or converted from other tools)
        if (id == 1)
            field.SetText(aSymbol.GetName());
    }
    else {
        line = line.trim().replace('"', '').replace('"', '').trim();
        field.SetName(line);
    }

}

function loadDrawEntries(aSymbol, aReader, aMajorVersion, aMinorVersion) {
    aReader.rewind();
    let line = aReader.Line();

    if (!line.startsWith('DRAW')) {
        throw Error("Invalid DRAW line");
    }

    line = aReader.Line();

    while (line.length) {
        if (line.startsWith('ENDDRAW')) {
            return;
        }

        switch (line[0]) {
            case 'A':   // Arc
                break;
            case 'C':   // Circle
                break;
            case 'T':   // Text
                break;
            case 'S':   // Square
                break;
            case 'X':   // Pin Description
                aSymbol.AddDrawItem(loadPin(aSymbol , aReader));
                break;
            case 'P':    // Polyline
                break;
            case 'B':    // Bezier Curves
                break;
            case '#':    // Comment
            case '\n':   // Empty line
            case '\r':
            case 0:
                break;

            default:
                throw Error("undefined DRAW entry");

        }
        line = aReader.Line();
    }
    throw Error("File ended prematurely loading symbol draw element.");
}


function loadPin(aSymbol , aReader ){
    aReader.rewind();
    let line = aReader.Line();
    if (!line.startsWith('X')) {
        
    }throw Error("Invalid LIB_PIN definition");
}

export default {
    Load,
    LoadPart
}