import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ALL_GENRES } from "../queries"
import { useState } from "react"

const Books = (props) => {
  const [ genre, setGenre ] = useState(null)
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: genre }
  })
  const genresResult = useQuery(ALL_GENRES)

  if(!props.show) {
    return null
  }

  if (booksResult.loading || genresResult.loading)  {
    return <div>loading...</div>
  }

  const books = booksResult.data.allBooks
  const genres = genresResult.data.allGenres
  // console.log('genres:', genres)
  // console.log('selected genre:', genre)
  // console.log('books:', books)

  return (
    <div>
      <h2>books</h2>
      {genre ? (
        <p>in genre <b>{genre}</b></p>
      ) : (
        <p>in all genres</p>
      )}

      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>{g}</button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
