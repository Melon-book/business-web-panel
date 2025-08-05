import { configureStore } from '@reduxjs/toolkit'

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'set':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

const store = configureStore({
  reducer: {
    ui: uiReducer
  }
})

export default store