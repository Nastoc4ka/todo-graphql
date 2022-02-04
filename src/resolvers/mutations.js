const bcrypt = require("bcryptjs");

const Mutation = {
  signup: async (parent, args, context) => {
    const password = await bcrypt.hash(args.password, 10);
    console.log('password crypted', password);
    await context.prisma.user.create({
      data: {
        firstName: args.firstName,
        email: args.email,
        password,
        age: +args.age,
      }
    });
    const { user } = await context.authenticate("graphql-local", {
      email: args.email,
      password: args.password,
    });

    context.login(user);

    return user
  },
    login: async (parent, { email, password }, context) => {
    const { user } = await context.authenticate("graphql-local", {
      email,
      password
    });
    // context.res.cookie('cookie', 'cookie');
    // console.log('login user', user);
    context.login(user);

    return user
  },
    logout: (parent, args, context) => context.logout(),
    deleteUser: (parent, args, context) => {
    return context.prisma.user.delete({
      where: {
        id: +args.userId
      }
    });
  },
    updateUser: (parent, args, context) => {
    return context.prisma.user.update({
      where: {
        id: +args.userId
      },
      data: {
        ...args.input
      }
    });
  },
    createTodo: async (parent, args, context) => {
    return context.prisma.todo.create({
      data: {
        name: args.name,
        users: {
          create: args.userIds.map(userId => ({
            user: {
              connect: { id: +userId }
            }
          }))
        }
      },
    })
  },
    deleteTodo: (parent, args, context) => {
    return context.prisma.todo.delete({
      where: {
        id: +args.todoId
      }
    })
  },
    deleteTodos: (parent, args, context) => {
    const todoIds = args.todoIds.map(id => +id);
    return context.prisma.todo.deleteMany({
      where: {
        id: {
          in: todoIds,
        }
      }
    })
  },
    updateTodo: (parent, args, context) => {
    return context.prisma.todo.update({
      where: { id: +args.todoId },
      data: { ...args.input }
    })
  },
    resetTodos: (parent, args, context) => {
    const todoIds = args.todoIds.map(id => +id);
    return context.prisma.todo.updateMany({
      where: {
        id: { in: todoIds }
      },
      data: { isComplete: false }
    })
  }
};

module.exports = { Mutation }
