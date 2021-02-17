const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs.gql')

module.exports = makeExecutableSchema({
  resolvers,
  typeDefs,
})