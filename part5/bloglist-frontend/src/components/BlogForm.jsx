import { useState } from 'react'
import styled from 'styled-components'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 420px;
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
  background: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px;
  font-size: 15px;
  cursor: pointer;
`

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onCreate({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <label htmlFor="title">title</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </Field>
      <Field>
        <label htmlFor="author">author</label>
        <input
          id="author"
          name="author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
        />
      </Field>
      <Field>
        <label htmlFor="url">url</label>
        <input
          id="url"
          name="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      </Field>
      <Button type="submit">create</Button>
    </Form>
  )
}

export default BlogForm
