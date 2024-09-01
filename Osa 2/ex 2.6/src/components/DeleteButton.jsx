import services from '../services/persons'

const DeleteButton = ({person, deletePerson}) => {
  const handlePress = () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      console.log("Confirmed deletion")
      services.deletePerson(person.id)
        .then(deletePerson)
    }
  }

  return(
    <button onClick={handlePress}>Deleto</button>
  )
}

export default DeleteButton