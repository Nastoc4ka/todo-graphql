const Todo = {
  users: (parent, args, context) => {
    console.log('users parent', parent);
    return context.prisma.user.findMany({
      where: {
        todos: {
          some: {
            todo: { id: +parent.id }
          }
        }
      }
    });
  }
};

module.exports = {
  Todo
}
