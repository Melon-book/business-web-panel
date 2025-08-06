const initialState = {
  staff: [],
  selectedStaff: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    role: 'all',
    location: 'all',
  },
}

const staffReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'STAFF_LOADING':
      return { ...state, loading: true, error: null }
    case 'STAFF_SUCCESS':
      return {
        ...state,
        staff: action.payload,
        loading: false,
        error: null
      }
    case 'STAFF_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SELECT_STAFF':
      return { ...state, selectedStaff: action.payload }
    case 'SET_STAFF_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'ADD_STAFF':
      return {
        ...state,
        staff: [...state.staff, action.payload]
      }
    case 'UPDATE_STAFF':
      return {
        ...state,
        staff: state.staff.map(member =>
          member.id === action.payload.id ? action.payload : member
        )
      }
    case 'REMOVE_STAFF':
      return {
        ...state,
        staff: state.staff.filter(member => member.id !== action.payload)
      }
    default:
      return state
  }
}

export default staffReducer
