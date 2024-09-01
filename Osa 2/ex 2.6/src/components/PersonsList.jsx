import DeleteButton from "./DeleteButton";

const PersonsList = ({ persons, filter, deletePerson }) => {
  return (
    <div>
        {persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
        .map(person => 
          <div key={person.name}>
            {person.name} {person.number}
            <DeleteButton person={person} deletePerson={deletePerson}/>
          </div>
        )}
    </div>
  )
}

export default PersonsList;