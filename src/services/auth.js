import supabase from '../lib/supabase'

export const loginWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    return { user: null, session: null, error: error.message }
  }
}

export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    return { user: null, error: error.message }
  }
}

export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return { session, error: null }
  } catch (error) {
    return { session: null, error: error.message }
  }
}

export const registerWithEmail = async (email, password, userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) throw error

    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    return { user: null, session: null, error: error.message }
  }
}

export const registerBusiness = async (businessName, email, password) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: businessName.split(' ')[0] || businessName,
          last_name: businessName.split(' ').slice(1).join(' ') || 'Owner',
          role: 'business_owner'
        }
      }
    })

    if (authError) throw authError

    if (authData.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: email,
            first_name: businessName.split(' ')[0] || businessName,
            last_name: businessName.split(' ').slice(1).join(' ') || 'Owner',
            role: 'business_owner'
          }
        ])
        .select()

      if (userError) throw userError

      const slug = businessName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')

      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .insert([
          {
            owner_id: authData.user.id,
            name: businessName,
            slug: `${slug}-${Date.now()}`,
            business_type: 'salon',
            status: 'active'
          }
        ])
        .select()

      if (businessError) throw businessError

      return {
        user: authData.user,
        session: authData.session,
        business: businessData[0],
        error: null
      }
    }

    return { user: null, session: null, business: null, error: 'Registration failed' }
  } catch (error) {
    return { user: null, session: null, business: null, error: error.message }
  }
}

export const createEmployeeAccount = async (employeeData, temporaryPassword = null) => {
  try {
    if (!employeeData.can_login) {
      return { user: null, error: null }
    }

    const password = temporaryPassword || generateTemporaryPassword()

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: employeeData.email,
      password: password,
      options: {
        data: {
          first_name: employeeData.first_name,
          last_name: employeeData.last_name,
          role: 'employee'
        }
      }
    })

    if (authError) throw authError

    if (authData.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: employeeData.email,
            first_name: employeeData.first_name,
            last_name: employeeData.last_name,
            phone: employeeData.phone,
            role: 'employee'
          }
        ])
        .select()

      if (userError) throw userError

      return {
        user: authData.user,
        userData: userData[0],
        temporaryPassword: password,
        error: null
      }
    }

    return { user: null, userData: null, temporaryPassword: null, error: 'Account creation failed' }
  } catch (error) {
    return { user: null, userData: null, temporaryPassword: null, error: error.message }
  }
}

const generateTemporaryPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}
