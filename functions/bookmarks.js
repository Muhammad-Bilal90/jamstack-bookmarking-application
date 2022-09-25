const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require("faunadb"),
  q = faunadb.query
  
const dotenv = require("dotenv");
dotenv.config();

var client = new faunadb.Client({
  secret: process.env.FAUNADB_ADMIN_SECRET,
})

const typeDefs = gql`
  type Query {
    getBookmarks: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    title: String!
    url: String!
    desc: String!
  }
  type Mutation{
    addBookmark(title: String!, url: String!, desc: String!):Bookmark
    removeBookmark(id: ID!): Bookmark
}
`

const resolvers = {
  Query: {
    getBookmarks: async (root, args) => {

      try {

        const result = await client.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection('links'))),
            q.Lambda('link', q.Get(q.Var('link')))
          )
        )

        return result.data.map(d => (
          {
            id: d.ref.id,
            title: d.data.title,
            url: d.data.url,
            desc: d.data.desc
          }
        ))
      }
      catch (e) {

        return e.toString()
      }
    },
  },
  Mutation: {
    addBookmark: async (root, {title,url, desc}) => {
      try{
        const result = await client.query(
          q.Create(q.Collection('links'),
          { data: {
            title,
            url,
            desc
          } })
        )
      }catch(e){
        console.log('Error: ');
        console.log(e);
      }
    },
    removeBookmark: async (_, {id}) => {
      try {
        console.log(id)
        var client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });
        const result = await client.query(
            q.Delete(
                q.Ref(q.Collection("links"), id)
            )
        )
        
        return {
            id : result.ref.id,
            title: result.data.title,
            url: result.data.url,
            desc: result.data.desc
        }
      }
      catch(err){
          return err.toString()
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
})

const handler = server.createHandler()

module.exports = { handler }
