const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      try {
        let query = {};

        if (args.genre) {
          query.genres = { $in: [args.genre] };
        }

        if (args.author) {
          const author = await Author.findOne({ name: args.author });
          if (author) {
            query.author = author._id;
          } else {
            return [];
          }
        }

        return await Book.find(query).populate('author');
      } catch (error) {
        throw new GraphQLError('Error fetching books', {
          extensions: {
            code: 'INTERNAL_SERVER_ERROR',
            error
          }
        });
      }
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      console.log('context', context)
      return context.currentUser
    },
    allGenres: async () => {
      const books = await Book.find({})
      const genres = books.reduce((acc, book) => {
        book.genres.forEach(genre => {
          if (!acc.includes(genre)) {
            acc.push(genre)
          }
        })
        return acc
      }, [])
      return genres
    }
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id })
      return books.length
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      // Input validation
      if (args.author.length < 3) {
        throw new GraphQLError('Author name must be at least 3 characters long', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args }
        })
      }

      if (args.title.length < 2) {
        throw new GraphQLError('Title must be at least 2 characters long', {
          extensions: { code: 'BAD_USER_INPUT', invalidArgs: args }
        })
      }

      let author
      let book

      try {
        author = await Author.findOne({ name: args.author })
        if (!author) {
          author = new Author({ name: args.author })
          await author.save()
        }

        book = new Book({ ...args, author: author._id })
        await book.save()
        const populatedBook = await book.populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: populatedBook })
        return populatedBook

      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const currentYear = new Date().getFullYear();
      if (!Number.isInteger(args.setBornTo) || args.setBornTo <= 0 || args.setBornTo > currentYear) {
        throw new GraphQLError('setBornTo must be a positive integer and a valid year', {
          extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs: args
          }
        })
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        console.log('Author not found')
        return null
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers
