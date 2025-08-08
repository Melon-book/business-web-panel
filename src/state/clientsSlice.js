const initialState = {
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    tags: [],
  },
}

const clientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CLIENTS_LOADING':
      return { ...state, loading: true, error: null }
    case 'CLIENTS_SUCCESS':
      return {
        ...state,
        clients: action.payload,
        loading: false,
        error: null
      }
    case 'CLIENTS_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SELECT_CLIENT':
      return { ...state, selectedClient: action.payload }
    case 'SET_CLIENT_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload]
      }
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        )
      }
    case 'REMOVE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload)
      }
    default:
      return state
  }
}

export default clientsReducer
