const initialState = {
  user: null,
  session: null,
  loading: false,
  error: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        loading: false,
        error: null
      }
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'AUTH_LOGOUT':
      return { ...initialState }
    default:
      return state
  }
}

export default authReducer
