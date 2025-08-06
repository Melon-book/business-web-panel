const initialState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    dateRange: 'today',
    employee: 'all',
    service: 'all',
  },
}

const appointmentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'APPOINTMENTS_LOADING':
      return { ...state, loading: true, error: null }
    case 'APPOINTMENTS_SUCCESS':
      return {
        ...state,
        appointments: action.payload,
        loading: false,
        error: null
      }
    case 'APPOINTMENTS_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SELECT_APPOINTMENT':
      return { ...state, selectedAppointment: action.payload }
    case 'SET_APPOINTMENT_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'ADD_APPOINTMENT':
      return {
        ...state,
        appointments: [...state.appointments, action.payload]
      }
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(apt =>
          apt.id === action.payload.id ? action.payload : apt
        )
      }
    case 'REMOVE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.filter(apt => apt.id !== action.payload)
      }
    default:
      return state
  }
}

export default appointmentsReducer
