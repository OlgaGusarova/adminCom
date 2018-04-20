import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import updateContent from '../../restFullRequest/content/updateContent';
import getContentDescriptInfo from '../../restFullRequest/content/getContentDescriptInfo';
import createContent from '../../restFullRequest/content/createContent';
import JqxGrid from '../../jqwidgets-react/react_jqxgrid';
import JqxButton from '../../jqwidgets-react/react_jqxbuttons.js';
import JqxNotification from '../../jqwidgets-react/react_jqxnotification.js';
import {localizationRu} from '../actions/localizationRu';
import {validate} from '../actions/validation';
import {saveGridTranslation} from '../actions/saveGridTranslation';

import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/js/languages/ru.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import * as $ from 'jquery';
import jQuery from 'jquery';
import 'font-awesome/css/font-awesome.css';
import FroalaEditor from 'react-froala-wysiwyg';

window["$"] = $;
window["jQuery"] = $;
window.jquery = jQuery;

const modalStyles = {
  content: {
    top: '30%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: '70%',
    transform: 'translate(-50%, -50%)'
  }
};

class ContentEditPage extends React.Component {
  constructor(props) {
    super(props);
    getContentDescriptInfo(this.props.match.params.id);
    this.state = {
      refnames: ['inner_name', 'active'],
      gridColumns: ['code', 'title', 'url', 'description', 'keywords', 'body'],
      modalIsOpen: false,
      selectedRow: '',
      rowData: {},
      openWindowSuccess: false,
      editorConfig: {language: 'ru'},
      editorValue: '',
      translateCode: '',
      active: false
    };
    this.checkboxChecked = this.checkboxChecked.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.createContent = this.createContent.bind(this);
    this.saveGridChanges = this.saveGridChanges.bind(this);
    this.closeModalToChange = this.closeModalToChange.bind(this);
  }

