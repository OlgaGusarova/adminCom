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
      return {
        ...state,
        fullData: {},
        inner_name: '',
        toUpdateContentTable: false,
        translations: [],
        active: false,
        contentIsSave: false,
        editedTranslations: []
      };
      break;
  }
};
export default contentReducer;
