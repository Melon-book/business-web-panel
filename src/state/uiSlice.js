const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
}

export const REDUCER_METHODS = {
  SET: 'SET',
  SET_SIDEBAR_SHOW: 'SET_SIDEBAR_SHOW',
  SET_SIDEBAR_UNFOLDABLE: 'SET_SIDEBAR_UNFOLDABLE',
  SET_THEME: 'SET_THEME',
  SET_UI: 'SET_UI',
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case REDUCER_METHODS.SET:
      return { ...state, ...action }
    case REDUCER_METHODS.SET_SIDEBAR_SHOW:
      return { ...state, sidebarShow: action.payload }
    case REDUCER_METHODS.SET_SIDEBAR_UNFOLDABLE:
      return { ...state, sidebarUnfoldable: action.payload }
    case REDUCER_METHODS.SET_THEME:
      return { ...state, theme: action.payload }
    case REDUCER_METHODS.SET_UI:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default uiReducer
