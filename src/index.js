const { GraphQLServer } = require('graphql-yoga');
const { resolvers } = require('./resolvers');

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
});

server.start(() => console.log('server is running on localhost:4000'));