import { useState } from 'react'
import styled from 'styled-components'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 320px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: #455a64;
  }

  input {
    padding: 8px 10px;
    border: 1px solid #b0bec5;
    border-radius: 6px;
    font-size: 14px;
  }
`

const Button = styled.button`
  background: #37474f;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-size: 15px;
  cursor: pointer;
`

const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({ username, password })
    setUsername('')
    setPassword('')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <label htmlFor="username">username</label>
        <input
          id="username"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </Field>
      <Field>
        <label htmlFor="password">password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </Field>
      <Button type="submit">login</Button>
    </Form>
  )
}

export default LoginForm
