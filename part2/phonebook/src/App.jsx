import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existing = persons.find((p) => p.name === newName)

    if (existing) {
      const ok = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!ok) return

      personService
        .update(existing.id, { ...existing, number: newNumber })
        .then((returnedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== existing.id ? p : returnedPerson))
          )
          showNotification(`Updated number of ${returnedPerson.name}`)
          setNewName('')
          setNewNumber('')
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            showNotification(
              `Information of ${existing.name} has already been removed from server`,
              'error'
            )
            setPersons(persons.filter((p) => p.id !== existing.id))
          } else {
            const message =
              error.response?.data?.error || 'Could not update the person'
            showNotification(message, 'error')
          }
        })
      return
    }

    personService
      .create({ name: newName, number: newNumber })
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        showNotification(`Added ${returnedPerson.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        const message =
          error.response?.data?.error || 'Could not add the person'
        showNotification(message, 'error')
      })
  }

  const removePerson = (person) => {
    if (!window.confirm(`Delete ${person.name} ?`)) {
      return
    }

    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== person.id))
        showNotification(`Deleted ${person.name}`)
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          showNotification(
            `Information of ${person.name} has already been removed from server`,
            'error'
          )
          setPersons(persons.filter((p) => p.id !== person.id))
        } else {
          showNotification(`Could not delete ${person.name}`, 'error')
        }
      })
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={removePerson} />
    </div>
  )
}

export default App
