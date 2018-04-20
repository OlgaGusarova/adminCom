import update from 'immutability-helper';
import store from '../Store';

const languageReducer = function (state = {}, action) {

  var newState = state;

  switch (action.type) {

    case 'LANGUAGE_FIELDS_GET':
      newState = state;
      newState = update(newState, {
        fullData: {
          $set: action.fullData
        },
        code: {
          $set: action.code
        },
        is_default: {
          $set: action.is_default
        },
        is_mini_site: {
          $set: action.is_mini_site
        },
        mini_site_main_content_id: {
          $set: action.mini_site_main_content_id
        },
        translations: {
          $set: action.translations
        }
      });
      return newState;
      break;

    case 'UPDATE_LANGUAGE_TABLE':
      newState = state;
      newState = update(newState, {
        toUpdateLanguageTable: {
          $set: true,
        }
      });
      return newState;
      break;

    case 'NO_UPDATE_LANGUAGE_TABLE':
      newState = state;
      newState = update(newState, {
        toUpdateLanguageTable: {
          $set: false,
        }
      });
      return newState;
      break;

    case 'LANGUAGE_EDITED':
      newState = state;
      newState = update(newState, {
        languageIsSave: {
          $set: !newState.languageIsSave
        }
      });
      return newState;
      break;

    default :
      if (store === undefined)
        var fieldsEdited = {},
          fullData = {},
          toUpdateLanguageTable = false,
          code = '',
          is_default = '',
          languageIsSave = false,
          is_mini_site = false,
          mini_site_main_content_id = '',
          translations = [];
      else {
        var _store = store.getState(),
          fieldsEdited = _store['languageReducer'].fieldsEdited,
          fullData = _store['languageReducer'].fullData,
          toUpdateLanguageTable = _store['languageReducer'].toUpdateLanguageTable,
          code = _store['languageReducer'].code,
          is_default = _store['languageReducer'].is_default,
          languageIsSave = _store['languageReducer'].languageIsSave,
          is_mini_site = _store['languageReducer'].is_mini_site,
          mini_site_main_content_id = _store['languageReducer'].mini_site_main_content_id,
          translations = _store['languageReducer'].translations;
      }

      return {
        ...state,
        fullData: fullData,
        toUpdateLanguageTable: toUpdateLanguageTable,
        code: code,
        is_default: is_default,
        languageIsSave: languageIsSave,
        fieldsEdited: fieldsEdited,
        is_mini_site: is_mini_site,
        mini_site_main_content_id: mini_site_main_content_id,
        translations: translations
      };
      break;
  }

};
export default languageReducer;