  componentDidMount() {
    this.refs.Grid.on('bindingcomplete', () => { // русифицировать фильтр в столбцах
      var localizationobj = localizationRu();
      this.refs.Grid.localizestrings(localizationobj);
    });
    this.refs.messageSuccess.on('close', () => {
      this.setState({openWindowSuccess: false});
    });
    this.refs.messageSuccess.on('open', () => {
      this.setState({openWindowSuccess: false});
    });
    this.refs.Grid.on('cellclick', (event) => {
      if (event.args.column.datafield === 'edit') {
        let selectedrowindex = event.args.row.boundindex;
        let rowData = this.refs.Grid.getrowdata(selectedrowindex);
        this.setState({
          modalIsOpen: true,
          translateCode: event.args.row.bounddata.code,
          selectedRow: selectedrowindex,
          rowData: rowData
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.contentIsSave !== nextProps.contentIsSave) {
      this.setState({openWindowSuccess: true});
      this.refs.messageSuccess.open();
    }
    this.state.refnames.forEach((field) => {
      if (this.refs[field].type === 'checkbox') {
        if (nextProps[field] !== this.refs[field].checked) {
          this.setState({[field]: nextProps[field]});
        }
      } else {
        if (nextProps[field] !== this.props[field]) {
          this.refs[field].value = nextProps[field];
        }
      }
    });
  }

  checkboxChecked(event){
    var name = event.target.name;
    this.setState({[name]: event.target.checked});
  }

  getFieldsData(){
    var fieldsData = {};
    this.state.refnames.forEach((fieldName) => {
      if (this.refs[fieldName].type!== 'checkbox') {
        fieldsData[fieldName] = this.refs[fieldName].value;
      } else {
        fieldsData[fieldName] = this.refs[fieldName].checked;
      }
    });
    return fieldsData;
  }

  getGridData(){
    var rowsQty = this.refs.Grid.getdatainformation().rowscount,
      gridData = [],
      langData = [];
    for (var i = 0; i < rowsQty; i++) {
      gridData.push(this.refs.Grid.getrowdata(i));
    }
    gridData.forEach((language) => {
      var gridRow = {};
      this.state.gridColumns.forEach((columnName) => {
        for (var propName in language) {
          if (columnName === propName) {
            gridRow[propName] = language[propName];
          }
        }
      });
      langData.push(gridRow);
    });
    return(langData);
  }

  saveChanges() {
    var fieldsData = this.getFieldsData(),
        languageGridData = this.getGridData(),
        validation = validate(languageGridData, this.refs.inner_name, this);
    if(validation) {
      fieldsData['id'] = this.props.match.params.id;
      fieldsData['translations'] = languageGridData;
      updateContent(this.props.match.params.id, JSON.stringify(fieldsData));
    }
  }

  createContent(){
    var fieldsData = this.getFieldsData(),
      languageGridData = this.getGridData(),
      validation = validate(languageGridData, this.refs.inner_name, this);
    if(validation) {
      fieldsData['translations'] = languageGridData;
      //createContent(JSON.stringify(fieldsData));
      console.log(fieldsData);
    }
  }

  saveGridChanges(){
    saveGridTranslation(this, this.state.selectedRow, this.state.gridColumns);
  }

  closeModalToChange(){
    this.setState({modalIsOpen: false});
  }

  render() {
    var dataUrl = 'http://api.rumex.com/api/contents/getTranslationsByID?id=' + this.props.match.params.id;

    let generaterow = (i) => { //объект для новой строки в таблице перевод
      let row = {};
      row['edit'] = '';
      row['code'] = '';
      row['title'] = '';
      row['url'] = '';
      row['description'] = '';
      row['keywords'] = '';
      row['body'] = '';
      return row;
    };

    let source =
      {
        url: dataUrl,
        datafields:
          [
            {name: 'edit', map: 'code', type: 'string'},
            {name: 'code', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'url', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'keywords', type: 'string'},
            {name: 'body', type: 'string'}
          ],
        datatype: "json",
        addrow: (rowid, rowdata, position, commit) => {
          commit(true);
        },
        deleterow: (rowid, commit) => {
          commit(true);
        },
        pager: (pagenum, pagesize, oldpagenum) => {
          // callback called when a page or page size is changed.
        },
        updaterow: (rowid, rowdata, commit) => {
          commit(true);
        }
      };

    let dataAdapter = new window.JQXLite.jqx.dataAdapter(source);

    let rendertoolbar = (toolbar) => { //кнопки добавления и удаления строк в таблице перевод
      let container = document.createElement('div');
      container.style.margin = '5px';

      let buttonContainerAdd = document.createElement('div');
      let buttonContainerDel = document.createElement('div');

      buttonContainerDel.style.marginLeft = '5px';

      container.appendChild(buttonContainerAdd);
      container.appendChild(buttonContainerDel);
      toolbar[0].appendChild(container);

      let addRowButton = ReactDOM.render(<JqxButton value='Добавить строку'
                                                    style={{float: 'left'}}/>, buttonContainerAdd);
      let deleteRowButton = ReactDOM.render(<JqxButton value='Удалить выбранную строку'
                                                       style={{float: 'left', marginLeft: 5}}/>, buttonContainerDel);

      addRowButton.on('click', () => {
        var datarow = generaterow();
        this.refs.Grid.addrow(null, datarow);
      });

      deleteRowButton.on('click', () => {
        let selectedrowindex = this.refs.Grid.getselectedrowindex();
        let rowscount = this.refs.Grid.getdatainformation().rowscount;
        if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
          let id = this.refs.Grid.getrowid(selectedrowindex);
          this.refs.Grid.deleterow(id);
        }
      });
    };

    let iconEdit = function (row, datafield, value) {
      return '<span style="cursor: pointer;" class="fa fa-pencil fa-lg" value=' + value + '></span>';
    };

    let columns =
      [
        {text: ' ', datafield: 'edit', cellsrenderer: iconEdit, width: 31},
        {text: 'Код', datafield: 'code'},
        {text: 'Название', datafield: 'title'},
        {text: 'URL', datafield: 'url'},
        {text: 'Мета описание', datafield: 'description'},
        {text: 'Ключевые слова', datafield: 'keywords'},
        {text: 'Описание', datafield: 'body'}
      ];

    return (
      <div>
        <ReactModal isOpen={this.state.modalIsOpen} style={modalStyles} contentLabel="Modal">
          <h4>Редактировать перевод</h4>
          <div className="col-md-12">
            <div className="form-group">
              <label className="col-sm-2" htmlFor="code">Код <span className='required'>*</span></label>
              <div className="field col-sm-10">
                <input type="text" label="code" className="form-control" defaultValue={this.state.rowData.code} ref="code"/>
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="form-group">
              <label className="col-sm-2" htmlFor="title">Название <span className='required'>*</span></label>
              <div className="field col-sm-10">
                <input type="text" label="title" className="form-control" defaultValue={this.state.rowData.title} ref="title"/>
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="form-group">
              <label className="col-sm-2" htmlFor="url">URL <span className='required'>*</span></label>
              <div className="field col-sm-10">
                <input type="text" label="url" className="form-control" defaultValue={this.state.rowData.url} ref="url"/>
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="form-group">
              <label className="col-sm-2" htmlFor="description">Мета описание <span className='required'>*</span></label>
              <div className="field col-sm-10">
                <textarea className="form-control" rows="2" defaultValue={this.state.rowData.description} ref="description"></textarea>
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="form-group">
              <label className="col-sm-2" htmlFor="keywords">Ключевые слова <span className='required'>*</span></label>
              <div className="field col-sm-10">
                <input type="text" label="keywords" className="form-control" defaultValue={this.state.rowData.keywords} ref="keywords"/>
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="form-group">
              <label className="col-sm-2" htmlFor="body">Описание <span className='required'>*</span></label>
              <div className="field col-sm-10">
                <FroalaEditor ref="body" model={this.state.rowData.body} config={this.state.editorConfig} tag='textarea'/>
              </div>
            </div>
          </div>
          <button className="btn btn-info" onClick={this.saveGridChanges}>Применить</button>
          <button className="btn btn-default" onClick={this.closeModalToChange}>Отмена</button>
        </ReactModal>
        <form>
          {(() => {
            if (Object.keys(this.props.fullData).length > 0) {
              return (
                <h4>Изменить контентную страницу</h4>
              )
            } else {
              return (
                <h4>Создать контентную страницу</h4>
              )
            }
          })()
          }
          <div className="col-md-12">
            <div className="form-group">
              <label className="col-sm-2" htmlFor="inner_name">Название <span className='required'>*</span></label>
              <div className="field col-sm-10">
                <input type="text" label="inner_name" className="form-control" defaultValue={this.props.inner_name} ref="inner_name"/>
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" ref="active" label="active" name="active"
                       checked={this.state.active}
                        onClick={this.checkboxChecked}/>
                Активный
              </label>
              <div className="clearfix"></div>
            </div>
            <div id='jqxWidget' style={{float: 'left', width: '100%'}}>
              <JqxGrid ref='Grid'
                       width={'100%'} source={dataAdapter} filterable={true} sortable={true} autoshowfiltericon={true}
                       theme={'bootstrap'} autoheight={true} pageable={true} pagesize={25}
                       columns={columns} columnsresize={true} columnsreorder={true} selectionmode={'singlerow'}
                       rendertoolbar={rendertoolbar} showtoolbar={true}
              />
            </div>
            {(() => {
              if (Object.keys(this.props.fullData).length > 0) {
                return (
                  <input type="button" value="Сохранить" className="btn btn-primary" onClick={this.saveChanges}
                         style={{marginTop: '25px'}} />
                )
              } else {
                return (
                  <input type="button" value="Создать" className="btn btn-success" onClick={this.createContent}
                         style={{marginTop: '25px'}} />
                )
              }
            })()
            }
          </div>
        </form>
        <JqxNotification ref='messageSuccess'
                         width={250} autoCloseDelay={3000} animationOpenDelay={800}
                         autoClose={true} autoOpen={false} position={'bottom-right'} template={'success'}>
          <div>Изменения сохранены.</div>
        </JqxNotification>
        <JqxNotification ref='messageError'
                         width={250} autoCloseDelay={30000} animationOpenDelay={800}
                         autoClose={true} autoOpen={false} position={'bottom-right'} template={'error'}>
          <div>Пожалуйста, заполните обязательное поле.</div>
        </JqxNotification>
        <JqxNotification ref='messageErrorFieldEmpty'
                         width={250} autoCloseDelay={30000} animationOpenDelay={800}
                         autoClose={true} autoOpen={false} position={'bottom-right'} template={'error'}>
          <div>Пожалуйста, заполните пустые поля в таблице.</div>
        </JqxNotification>
        <JqxNotification ref='messageErrorDublicate'
                         width={250} autoCloseDelay={30000} animationOpenDelay={800}
                         autoClose={true} autoOpen={false} position={'bottom-right'} template={'error'}>
          <div>Значение столбца КОД не должно повторяться.</div>
        </JqxNotification>
      </div>
    );
  }
}

const mapStateToProps = function (store) {
  return {
    fullData: store['contentReducer'].fullData,
    active: store['contentReducer'].active,
    contentIsSave: store['contentReducer'].contentIsSave,
    translations: store['contentReducer'].translations,
    inner_name: store['contentReducer'].inner_name,
    editedTranslations: store['contentReducer'].editedTranslations
  }
};

export default withRouter(connect(mapStateToProps)(ContentEditPage));