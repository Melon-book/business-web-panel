import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { sygnet } from '@coreui/icons'
import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.ui?.sidebarUnfoldable || false)
  const sidebarShow = useSelector((state) => state.ui?.sidebarShow || true)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', payload: { sidebarShow: visible } })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <div className="sidebar-brand-full">
          <strong>Melon</strong>
        </div>
        <CIcon className="sidebar-brand-minimized" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <AppSidebarNav items={navigation} />
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', payload: { sidebarUnfoldable: !unfoldable } })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)