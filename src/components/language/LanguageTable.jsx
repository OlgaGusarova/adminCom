import React from 'react';
import ReactModal from 'react-modal';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import JqxGrid  from '../../jqwidgets-react/react_jqxgrid';
import deleteLanguage from '../../restFullRequest/language/deleteLanguage';
import store from '../../redux/Store';

const customStyles = {
  content : {
    top                   : '30%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class LanguageTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idLanguageToDel: '',
      modalIsOpen: false,
    };
    this.removeLanguage = this.removeLanguage.bind(this);
    this.closeModalToDelete = this.closeModalToDelete.bind(this);
  }

  componentDidMount() {
    this.refs.Grid.on('cellclick', (event) => {
      if (event.args.column.datafield === 'idToDelete') {
        this.setState({modalIsOpen: true, idLanguageToDel: event.args.row.bounddata.id_language});
      }
    });
    this.refs.Grid.on('bindingcomplete', (event) => {
      let head = document.getElementById('columntable' + event.target.id);
      if(head !== undefined) {
        if (head.previousElementSibling !== null) {
          head.previousElementSibling.remove();
        }
      }
    });
  }

  removeLanguage() {
    this.setState({modalIsOpen: false});
    deleteLanguage(this.state.idLanguageToDel);
  }

  closeModalToDelete() {
    this.setState({modalIsOpen: false});
  }

  render() {
    if (this.props.toUpdateLanguageTable) {
      this.refs.Grid.updatebounddata();
      store.dispatch({
        type: 'NO_UPDATE_LANGUAGE_TABLE'
      });
    }

    var dataUrl = 'http://api.rumex.com/api/languages';
    let source =
      {
        url: dataUrl,
        datafields:
          [
            {name: 'id_language', map: 'id', type: 'string'},
            {name: 'code', type:'string'},
            {name: 'is_default', type: 'bool'},
            {name: 'idToDelete', map: 'id', type: 'string'}
          ],
        datatype: "json",
        pager: (pagenum, pagesize, oldpagenum) => {
          // callback called when a page or page size is changed.
        },
        updaterow: (rowid, rowdata, commit) => {
          commit(true);
        }
      };

    let dataAdapter = new window.JQXLite.jqx.dataAdapter(source);

    let iconEdit = function (row, datafield, value) {
      return '<a href="/language/update/' + value + '"><span class="fa fa-pencil fa-lg"></span></a>';
    };
    let iconRemove = function (row, datafield, value) {
      return '<a href="#" class="fa fa-trash fa-lg" value=' + value + '></a>';
    };

    let columns =
      [
        {text: ' ', datafield: 'id_language', cellsrenderer: iconEdit, width: 31},
        {text: 'Код', datafield: 'code'},
        {text: 'По умолчанию', datafield: 'defaultlanguage', columntype: 'checkbox', filtertype: 'bool', width: 125},
        {text: ' ', datafield: 'idToDelete', cellsrenderer: iconRemove, width: 36}
      ];

    return (
      <div>
        <ReactModal isOpen={this.state.modalIsOpen}
                    style={customStyles}
                    closeTimeoutMS={300}
                    contentLabel="Modal">

          <h2>Удалить язык?</h2>
          <button className="btn btn-danger" onClick={this.removeLanguage}>Да</button>
          <button className="btn btn-success" onClick={this.closeModalToDelete}>Нет</button>

        </ReactModal>
        <div className="box-header">
          <h3 className="box-title">Языки</h3>
        </div>
        <a className="btn btn-warning btn-create" href="/language/create"><i className="fa fa-plus-square fa-lg"></i> Добавить язык</a>

        <div id='jqxWidget' style={{float: 'left', width: '100%'}}>
          <JqxGrid ref='Grid'
                   width={'100%'} source={dataAdapter} filterable={true} sortable={true} showfilterrow={true} autoshowfiltericon={true} theme={'bootstrap'}
                   autoheight={true} pageable={true} pagesize={25} columns={columns} columnsresize={true} columnsreorder={true} selectionmode={'singlerow'}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = function (store) {
  return {
    toUpdateLanguageTable : store['languageReducer'].toUpdateLanguageTable,
  }
};

export default withRouter(connect(mapStateToProps)(LanguageTable));