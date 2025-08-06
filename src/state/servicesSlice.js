const initialState = {
  services: [],
  categories: [],
  selectedService: null,
  loading: false,
  error: null,
  filters: {
    category: 'all',
    status: 'all',
    availability: 'all',
  },
}

const servicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SERVICES_LOADING':
      return { ...state, loading: true, error: null }
    case 'SERVICES_SUCCESS':
      return {
        ...state,
        services: action.payload,
        loading: false,
        error: null
      }
    case 'SERVICES_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'CATEGORIES_SUCCESS':
      return { ...state, categories: action.payload }
    case 'SELECT_SERVICE':
      return { ...state, selectedService: action.payload }
    case 'SET_SERVICE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'ADD_SERVICE':
      return {
        ...state,
        services: [...state.services, action.payload]
      }
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.id ? action.payload : service
        )
      }
    case 'REMOVE_SERVICE':
      return {
        ...state,
        services: state.services.filter(service => service.id !== action.payload)
      }
    default:
      return state
  }
}

export default servicesReducer
