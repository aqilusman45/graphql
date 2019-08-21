const expressGraphQL = require("express-graphql"); //  driver for Graphql user interface
const {
  GraphQLSchema, // this is a constructor that returns the schema object containing query
  // name and data that is being returned.
  GraphQLObjectType, // graphql is strongly typed that is why we need types object.
  GraphQLString, // similar this tells graphql that the requested object is a string
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull
} = require("graphql");

// to work with graphql, we can use graphql playground using express-graphql library
// To get graphql playground up and running we need two things

// # 1 Schema
// # 2 Graphql GUI

// first we need to define a schema.
// Schema is a group or list of properties associated to an entity
// in our case we need to get data related to books
// Following is the schema for the data

const authors = [
  { id: 1, name: "J. K. Rowling" },
  { id: 2, name: "J. R. R. Tolkien" },
  { id: 3, name: "Brent Weeks" }
];

const books = [
  { id: 1, name: "Harry Potter and the Chamber of Secrets", authorId: 1 },
  { id: 2, name: "Harry Potter and the Prisoner of Azkaban", authorId: 1 },
  { id: 3, name: "Harry Potter and the Goblet of Fire", authorId: 1 },
  { id: 4, name: "The Fellowship of the Ring", authorId: 2 },
  { id: 5, name: "The Two Towers", authorId: 2 },
  { id: 6, name: "The Return of the King", authorId: 2 },
  { id: 7, name: "The Way of Shadows", authorId: 3 },
  { id: 8, name: "Beyond the Shadows", authorId: 3 }
];

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author of the book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(BookType),
      resolve: author => {
        // const bookList = [];
        // books.map((book, index) => {
        //   if (book.authorId === author.id) {
        //     bookList.push(book);
        //   }
        // });
        // return bookList; // verbose approach
        // BETTER APPROACH
        return books.filter(books => books.authorId === author.id);
      }
    }
  })
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLString) },
    author: {
      type: AuthorType,
      resolve: book => {
        return authors.find(author => author.id === book.authorId);
      }
    }
  })
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      // get all books
      type: new GraphQLList(BookType), // custom type for the feilds
      description: "List of Books",
      resolve: () => books
    },
    authors: {
      // get all authors
      type: new GraphQLList(AuthorType),
      description: "List of Authors",
      resolve: () => authors
    },
    book: {
      type: BookType, // custom type for the feilds
      description: "Get single book",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    author: {
      type: AuthorType,
      description: "Get Single Author",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    }
  })
});

// GraphQLNonNull IS FOR DATA THAT CANT BE NULL
// GraphQLObjectType IS QUERY OBJECT

// MUTATION, SAME AS POST, PUT, DELETE FOR GRAPGHQL
// Define a new object which is a mutation query

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Mutation Query",
  fields: () => ({
    addBook: {
      // name of the function to add book
      type: BookType, // type of properties
      description: "Add a book",
      args: {
        // arguments contain data from which the book will be created
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          author: args.author
        };
        books.push(book);
        return book;
      }
    },
    addAuthor: {
      // name of the function to add author
      type: AuthorType, // type of properties
      description: "Add an Author",
      args: {
        // arguments contain data from which the author will be created
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
        };
        authors.push(author);
        return author;
      }
    }
  }),

});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

// Sample first query
// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//       name: "HelloWorld",
//       fields: () => ({
//         message: {
//           type: GraphQLString,
//           resolve: () => "hello world"
//         }
//       })
//     })
//   });

exports.startGraphQL = expressGraphQL({
  schema: schema,
  graphiql: true
});
