import supabase from '../lib/supabase'

export const getBusinessStaff = async (businessId) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        primary_role:employee_role_templates(name, description),
        location:business_locations(name, address_line1),
        employee_services(
          service_id,
          custom_price,
          is_primary,
          service:services(name, duration, price)
        )
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const getStaffMember = async (staffId) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        primary_role:employee_role_templates(name, description),
        location:business_locations(name, address_line1, city),
        employee_services(
          service_id,
          custom_price,
          is_primary,
          service:services(name, duration, price, description)
        ),
        role_assignments:employee_role_assignments(
          id,
          effective_from,
          effective_until,
          is_active,
          role:employee_role_templates(name, description)
        )
      `)
      .eq('id', staffId)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const createStaffMember = async (businessId, staffData) => {
  try {
    const { services, ...employeeData } = staffData

    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .insert([{
        business_id: businessId,
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: employeeData.email,
        phone: employeeData.phone,
        role: employeeData.role || 'stylist',
        role_notes: employeeData.role_notes,
        employee_code: employeeData.employee_code,
        hire_date: employeeData.hire_date,
        is_active: employeeData.is_active ?? true,
        can_login: employeeData.can_login ?? false,
        working_hours: employeeData.working_hours || {},
        break_duration: employeeData.break_duration || 30,
        commission_rate: employeeData.commission_rate || 0,
        location_id: employeeData.location_id,
        primary_role_id: employeeData.primary_role_id,
        permissions: employeeData.permissions || {}
      }])
      .select()
      .single()

    if (employeeError) throw employeeError

    if (services && services.length > 0) {
      const { error: servicesError } = await assignServicesToEmployee(employee.id, services)
      if (servicesError) throw new Error(servicesError)
    }

    return { data: employee, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const updateStaffMember = async (staffId, staffData) => {
  try {
    const { services, ...employeeData } = staffData

    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .update({
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: employeeData.email,
        phone: employeeData.phone,
        role: employeeData.role,
        role_notes: employeeData.role_notes,
        employee_code: employeeData.employee_code,
        hire_date: employeeData.hire_date,
        is_active: employeeData.is_active,
        can_login: employeeData.can_login,
        working_hours: employeeData.working_hours,
        break_duration: employeeData.break_duration,
        commission_rate: employeeData.commission_rate,
        location_id: employeeData.location_id,
        primary_role_id: employeeData.primary_role_id,
        permissions: employeeData.permissions,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId)
      .select()
      .single()

    if (employeeError) throw employeeError

    if (services !== undefined) {
      const { error: servicesError } = await updateEmployeeServices(staffId, services)
      if (servicesError) throw new Error(servicesError)
    }

    return { data: employee, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const deleteStaffMember = async (staffId) => {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', staffId)

    if (error) throw error

    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const deactivateStaffMember = async (staffId) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .update({
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const updateWorkingHours = async (staffId, workingHours) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .update({
        working_hours: workingHours,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const assignServicesToEmployee = async (employeeId, services) => {
  try {
    await supabase
      .from('employee_services')
      .delete()
      .eq('employee_id', employeeId)

    if (services.length > 0) {
      const serviceAssignments = services.map(service => ({
        employee_id: employeeId,
        service_id: service.service_id,
        custom_price: service.custom_price,
        is_primary: service.is_primary || false
      }))

      const { error } = await supabase
        .from('employee_services')
        .insert(serviceAssignments)

      if (error) throw error
    }

    return { error: null }
  } catch (error) {
    return { error: error.message }
  }
}

export const updateEmployeeServices = async (employeeId, services) => {
  return await assignServicesToEmployee(employeeId, services)
}

export const getEmployeeServices = async (employeeId) => {
  try {
    const { data, error } = await supabase
      .from('employee_services')
      .select(`
        *,
        service:services(
          id,
          name,
          description,
          duration,
          price,
          category:service_categories(name)
        )
      `)
      .eq('employee_id', employeeId)

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const getStaffPerformance = async (staffId, dateRange = {}) => {
  try {
    let query = supabase
      .from('appointments')
      .select(`
        id,
        appointment_date,
        status,
        total_amount,
        service:services(name),
        client_name
      `)
      .eq('employee_id', staffId)

    if (dateRange.start) {
      query = query.gte('appointment_date', dateRange.start)
    }
    if (dateRange.end) {
      query = query.lte('appointment_date', dateRange.end)
    }

    const { data: appointments, error } = await query.order('appointment_date', { ascending: false })

    if (error) throw error

    const totalAppointments = appointments.length
    const completedAppointments = appointments.filter(apt => apt.status === 'completed').length
    const totalRevenue = appointments
      .filter(apt => apt.status === 'completed')
      .reduce((sum, apt) => sum + parseFloat(apt.total_amount || 0), 0)

    return {
      data: {
        appointments,
        metrics: {
          totalAppointments,
          completedAppointments,
          totalRevenue,
          completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0
        }
      },
      error: null
    }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const updateStaffPermissions = async (staffId, permissions) => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .update({
        permissions,
        updated_at: new Date().toISOString()
      })
      .eq('id', staffId)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const getRoleTemplates = async (businessId) => {
  try {
    const { data, error } = await supabase
      .from('employee_role_templates')
      .select(`
        *,
        permissions:employee_permissions(module, action, resource_scope, conditions)
      `)
      .eq('business_id', businessId)
      .eq('is_active', true)
      .order('name')

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

export const assignRoleToEmployee = async (employeeId, roleTemplateId, assignedBy, effectiveFrom = null, effectiveUntil = null) => {
  try {
    const { data, error } = await supabase
      .from('employee_role_assignments')
      .insert([{
        employee_id: employeeId,
        role_template_id: roleTemplateId,
        assigned_by: assignedBy,
        effective_from: effectiveFrom || new Date().toISOString().split('T')[0],
        effective_until: effectiveUntil,
        is_active: true
      }])
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}
