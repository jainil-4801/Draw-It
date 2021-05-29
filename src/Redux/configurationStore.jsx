import { createStore, combineReducers, applyMiddleware } from 'redux';
import{ generalReducer} from './generalReducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
const ConfigurationStore= () => {
    const store = createStore(
        combineReducers({
            generalReducer
        }),
        applyMiddleware(thunk,logger)
    );
    // console.log(store.getState())
    return store;
}
export default ConfigurationStore;