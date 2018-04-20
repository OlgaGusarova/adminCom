import {createStore, combineReducers, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import languageReducer from './reducers/languageReducer';
import contentReducer from './reducers/contentReducer';

const reducers = combineReducers({
  languageReducer: languageReducer,
  contentReducer: contentReducer
});

var store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
export default store;

