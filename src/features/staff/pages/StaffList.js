import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CInputGroup,
  CFormInput,
  CFormSelect,
  CBadge,
  CAvatar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CSpinner,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilSearch,
  cilPlus,
  cilPencil,
  // cilEyedropper,
  cilEyedropper,
  cilUserFollow,
  cilUserUnfollow,
  cilOptions,
} from '@coreui/icons'
import { getAllStaff, toggleStaffStatus } from '../../../services/staff'
import StaffModal from '../components/StaffModal'

const StaffList = () => {
  const dispatch = useDispatch()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [modalMode, setModalMode] = useState('create') // 'create' or 'edit'

  const [filters, setFilters] = useState({
    search: '',
    // role: 'all',
    // status: 'all',
    // location: 'all'
  })

  const businessId = '768191b7-4414-4cc2-94a8-77b2950f1f94'

  useEffect(() => {
    loadStaff()
  }, [filters])

  const loadStaff = async () => {
    setLoading(true)
    const { data, error } = await getAllStaff(businessId, filters)

    if (error) {
      setError(error)
    } else {
      setStaff(data || [])
    }
    setLoading(false)
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleAddStaff = () => {
    setSelectedStaff(null)
    setModalMode('create')
    setShowModal(true)
  }

  const handleEditStaff = (staffMember) => {
    setSelectedStaff(staffMember)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleToggleStatus = async (staffId, currentStatus) => {
    try {
      const { data, error } = await toggleStaffStatus(staffId)
      if (error) {
        setError(error)
      } else {
        // Update the staff list with the new status
        setStaff(prev => prev.map(member =>
          member.id === staffId
            ? { ...member, is_active: data.is_active }
            : member
        ))
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleModalSuccess = (staffData) => {
    if (modalMode === 'create') {
      // Add new staff member to the list
      setStaff(prev => [staffData, ...prev])
    } else {
      // Update existing staff member in the list
      setStaff(prev => prev.map(member =>
        member.id === staffData.id ? staffData : member
      ))
    }
    setShowModal(false)
    setSelectedStaff(null)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setSelectedStaff(null)
    setModalMode('create')
  }

  const getStatusBadge = (isActive) => {
    return (
      <CBadge color={isActive ? 'success' : 'secondary'}>
        {isActive ? 'Active' : 'Inactive'}
      </CBadge>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
  }

  const getFullName = (staff) => {
    return `${staff.first_name} ${staff.last_name}`
  }

  const StaffToolbar = () => (
    <CRow className="mb-3">
      <CCol md={4}>
        <CInputGroup>
          <CFormInput
            placeholder="Search staff..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          <CButton variant="outline" id="search-button">
            <CIcon icon={cilSearch} />
          </CButton>
        </CInputGroup>
      </CCol>
      <CCol md={2}>
        <CFormSelect
          value={filters.role}
          onChange={(e) => handleFilterChange('role', e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="stylist">Stylist</option>
          <option value="manager">Manager</option>
          <option value="receptionist">Receptionist</option>
          <option value="assistant">Assistant</option>
        </CFormSelect>
      </CCol>
      <CCol md={2}>
        <CFormSelect
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">All Status</option>
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </CFormSelect>
      </CCol>
      <CCol md={2}>
        <CFormSelect
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        >
          <option value="all">All Locations</option>
          <option value="main">Main Location</option>
        </CFormSelect>
      </CCol>
      <CCol md={2} className="text-end">
        <CButton
          color="primary"
          onClick={handleAddStaff}
        >
          <CIcon icon={cilPlus} className="me-1" />
          Add Staff
        </CButton>
      </CCol>
    </CRow>
  )

  const StaffStats = () => (
    <CRow className="mb-3">
      <CCol>
        <div className="d-flex gap-4">
          <div>
            <strong>Total Staff: </strong>
            <span>{staff.length}</span>
          </div>
          <div>
            <strong>Active: </strong>
            <span>{staff.filter(s => s.is_active).length}</span>
          </div>
          <div>
            <strong>Inactive: </strong>
            <span>{staff.filter(s => !s.is_active).length}</span>
          </div>
        </div>
      </CCol>
    </CRow>
  )

  const StaffTableContent = () => {
    if (loading) {
      return (
        <CTableRow>
          <CTableDataCell colSpan="7" className="text-center">
            <CSpinner />
          </CTableDataCell>
        </CTableRow>
      )
    }

    if (staff.length === 0) {
      return (
        <CTableRow>
          <CTableDataCell colSpan="7" className="text-center">
            <div className="py-4">
              <p className="text-muted mb-0">No staff members found</p>
              {filters.search && (
                <small className="text-muted">
                  Try adjusting your search or filters
                </small>
              )}
            </div>
          </CTableDataCell>
        </CTableRow>
      )
    }

    return staff.map((member) => (
      <CTableRow key={member.id}>
        <CTableDataCell>
          <div className="d-flex align-items-center">
            <CAvatar
              src={member.avatar_url || '/default-avatar.png'}
              size="md"
              className="me-2"
            />
            <div>
              <div className="fw-semibold">{getFullName(member)}</div>
              <small className="text-muted">{member.email}</small>
            </div>
          </div>
        </CTableDataCell>
        <CTableDataCell>{member.role}</CTableDataCell>
        <CTableDataCell>{member.phone || '-'}</CTableDataCell>
        <CTableDataCell>{member.employee_code || '-'}</CTableDataCell>
        <CTableDataCell>{formatDate(member.hire_date)}</CTableDataCell>
        <CTableDataCell>
          {getStatusBadge(member.is_active)}
        </CTableDataCell>
        <CTableDataCell>
          <CDropdown>
            <CDropdownToggle size="sm" color="ghost">
              <CIcon icon={cilOptions} />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem href={`#/staff/${member.id}`}>
                <CIcon icon={cilEyedropper} className="me-2" />
                View Details
              </CDropdownItem>
              <CDropdownItem onClick={() => handleEditStaff(member)}>
                <CIcon icon={cilPencil} className="me-2" />
                Edit
              </CDropdownItem>
              <CDropdownItem
                onClick={() => handleToggleStatus(member.id, member.is_active)}
              >
                <CIcon
                  icon={member.is_active ? cilUserUnfollow : cilUserFollow}
                  className="me-2"
                />
                {member.is_active ? 'Deactivate' : 'Activate'}
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CTableDataCell>
      </CTableRow>
    ))
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <strong>Staff Management</strong>
                <small className="text-muted">
                  Manage your team members and their permissions
                </small>
              </div>
            </CCardHeader>
            <CCardBody>
              {error && (
                <CAlert color="danger" className="mb-3">
                  {error}
                </CAlert>
              )}

              <StaffToolbar />
              <StaffStats />

              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Staff Member</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Phone</CTableHeaderCell>
                    <CTableHeaderCell>Employee Code</CTableHeaderCell>
                    <CTableHeaderCell>Hire Date</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <StaffTableContent />
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <StaffModal
        visible={showModal}
        onClose={handleModalClose}
        staffMember={selectedStaff}
        businessId={businessId}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}

export default StaffList
