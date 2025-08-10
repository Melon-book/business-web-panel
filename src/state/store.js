import { legacy_createStore as createStore, combineReducers } from 'redux'
import uiReducer from './uiSlice'

const rootReducer = combineReducers({
  ui: uiReducer,
})

const store = createStore(rootReducer)

export default store
