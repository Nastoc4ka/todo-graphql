const { Query } = require('./resolvers/queries');
const { Todo } = require('./resolvers/todo');
const { User } = require('./resolvers/user');
const { Mutation } = require('./resolvers/mutations');

const resolvers = {
    Query,
    Todo,
    User,
    Mutation
}

module.exports = {
    resolvers
}