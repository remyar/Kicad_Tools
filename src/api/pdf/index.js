import jsPDF from 'jspdf'
import 'jspdf-autotable';

import robotoFont from './roboto_regular';
import robotoBoldFont from './roboto_bold';
import kicadImg from './kicad_img';

function exportBom( bom ){
    return new Promise((resolve , reject) => {
        let pdf = new jsPDF('p' , 'pt');

        pdf.addFileToVFS(robotoFont.name, robotoFont.font );
        pdf.addFileToVFS(robotoBoldFont.name, robotoBoldFont.font );
        pdf.addFont(robotoFont.name, "roboto", "normal");
        pdf.addFont(robotoBoldFont.name, "roboto", "bold");
     
        pdf.setFont("roboto");
        // Returns a new array each time to avoid pointer issues
        function _getColumns () {
            return [
                {title: 'bom.Identification' , dataKey: "ref"},
                {title: 'bom.Value', dataKey: "value"},
                {title: 'bom.Quantity', dataKey: "qty"},
                {title: 'bom.MfrNum', dataKey: "mfrnum"},
                {title: 'bom.UnitPrice', dataKey: "price"},
                {title: 'bom.TotalPrice', dataKey: "priceTot"}
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
        //_pushText(file.project);
        pdf.addImage(kicadImg.img, 'PNG', 400, lineOffset / 2 + 5 , 181/2, 71/2);
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
    
            // let row = data.row;
    
                pdf.setFont("roboto");
                pdf.setFontStyle('bold');
                pdf.setFontSize(10);
    
                if ( row.raw.length > 0 ){
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
 
        pdf.save('Test.pdf', {returnPromise : true}).then((result)=>{
            resolve(result);
        }).catch((e)=>{
            reject({ message : e});
        });
        
    });
}

export default {
    exportBom,
}