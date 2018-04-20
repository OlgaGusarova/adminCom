import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import classNames from 'classnames';

import updateLanguage from '../../restFullRequest/language/updateLanguage';
import getLanguageDescriptInfo from '../../restFullRequest/language/getLanguageDescriptInfo';
import createLanguage from '../../restFullRequest/language/createLanguage';
import {localizationRu} from '../actions/localizationRu';
import JqxGrid from '../../jqwidgets-react/react_jqxgrid';
import JqxButton from '../../jqwidgets-react/react_jqxbuttons.js';
import JqxNotification from '../../jqwidgets-react/react_jqxnotification.js';

class LanguageEditPage extends React.Component {
  constructor(props) {
    super(props);
    getLanguageDescriptInfo(this.props.match.params.id);
    this.state = {
      refnames: ['code', 'is_default', 'is_mini_site', 'mini_site_main_content_id'],
      gridColumns: ['code', 'translation', 'country_list_translation', 'category_button_translation', 'category_list_translation',
        'email_field_translation', 'site_field_translation', 'phone_field_translation', 'send_request_translation', 'by_distr_translation', 'download_catalog_translation', 'site_slogan'],
      is_mini_site: false,
      is_default: false,
      modalIsOpen: false,
      openWindowSuccess: false
    };
    this.checkboxChanged = this.checkboxChanged.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.validation = this.validation.bind(this);
    this.createLanguage = this.createLanguage.bind(this);
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
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.languageIsSave !== nextProps.languageIsSave) {
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

  static isChecked(value) {
    let checketValue;
    if (!value) {
      checketValue = false;
    } else {      
      checketValue = true;
    }
    return checketValue;
  }

  checkboxChanged(event) {
    var name = event.target.name;
    this.setState({[name]: event.target.checked});
  }

  getFieldsData(){
    var fieldsData = {};
    this.state.refnames.forEach((fieldName) => {
      if (this.refs[fieldName].type !== 'checkbox') {
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

  validation(langData){
    var validate = true,
        errors = [],
        codeArr = [],
        codeObj = {},
        codeValue = this.refs.code.value;
    langData.forEach((language) => {
      for (var propName in language){
        if(language[propName] === ''){  //проверяем на пустые поля в таблице перевода
          errors.push(propName);
        }
        if (propName === 'code'){
          codeArr.push(language['code']);
        }
      }
    });
    if(errors.length !== 0){
      this.refs.messageErrorFieldEmpty.open(); //warning message
      validate = false;
    }
    codeArr.forEach((codeName) => {
      codeObj[codeName] = true;
    });
    if (langData.length !== Object.keys(codeObj).length){
      this.refs.messageErrorDublicate.open(); //warning message
      validate = false;
    }
    if(codeValue !== ''){
      this.refs.code.className = 'form-control';
    } else {
      this.refs.code.className = 'form-control danger';
      this.refs.messageError.open(); //warning message
      validate = false;
    }
    return validate;
  }

  saveChanges() {
    var fieldsData = this.getFieldsData(),
        languageGridData = this.getGridData(),
        validation = this.validation(languageGridData);
    if(validation) {
      fieldsData['id'] = this.props.match.params.id;
      fieldsData['translations'] = languageGridData;
      updateLanguage(this.props.match.params.id, JSON.stringify(fieldsData));
    }
  }

  createLanguage(){
    var fieldsData = this.getFieldsData(),
      languageGridData = this.getGridData(),
      validation = this.validation(languageGridData);
    if(validation) {
      fieldsData['translations'] = languageGridData;
      createLanguage(JSON.stringify(fieldsData));
    }
  }

  render() {
    var dataUrl = 'http://api.rumex.com/api/languages/getTranslationsByID?id=' + this.props.match.params.id;

    let generaterow = (i) => { //объект для новой строки в таблице перевод
      let row = {};
      row['code'] = '';
      row['translation'] = '';
      row['country_list_translation'] = '';
      row['category_button_translation'] = '';
      row['category_list_translation'] = '';
      row['email_field_translation'] = '';
      row['site_field_translation'] = '';
      row['phone_field_translation'] = '';
      row['send_request_translation'] = '';
      row['by_distr_translation'] = '';
      row['download_catalog_translation'] = '';
      row['site_slogan'] = '';
      return row;
    };

    let source =
      {
        url: dataUrl,
        datafields:
          [
            {name: 'code', type: 'string'},
            {name: 'translation', type: 'string'},
            {name: 'country_list_translation', type: 'string'},
            {name: 'category_button_translation', type: 'string'},
            {name: 'category_list_translation', type: 'string'},
            {name: 'email_field_translation', type: 'string'},
            {name: 'site_field_translation', type: 'string'},
            {name: 'phone_field_translation', type: 'string'},
            {name: 'send_request_translation', type: 'string'},
            {name: 'by_distr_translation', type: 'string'},
            {name: 'download_catalog_translation', type: 'string'},
            {name: 'site_slogan', type: 'string'}
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

    let columns =
      [
        {text: 'Код', datafield: 'code'},
        {text: 'Название', datafield: 'translation'},
        {text: 'Страны', datafield: 'country_list_translation'},
        {text: 'Кнопка категории', datafield: 'category_button_translation'},
        {text: 'Список категорий', datafield: 'category_list_translation'},
        {text: 'Поле email', datafield: 'email_field_translation'},
        {text: 'Поле сайт', datafield: 'site_field_translation'},
        {text: 'Поле телефон', datafield: 'phone_field_translation'},
        {text: 'Отправить запрос', datafield: 'send_request_translation'},
        {text: 'Дистрибьюторы', datafield: 'by_distr_translation'},
        {text: 'Скачать каталог', datafield: 'download_catalog_translation'},
        {text: 'Слоган', datafield: 'site_slogan', width: 180}

      ];
    var miniSiteClass = classNames({
      'miniContentDisplay': this.state.is_mini_site,
      'miniContentClose': !this.state.is_mini_site
    });
    return (
      <div>
        <form>
          {(() => {
            if (Object.keys(this.props.fullData).length > 0) {
              return (
                <h4>Изменить язык</h4>
              )
            } else {
              return (
                <h4>Создать язык</h4>
              )
            }
          })()
          }
          <div className="col-md-12">
            <div className="form-group">
              <label className="col-sm-2" htmlFor="code">Код <span className='required'>*</span></label>
              <div className="field col-sm-10">
                <input type="text" label="code" className="form-control" defaultValue={this.props.code} ref="code"/>
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" ref="is_default" label="is_default" name="is_default"
                       defaultValue={LanguageEditPage.isChecked(this.props.is_default)}
                       checked={this.state.is_default}
                       onClick={this.checkboxChanged}/>
                По умолчанию
              </label>
              <div className="clearfix"></div>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" ref="is_mini_site" label="is_mini_site" name="is_mini_site"
                       defaultValue={LanguageEditPage.isChecked(this.props.is_mini_site)}
                       checked={this.state.is_mini_site}
                       onClick={this.checkboxChanged}/>
                Мини-сайт
              </label>
              <div className="clearfix"></div>
              <div className={miniSiteClass}>
                <label className="col-sm-2" htmlFor="mini_site_main_content_id">ID главной страницы</label>
                <div className="field col-sm-10">
                  <input type="text" label="mini_site_main_content_id" className="form-control"
                         defaultValue={this.props.mini_site_main_content_id} ref="mini_site_main_content_id"/>
                </div>
                <div className="clearfix"></div>
              </div>
            </div>
            <div id='jqxWidget' style={{float: 'left', width: '100%'}}>
              <JqxGrid ref='Grid'
                       width={'100%'} source={dataAdapter} filterable={true} sortable={true} autoshowfiltericon={true}
                       theme={'bootstrap'} autoheight={true} pageable={true} pagesize={25} editable={true} editmode={'selectedrow'}
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
                  <input type="button" value="Создать" className="btn btn-success" onClick={this.createLanguage}
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
    fullData: store['languageReducer'].fullData,
    code: store['languageReducer'].code,
    is_default: store['languageReducer'].is_default,
    fieldsEdited: store['languageReducer'].fieldsEdited,
    languageIsSave: store['languageReducer'].languageIsSave,
    is_mini_site: store['languageReducer'].is_mini_site,
    mini_site_main_content_id: store['languageReducer'].mini_site_main_content_id,
    translations: store['languageReducer'].translations
  }
};

export default withRouter(connect(mapStateToProps)(LanguageEditPage));