import { useQuery } from "@apollo/client"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"
import { useMutation } from '@apollo/client'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  if(!props.show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  const submit = async (event) => {
    event.preventDefault()
    console.log('update author...')
    editAuthor({
      variables: {
        name: event.target.name.value,
        setBornTo: parseInt(event.target.born.value)
      }
    })
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <label>Select author</label>
        <select id="name">
          {result.data.allAuthors.map((a) => (
            <option key={a.name}>{a.name}</option>
          ))}
        </select>
        <br />
        <label>born</label>
        <input id="born" type="number" />
        <br />
        <button>update author</button>
      </form>
    </div>
  )
}

export default Authors
