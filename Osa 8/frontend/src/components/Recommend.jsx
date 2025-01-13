import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ME } from "../queries"
import { useEffect, useState } from "react"

const Recommend = (props) => {
  const meResult = useQuery(ME)
  const [favoriteGenre, setFavoriteGenre] = useState(null)

  useEffect(() => {
    if (meResult.data?.me) {
      setFavoriteGenre(meResult.data.me.favoriteGenre)
    }
  }, [meResult.data])

  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre
  })

  if (!props.show) {
    return null
  }

  if (meResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  if (meResult.error) {
    return <div>Error loading user data: {meResult.error.message}</div>
  }

  const books = booksResult.data.allBooks

  return (
    <div>
      <h2>books</h2>
      {favoriteGenre && <p>books in your favorite genre <b>{favoriteGenre}</b></p>}

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
    </div>
  )
}

export default Recommend
