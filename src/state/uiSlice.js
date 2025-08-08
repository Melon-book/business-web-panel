const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SIDEBAR_SHOW':
      return { ...state, sidebarShow: action.payload }
    case 'SET_SIDEBAR_UNFOLDABLE':
      return { ...state, sidebarUnfoldable: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_UI':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default uiReducer
