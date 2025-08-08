import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CFormCheck,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CSpinner,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilPhone,
  cilEnvelopeOpen,
  cilCalendar,
  cilClock,
  cilDollar,
  cilSettings,
  cilLocationPin,
} from '@coreui/icons'
import { createStaffMember, updateStaffMember } from '../../../services/staff'

const StaffModal = ({
  visible,
  onClose,
  staffMember = null,
  businessId,
  onSuccess
}) => {
  const [activeTab, setActiveTab] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    employee_code: '',
    hire_date: new Date().toISOString().split('T')[0],
    role: 'stylist',
    role_notes: '',
    can_login: false,
    is_active: true,
    commission_rate: 0,
    break_duration: 30,
    location_id: null,
    working_hours: {
      monday: { enabled: true, start: '09:00', end: '17:00' },
      tuesday: { enabled: true, start: '09:00', end: '17:00' },
      wednesday: { enabled: true, start: '09:00', end: '17:00' },
      thursday: { enabled: true, start: '09:00', end: '17:00' },
      friday: { enabled: true, start: '09:00', end: '17:00' },
      saturday: { enabled: false },
      sunday: { enabled: false }
    },
    permissions: {
      appointments: ['read'],
      clients: ['read'],
      services: ['read'],
      analytics: [],
      settings: []
    },
    services: []
  })

  const isEditMode = Boolean(staffMember)

  useEffect(() => {
    if (staffMember) {
      setFormData({
        first_name: staffMember.first_name || '',
        last_name: staffMember.last_name || '',
        email: staffMember.email || '',
        phone: staffMember.phone || '',
        employee_code: staffMember.employee_code || '',
        hire_date: staffMember.hire_date || new Date().toISOString().split('T')[0],
        role: staffMember.role || 'stylist',
        role_notes: staffMember.role_notes || '',
        can_login: staffMember.can_login || false,
        is_active: staffMember.is_active !== undefined ? staffMember.is_active : true,
        commission_rate: staffMember.commission_rate || 0,
        break_duration: staffMember.break_duration || 30,
        location_id: staffMember.location_id || null,
        working_hours: staffMember.working_hours || formData.working_hours,
        permissions: staffMember.permissions || formData.permissions,
        services: staffMember.employee_services?.map(es => ({
          service_id: es.service_id,
          custom_price: es.custom_price,
          is_primary: es.is_primary
        })) || []
      })
    } else {
      generateEmployeeCode()
    }
  }, [staffMember])

  const generateEmployeeCode = () => {
    const code = 'EMP' + Math.random().toString(36).substr(2, 6).toUpperCase()
    setFormData(prev => ({ ...prev, employee_code: code }))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleWorkingHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day],
          [field]: value
        }
      }
    }))
  }

  const handlePermissionChange = (module, action, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: checked
          ? [...(prev.permissions[module] || []), action]
          : (prev.permissions[module] || []).filter(a => a !== action)
      }
    }))
  }

  const validateForm = () => {
    if (!formData.first_name || !formData.last_name) {
      setError('First name and last name are required')
      return false
    }
    if (!formData.email) {
      setError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let result
      if (isEditMode) {
        result = await updateStaffMember(staffMember.id, formData)
      } else {
        result = await createStaffMember(businessId, formData)
      }

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(`Staff member ${isEditMode ? 'updated' : 'created'} successfully!`)
        setTimeout(() => {
          onSuccess?.(result.data)
          onClose()
        }, 1500)
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const BasicInfoTab = () => (
    <CRow>
      <CCol md={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="first_name">First Name *</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              required
            />
          </CInputGroup>
        </div>
      </CCol>
      <CCol md={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="last_name">Last Name *</CFormLabel>
          <CFormInput
            id="last_name"
            value={formData.last_name}
            onChange={(e) => handleInputChange('last_name', e.target.value)}
            required
          />
        </div>
      </CCol>
      <CCol md={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="email">Email *</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilEnvelopeOpen} />
            </CInputGroupText>
            <CFormInput
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </CInputGroup>
        </div>
      </CCol>
      <CCol md={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="phone">Phone</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilPhone} />
            </CInputGroupText>
            <CFormInput
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </CInputGroup>
        </div>
      </CCol>
      <CCol md={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="employee_code">Employee Code</CFormLabel>
          <CInputGroup>
            <CFormInput
              id="employee_code"
              value={formData.employee_code}
              onChange={(e) => handleInputChange('employee_code', e.target.value)}
            />
            <CButton
              variant="outline"
              onClick={generateEmployeeCode}
              disabled={isEditMode}
            >
              Generate
            </CButton>
          </CInputGroup>
        </div>
      </CCol>
      <CCol md={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="hire_date">Hire Date</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilCalendar} />
            </CInputGroupText>
            <CFormInput
              id="hire_date"
              type="date"
              value={formData.hire_date}
              onChange={(e) => handleInputChange('hire_date', e.target.value)}
            />
          </CInputGroup>
        </div>
      </CCol>
    </CRow>
  )

  const RoleAccessTab = () => (
    <CRow>
      <CCol md={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="role">Role</CFormLabel>
          <CFormSelect
            id="role"
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
          >
            <option value="stylist">Stylist</option>
            <option value="manager">Manager</option>
            <option value="receptionist">Receptionist</option>
            <option value="assistant">Assistant</option>
            <option value="owner">Owner</option>
          </CFormSelect>
        </div>
      </CCol>
      <CCol md={6}>
        <div className="mb-3">
          <CFormLabel htmlFor="commission_rate">Commission Rate (%)</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilDollar} />
            </CInputGroupText>
            <CFormInput
              id="commission_rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.commission_rate}
              onChange={(e) => handleInputChange('commission_rate', parseFloat(e.target.value) || 0)}
            />
            <CInputGroupText>%</CInputGroupText>
          </CInputGroup>
        </div>
      </CCol>
      <CCol xs={12}>
        <div className="mb-3">
          <CFormLabel htmlFor="role_notes">Role Notes</CFormLabel>
          <CFormTextarea
            id="role_notes"
            rows={3}
            value={formData.role_notes}
            onChange={(e) => handleInputChange('role_notes', e.target.value)}
            placeholder="Additional notes about this role..."
          />
        </div>
      </CCol>
      <CCol xs={12}>
        <div className="mb-3">
          <CFormCheck
            id="can_login"
            checked={formData.can_login}
            onChange={(e) => handleInputChange('can_login', e.target.checked)}
            label="Can login to system"
          />
        </div>
      </CCol>
      <CCol xs={12}>
        <div className="mb-3">
          <CFormCheck
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => handleInputChange('is_active', e.target.checked)}
            label="Active employee"
          />
        </div>
      </CCol>
    </CRow>
  )

  const ScheduleTab = () => (
    <CRow>
      <CCol md={4}>
        <div className="mb-3">
          <CFormLabel htmlFor="break_duration">Break Duration (minutes)</CFormLabel>
          <CInputGroup>
            <CInputGroupText>
              <CIcon icon={cilClock} />
            </CInputGroupText>
            <CFormInput
              id="break_duration"
              type="number"
              min="0"
              max="240"
              value={formData.break_duration}
              onChange={(e) => handleInputChange('break_duration', parseInt(e.target.value) || 0)}
            />
          </CInputGroup>
        </div>
      </CCol>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>Working Hours</strong>
          </CCardHeader>
          <CCardBody>
            {Object.entries(formData.working_hours).map(([day, schedule]) => (
              <CRow key={day} className="mb-2 align-items-center">
                <CCol md={2}>
                  <CFormCheck
                    checked={schedule.enabled}
                    onChange={(e) => handleWorkingHoursChange(day, 'enabled', e.target.checked)}
                    label={day.charAt(0).toUpperCase() + day.slice(1)}
                  />
                </CCol>
                {schedule.enabled && (
                  <>
                    <CCol md={3}>
                      <CFormInput
                        type="time"
                        value={schedule.start || '09:00'}
                        onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                      />
                    </CCol>
                    <CCol md={1} className="text-center">to</CCol>
                    <CCol md={3}>
                      <CFormInput
                        type="time"
                        value={schedule.end || '17:00'}
                        onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                      />
                    </CCol>
                  </>
                )}
              </CRow>
            ))}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )

  const PermissionsTab = () => {
    const modules = [
      { key: 'appointments', label: 'Appointments', actions: ['read', 'create', 'update', 'delete'] },
      { key: 'clients', label: 'Clients', actions: ['read', 'create', 'update', 'delete'] },
      { key: 'services', label: 'Services', actions: ['read', 'create', 'update', 'delete'] },
      { key: 'analytics', label: 'Analytics', actions: ['read'] },
      { key: 'settings', label: 'Settings', actions: ['read', 'update'] }
    ]

    return (
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <strong>System Permissions</strong>
            </CCardHeader>
            <CCardBody>
              {modules.map(module => (
                <div key={module.key} className="mb-3">
                  <h6>{module.label}</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {module.actions.map(action => (
                      <CFormCheck
                        key={`${module.key}-${action}`}
                        checked={formData.permissions[module.key]?.includes(action) || false}
                        onChange={(e) => handlePermissionChange(module.key, action, e.target.checked)}
                        label={action.charAt(0).toUpperCase() + action.slice(1)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return (
    <CModal visible={visible} onClose={onClose} size="xl">
      <CModalHeader>
        <CModalTitle>
          {isEditMode ? 'Edit Staff Member' : 'Add New Staff Member'}
        </CModalTitle>
      </CModalHeader>

      <CForm onSubmit={handleSubmit}>
        <CModalBody>
          {error && (
            <CAlert color="danger" className="mb-3">
              {error}
            </CAlert>
          )}

          {success && (
            <CAlert color="success" className="mb-3">
              {success}
            </CAlert>
          )}

          <CNav variant="tabs" className="mb-3">
            <CNavItem>
              <CNavLink
                active={activeTab === 1}
                onClick={() => setActiveTab(1)}
                style={{ cursor: 'pointer' }}
              >
                Basic Info
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 2}
                onClick={() => setActiveTab(2)}
                style={{ cursor: 'pointer' }}
              >
                Role & Access
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 3}
                onClick={() => setActiveTab(3)}
                style={{ cursor: 'pointer' }}
              >
                Schedule
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 4}
                onClick={() => setActiveTab(4)}
                style={{ cursor: 'pointer' }}
              >
                Permissions
              </CNavLink>
            </CNavItem>
          </CNav>

          <CTabContent>
            <CTabPane visible={activeTab === 1}>
              <BasicInfoTab />
            </CTabPane>
            <CTabPane visible={activeTab === 2}>
              <RoleAccessTab />
            </CTabPane>
            <CTabPane visible={activeTab === 3}>
              <ScheduleTab />
            </CTabPane>
            <CTabPane visible={activeTab === 4}>
              <PermissionsTab />
            </CTabPane>
          </CTabContent>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </CButton>
          <CButton
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditMode ? 'Update Staff Member' : 'Create Staff Member'
            )}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

export default StaffModal
