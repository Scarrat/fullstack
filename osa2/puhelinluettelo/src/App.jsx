import { useState,useEffect } from 'react'
import personService from './services/persons'
import './App.css'

const Filter = ({filter, handleFilterChange}) => {
  return (
    <div>
      Filter: <input value={filter} onChange={handleFilterChange} />
    </div>
  )
}

const NewPersonForm = ({addName, newName,newNumber,handleNameChange,handleNumberChange}) => {
  return(
    <form onSubmit={addName}>
            <div>
              name: <input value={newName} onChange={handleNameChange} />
            </div>
            <div>
              number: <input value={newNumber} onChange={handleNumberChange} />
            </div>
            <div>
              <button type="submit">add</button>
            </div>
      </form>
  )
  
}

const PersonsList = ({persons, filter, handleDelete}) => {
  const personsFiltered = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase()))
  return(
    
    <div>
      {personsFiltered.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
    </div>
  )
  
}

const PositiveNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="positiveError">
      {message}
    </div>
  )
}
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(defaultPersons => {
        setPersons(defaultPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const person ={
      name : newName,
      number : newNumber
    }

    if (persons.find(person => person.name == newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(pers => pers.name === newName)
        const modifiedPerson = { ...person, number: newNumber }
        
        personService
          .update(person.id, modifiedPerson)
          .then(returnPerson => {
            setPersons(persons.map(pers => pers.id !== person.id ? pers : returnPerson))
            setNewName('')
            setNewNumber('')
            setNotification(
              `'${person.name}' updated`
            )
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(
              `'${person.name}' was already removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }
    else if (persons.find(person => person.number == newNumber))
    {
      alert(`${newNumber} is already added to phonebook`)
    }
    else {
        personService
        .create(person)
        .then(modifiedPersons => {
          setPersons(persons.concat(modifiedPersons))
          setNewName('')
          setNewNumber('')
          setNotification(
            `'${person.name}' added to phonebook`
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
    })
    }
    }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  } 
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value);
  }
  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotification(
            `'${person.name}' deleted from phonebook`
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }
  



  return (
    <div>
      <h2>Phonebook</h2>
      <PositiveNotification message={notification} />
      <Notification message={errorMessage} />
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h3>Add new contact</h3>
      <NewPersonForm newName ={newName} newNumber ={newNumber} addName ={addName} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <PersonsList persons={persons} filter={filter} handleDelete={handleDelete}/>
    </div>
  )
}

export default App