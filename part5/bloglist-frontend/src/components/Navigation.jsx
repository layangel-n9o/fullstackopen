import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Bar = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: #37474f;
  border-radius: 8px;
  margin-bottom: 24px;
`

const Brand = styled(Link)`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  text-decoration: none;
  margin-right: 12px;
`

const NavLink = styled(Link)`
  color: #cfd8dc;
  text-decoration: none;

  &:hover {
    color: #fff;
  }
`

const User = styled.span`
  color: #b0bec5;
  margin-left: auto;
`

const LogoutButton = styled.button`
  background: #eceff1;
  color: #37474f;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
`

const Navigation = ({ user, onLogout }) => {
  return (
    <Bar>
      <Brand to="/">Bloglist</Brand>
      <NavLink to="/">blogs</NavLink>
      {user && <NavLink to="/new">new blog</NavLink>}
      {!user && <NavLink to="/login">login</NavLink>}
      {user && (
        <>
          <User>{user.name} logged in</User>
          <LogoutButton onClick={onLogout}>logout</LogoutButton>
        </>
      )}
    </Bar>
  )
}

export default Navigation
