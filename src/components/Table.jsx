import React from 'react';
import JqxGrid from '../jqwidgets-react/react_jqxgrid.js';


class Table extends React.Component {
  render () {
    //var data = [{ "empName": "test", "age": "67", "department": { "id": "1234", "name": "Sales" }, "author": "ravi"}];
    var url = './src/components/sampledata/prodData.txt';
    let source =
      {
        datatype: "json",
        datafields: [
          { name: 'empName', type: 'string' },
          { name: 'name', map:'department>name', type: 'string' },
          { name: 'age', type: 'number' },
          { name: 'author', type: 'string' }
        ],
        url: url
      };

    let dataAdapter = new window.JQXLite.jqx.dataAdapter(source);

    let columns =
      [
        { text: 'Артикул', datafield: 'empName', width: 250 },
        { text: 'Имя', datafield: 'name', cellsalign: 'right', align: 'right', width: 200 },
        { text: 'Цена', datafield: 'age', align: 'right', cellsalign: 'right', width: 200 },
        { text: 'Префикс', datafield: 'author', cellsalign: 'right', width: 100 }
      ];

    return (
      <JqxGrid width={850} source={dataAdapter} pageable={true}
               sortable={true} altrows={true} enabletooltips={true}
               autoheight={true} editable={true} columns={columns}
               selectionmode={'multiplecellsadvanced'}
      />
    );
  }
}

export default Table;