const jql = require('graphql-tag');

const schema = jql`
type Query {
    helloWorld: String!
    users: [User!]!
    user(userId: ID!): User
    todos: [Todo!]!
    usersOnTodos: [UsersOnTodos!]
    me: User
}

type Mutation {
    signup(firstName:String!, email:String!, password:String!, age:Int): User
    login(email:String!, password:String!): User
    logout: Boolean
    deleteUser(userId: ID!): User
    createTodo(userIds: [ID!]!, name:String!): Todo
    deleteTodo(todoId: ID!): Todo
    updateUser(userId: ID!, input: UserInput!): User
    updateTodo(todoId: ID!, input: TodoInput!): Todo
    deleteTodos(todoIds: [ID!]!): BatchPayload
    resetTodos(todoIds: [ID!]!): BatchPayload
}

type BatchPayload {
    count: Int!
}

input UserInput {
    firstName: String
    email: String
    age: Int
}

input TodoInput {
    isComplete: Boolean
    name: String
}

type User {
    id: ID!
    firstName: String!
    email: String!
    age: Int
    todos: [Todo!]!
}

type Todo {
    id: ID!
    name: String!
    isComplete: Boolean
    users: [User!]!
}

type UsersOnTodos {
    userId: ID!
    todoId: ID!
}`

module.exports = {
  schema,
}