import styled from 'styled-components'

const colors = {
  success: '#2e7d32',
  error: '#c62828',
}

const Box = styled.div`
  color: ${(props) => colors[props.$type] || '#333'};
  background: #f5f5f5;
  border: 2px solid ${(props) => colors[props.$type] || '#999'};
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 16px;
  font-weight: 500;
`

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <Box $type={notification.type} className="notification">
      {notification.message}
    </Box>
  )
}

export default Notification
