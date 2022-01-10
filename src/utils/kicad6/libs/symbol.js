import Field from './field';

const ENTRY_NORMAL = 0;
const ENTRY_POWER = 1;

class Symbol {
    constructor() {
        this.fields = [];
        this.fields.push(new Field('reference', 0));
        this.fields.push(new Field('value', 1));
        this.fields.push(new Field('footprint', 2));
        this.fields.push(new Field('datasheet', 3));
        this.m_drawings = [];
        this.m_includeInBom = true;
        this.m_includeOnBoard = true;
    }

    /**
     * Set the offset in mils of the pin name text from the pin symbol.
     *
     * Set the offset to 0 to draw the pin name above the pin symbol.
     *
     * @param aOffset - The offset in mils.
     */

    SetPinNameOffset(aOffset) {
        this.m_pinNameOffset = aOffset;
    }
    GetPinNameOffset() {
        return this.m_pinNameOffset;
    }


    ShowPinNames() {
        return this.m_pinNameOffset;
    }

    /**
     * Set or clear the pin number visibility flag.
     *
     * @param aShow - True to make the symbol pin numbers visible.
     */
    SetShowPinNumbers(aShow) {
        this.m_showPinNumbers = aShow;
    }
    ShowPinNumbers() {
        return this.m_showPinNumbers;
    }

    /**
     * Set or clear the pin name visibility flag.
     *
     * @param aShow - True to make the symbol pin names visible.
     */

    SetShowPinNames(aShow) {
        this.m_showPinNames = aShow;
    }
    ShowPinNames() {
        return this.m_showPinNames;
    }

    /**
     * Set the units per symbol count.
     *
     * If the count is greater than the current count, then the all of the
     * current draw items are duplicated for each additional symbol.  If the
     * count is less than the current count, all draw objects for units
     * greater that count are removed from the symbol.
     *
     * @param aCount - Number of units per package.
     * @param aDuplicateDrawItems Create duplicate draw items of unit 1 for each additionl unit.
     */
    SetUnitCount(aCount, aDuplicateDrawItems = true) {
        if (this.m_unitCount == aCount) {
            return;
        }

        if (aCount < this.m_unitCount) {

        } else if (aDuplicateDrawItems) {

        }

        this.m_unitCount = aCount;
    }

    GetUnitCount() {
        return this.m_unitCount;
    }

    SetName(aName) {
        this.m_name = aName;
    }
    GetName() {
        return this.m_name;
    }

    GetValueField() {
        return this.fields.find((f) => f.name == 'value');
    }
    GetReferenceField() {
        return this.fields.find((f) => f.name == 'reference');
    }

    GetLibId() { return this.m_libId; }
    SetLibId(aLibId) { this.m_libId = aLibId; }

    /**
       * Set interchangeable the property for symbol units.
       * @param aLockUnits when true then units are set as not interchangeable.
       */
    LockUnits(aLockUnits) { this.m_unitsLocked = aLockUnits; }

    /**
     * Check whether symbol units are interchangeable.
     * @return False when interchangeable, true otherwise.
     */
    UnitsLocked() { return this.m_unitsLocked; }

    SetPower() {
        this.m_options = ENTRY_POWER;
    }
    SetNormal() {
        this.m_options = ENTRY_NORMAL;
    }
    IsPower() {
        return this.m_options == ENTRY_POWER;
    }

    GetFieldById(aId) {
        return this.fields.find((f) => f.id == aId);
    }

    AddField(field) {
        this.fields.push(field);
    }

    AddDrawItem(item) {
        this.m_drawings.push(item);
    }

    SetIncludeInBom(aIncludeInBom) { this.m_includeInBom = aIncludeInBom; }
    GetIncludeInBom() { return this.m_includeInBom; }
    SetIncludeOnBoard(aIncludeOnBoard) { this.m_includeOnBoard = aIncludeOnBoard; }
    GetIncludeOnBoard() { return this.m_includeOnBoard; }
    GetNextAvailableFieldId() {
        return this.fields.length - 4;
    }
    GetUnitDrawItems(aUnit, aConvert) {
        if (aUnit != undefined && aConvert != undefined) {
            let unitItems = [];
            for (let item of this.m_drawings) {
                if (item.Type() == 'LIB_FIELD_T') {
                    continue;
                }

                if (((aConvert == -1) && (item.GetUnit() == aUnit)) || (aUnit == -1 && item.GetConvert() == aConvert) || ((aUnit == item.GetUnit()) && (aConvert == item.GetConvert()))) {
                    unitItems.push(item);
                }
            }
            return unitItems;
        } else {
            let units = [];
            for (let item of this.m_drawings) {
                if (item.Type() == 'LIB_FIELD_T') {
                    continue;
                }

                let unit = item.GetUnit();
                let convert = item.GetConvert();

                let it = units.find((a) => { return (a.m_unit == unit && a.m_convert == convert); });

                if (it == undefined) {
                    let newUnit = {
                        m_unit: item.GetUnit(),
                        m_convert: item.GetConvert(),
                        m_items: []
                    }
                    newUnit.m_items.push(item);
                    units.push(newUnit);
                } else {
                    it.m_items.push(item);
                }
            }
            return units;
        }
    }
}

export default Symbol