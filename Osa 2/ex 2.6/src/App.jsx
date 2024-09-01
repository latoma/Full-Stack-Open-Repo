import { useState, useEffect } from 'react'
import axios from 'axios'
import FilterForm from './components/FilterForm'
import PersonForm from './components/PersonForm'
import PersonsList from './components/PersonsList'
import services from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Testo Tero', number: '040-123456' },
  ])

  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    console.log('effect')
    services
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled: initial persons')
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')
  
  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(person => person.name === newName)
        const updatedPerson = {...person, number: newNumber}
        const id = person.id

        services.update(id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          })
        return
      }
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    services
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = () => {
    services
      .getAll()
      .then(refreshedPersons => {
        console.log('persons updated')
        setPersons(refreshedPersons)
      })
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    console.log(event.target.value)
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
    console.log(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
    console.log(event.target.value)
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm filter={filter} handleFilterChange={handleFilterChange} />

      <h2>Add a new</h2>
      <PersonForm 
        addPerson={addPerson} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange} 
      />

      <h2>Numbers</h2>
      <PersonsList persons={persons} filter={filter} deletePerson={deletePerson} />
    </div>
  )

}

export default App