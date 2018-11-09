import jsPDF from 'jspdf'
import 'jspdf-autotable';
import 'jspdf-customfonts';

import robotoFont from './roboto_regular';


const saveBOM = ( file ) => {

    let bom = file.components;
    var pdf = new jsPDF('p' , 'pt');
    pdf.addFileToVFS(robotoFont.name, robotoFont.font );
    pdf.addFont(robotoFont.name, "roboto", "normal");

    pdf.setFont("roboto");
    let imgData = 'data:image/png;base64,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'


    // Returns a new array each time to avoid pointer issues
    function _getColumns () {
        return [
            {title: "Refs", dataKey: "ref"},
            {title: "Valeurs", dataKey: "value"},
            {title: "Quantité", dataKey: "qty"},
            {title: "mfr. num", dataKey: "mfrnum"},
            {title: "Prix Unit.", dataKey: "price"},
            {title: "Prix Tot.", dataKey: "priceTot"}
        ];
    };

    let lineOffset = 30;
    let TotalParts = 0;
    let TotalUniqueParts = 0;
    let rows = [];

    for ( let key in bom )
    {
        let row = [];
        row.push(key);
        rows.push(row);

        bom[key].map(( comp ) => {
            TotalUniqueParts++;

            if ( comp.unitPrice == undefined)
                comp.unitPrice = "";
            
            let c = {};

            c.ref = comp.refs.join(', ');
            c.value = comp.val;
            c.qty = comp.nbRefs;
            TotalParts += comp.nbRefs;
            c.mfrnum = comp.mfrnum;
            c.price = comp.unitPrice;
            c.priceTot = comp.totalPrice;
            rows.push(c);
        });
        
    }

        
    function _pushText(str , offsetX , offsetY ){
        if ( offsetX == undefined)
            offsetX = 30;
        if ( offsetY == undefined )
            offsetY = 0;
        pdf.text( str , offsetX , lineOffset + offsetY);
        //lineOffset += pdf.getLineHeight();
    }

    function _addLine()
    {
        lineOffset += pdf.getLineHeight();
    }

    pdf.setFontSize(24);    
    pdf.setFontStyle('bold');
    _addLine();
    _pushText(file.project);
    pdf.addImage(imgData, 'PNG', 400, lineOffset / 2 + 5 , 181/2, 71/2);
    _addLine();
    _addLine();
    pdf.setFontSize(10);    
    pdf.setFontStyle('bold');
    _pushText("DATE");
    _pushText("COMPANY" , 230);
    
    _addLine();

    pdf.setFontStyle('normal');
    _pushText( new Date().toLocaleDateString() , 40 );

    _addLine();
    _addLine();
    _addLine();
    pdf.setFontStyle('bold');
    _pushText("COMMENT");
    _pushText("TOTAL PARTS" , 230);
    _addLine();
    pdf.setFontStyle('normal');

    _pushText(TotalParts + " ( unique " +  TotalUniqueParts + " )", 240);

    _addLine();
    _addLine();

    pdf.autoTable(_getColumns(), rows , {
      //  theme: 'grid',
        styles: {
            font: "roboto",
        },
        showHeader :'firstPage',
        margin: {top: 10 , left : 30 , right : 30 },
        startY : lineOffset,
        drawRow: function (row, data) {
            pdf.setFontStyle('bold');
            pdf.setFontSize(10);

            if ( row.raw.length == 1 ){
                // Colspan
                pdf.setTextColor(200, 0, 0);
                //pdf.rect(data.settings.margin.left, row.y, data.table.width, 20, 'S');
                pdf.autoTableText(row.raw[0], data.settings.margin.left , row.y + (row.height/2), {
                    halign: 'left',
                    valign: 'middle',
                });
                data.cursor.y += row.height;
                return false;
            }
        },
        drawCell: function (cell, data) {

        }
    });

    pdf.save('Test.pdf');

}





export default {
    saveBOM,
}