import supabase from '../lib/supabase'
import { business_type, roles } from '../constants/constants'

export const loginWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export const signUpWithEmail = async (email, password, userData) => {
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

// TODO .. remove extra logic, like splitting, creating slug, etc.
export const registerBusiness = async (businessName, email, password) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: businessName.split(' ')[0] || businessName,
          last_name: businessName.split(' ').slice(1).join(' ') || 'Owner',
          role: roles.business_owner,
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
            role: roles.business_owner,
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
            business_type: business_type.salon,
            status: 'active',
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

export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
  return { error: null }
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

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    throw new Error(error.message)
  }

  return user
}

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) {
    throw new Error(error.message)
  }
}

export const updatePassword = async (password) => {
  const { data, error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}
