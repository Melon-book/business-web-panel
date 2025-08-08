const initialState = {
  dashboardData: null,
  revenueData: [],
  appointmentMetrics: null,
  clientMetrics: null,
  staffPerformance: [],
  loading: false,
  error: null,
  dateRange: {
    start: null,
    end: null,
  },
}

const analyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ANALYTICS_LOADING':
      return { ...state, loading: true, error: null }
    case 'ANALYTICS_SUCCESS':
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: null
      }
    case 'ANALYTICS_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload }
    case 'DASHBOARD_DATA_SUCCESS':
      return { ...state, dashboardData: action.payload }
    case 'REVENUE_DATA_SUCCESS':
      return { ...state, revenueData: action.payload }
    case 'APPOINTMENT_METRICS_SUCCESS':
      return { ...state, appointmentMetrics: action.payload }
    case 'CLIENT_METRICS_SUCCESS':
      return { ...state, clientMetrics: action.payload }
    case 'STAFF_PERFORMANCE_SUCCESS':
      return { ...state, staffPerformance: action.payload }
    default:
      return state
  }
}

export default analyticsReducer
