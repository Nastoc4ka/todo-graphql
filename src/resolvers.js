const { users } = require('./data/users');
const { todos } = require('./data/todos');
const { usersOnTodos } = require('./data/usersOnTodos');
const { createUserId } = require('./utils');

const incUserId = createUserId();

const resolvers = {
    Query: {
        helloWorld: () => 'hiiii world',
        users: (parent, args, context, info) => {

            if(!args.text) return users;

            return users.filter(user => user.firstName.toLowerCase().includes(args.text))
        },
        user: (parent, args, context, info) => {
            return users.find(user => {
                if(user.id === args.userId) {
                    return user
                }

                if(user.firstName === args.name) {
                    return user
                }
            })
        },
        todos: (parent, args, context, info) => todos,
    },
    Mutation: {
        createUser: (parent, args, context, info) => {
            const emailIsExist = users.some(({email}) => email === args.email);
            if(emailIsExist) {
                throw new Error('User with this email is already exist')
            }
            const newUser = {
                id: incUserId(),
                firstName: args.firstName,
                email: args.email,
            }
            users.push(newUser);
            return newUser
        },
        deleteUser: (parent, args, context, info) => {
            let user;
            const userToRemove = users.findIndex(el => {
                if(el.id == args.userId) {
                    user = el
                    return true
                }
                return false
            });

            if(user) {
                users.splice(userToRemove, 1);
                return user
            }
            return user
        },
        updateUser: (parent, args, context, info) => {
            const userIdx = users.findIndex(el => el.id == args.userId);
            if(userIdx !== -1) {
                users[userIdx] = { ...users[userIdx], ...args.input };
                return users[userIdx];
            }
            return 'no user found'
        },
        createTodo: (parent, args) => {
            const newTodo = {
                id: incUserId(),
                name: args.name,
                isComplete: false,
                userId: args.userId
            }
            todos.push(newTodo);
            return newTodo
        },
        deleteTodo: (parent, args) => {
            let task;
            const taskToRemove = todos.findIndex(el => {
                if(el.id == args.todoId) {
                    task = el;
                    return true;
                }
                return false;
            });
            task ? todos.splice(taskToRemove, 1): '';
            return task;
        },
    },
    User: {
        id: (parent) => parent.id,
        firstName: (parent) => {
            console.log('parent is ', parent);
            return parent.firstName;
        },
        email: (parent) => parent.email,
        age: (parent) => parent.age,
        todos: (parent) => {
            const todoIds = [];
            usersOnTodos.forEach(el => {
                if(el.userId == parent.id) {
                    todoIds.push(el.todoId);
                }
            });
            return todos.filter(task => todoIds.includes(task.id));
        },
    },
    Do: {
        users: (parent) => {
            console.log('parent is ', parent);
            const usersIds = [];
            usersOnTodos.forEach(el => {
                if(el.todoId == parent.id) {
                    usersIds.push(el.userId);
                }
            })
            return users.filter(user => usersIds.includes(user.id));
        }
    }
}

module.exports = {
    resolvers
}