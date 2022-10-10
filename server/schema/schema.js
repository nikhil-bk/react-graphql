const graphql = require('graphql');
const { mutation } = require('./mutation');
const { GraphQLSchema } = graphql;

const RootQuery = require('./queries/root_query');

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
