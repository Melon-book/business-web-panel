import { legacy_createStore as createStore, combineReducers } from 'redux'
import uiReducer from './uiSlice'
import authReducer from './authSlice'
import appointmentsReducer from './appointmentsSlice'
import staffReducer from './staffSlice'
import clientsReducer from './clientsSlice'
import servicesReducer from './servicesSlice'
import analyticsReducer from './analyticsSlice'

const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  appointments: appointmentsReducer,
  staff: staffReducer,
  clients: clientsReducer,
  services: servicesReducer,
  analytics: analyticsReducer,
})

const store = createStore(rootReducer)

export default store
