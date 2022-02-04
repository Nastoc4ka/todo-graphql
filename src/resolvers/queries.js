const Query = {
  helloWorld: () => 'hiiii world',
    users: (parent, args, context) => {
    return context.prisma.user.findMany();
  },
    user: (parent, args, context) => {
    return context.prisma.user.findUnique({
      where: {
        id: +args.userId
      }
    });
  },
    usersOnTodos: (parent, args, context) => {
    return context.prisma.usersOnTodos.findMany();
  },
    todos: (parent, args, context) => {
    return context.prisma.todo.findMany();
  },
    me:  (parent, args, context) => {
    console.log('context.getUser()', context.getUser())
    if(context.getUser()) {
      return context.getUser();
    }
  }
};

module.exports = { Query }
