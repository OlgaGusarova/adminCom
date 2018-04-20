import update from 'immutability-helper';
import store from '../Store';

const contentReducer = function (state = {}, action) {

  var newState = state;

  switch (action.type) {

    case 'CONTENT_FIELDS_GET':
      newState = state;
      newState = update(newState, {
        fullData: {
          $set: action.fullData
        },
        inner_name: {
          $set: action.inner_name
        },
        translations: {
          $set: action.name
        },
        active: {
          $set: action.active
        }
      });

      return newState;
      break;

    case 'UPDATE_CONTENT_TABLE':
      newState = state;
      newState = update(newState, {
        toUpdateContentTable: {
          $set: true,
        },
      });
      return newState;
      break;

    case 'NO_UPDATE_CONTENT_TABLE':
      newState = state;
      newState = update(newState, {
        toUpdateContentTable: {
          $set: false,
        },
      });
      return newState;
      break;


    case 'CONTENT_EDITED':
      newState = state;
      newState = update(newState, {
        contentIsSave: {
          $set: !newState.contentIsSave
        }
      });
      return newState;
      break;

    default :
      if (store == undefined)
        var editedTranslations = [],
          fullData = {},
          inner_name = '',
          toUpdateContentTable = false,
          active = false,
          translations = [],
          contentIsSave = false;
      else {
        var _store = store.getState(),
          editedTranslations = _store['contentReducer'].editedTranslations,
          inner_name = _store['contentReducer'].inner_name,
          fullData = _store['contentReducer'].fullData,
          toUpdateContentTable = _store['contentReducer'].toUpdateContentTable,
          active = _store['contentReducer'].active,
          translations = _store['contentReducer'].translations,
          contentIsSave = _store['contentReducer'].contentIsSave;
      }

      return {
        ...state,
        fullData: fullData,
        inner_name: inner_name,
        toUpdateContentTable: toUpdateContentTable,
        translations: translations,
        active: active,
        contentIsSave: contentIsSave,
        editedTranslations: editedTranslations
      };
      break;
  }
};
export default contentReducer;
