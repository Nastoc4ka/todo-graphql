const User = {
  todos: (parent, args, context) => {
    console.log('User', parent);
    return context.prisma.todo.findMany({
      where: {
        users: {
          some: {
            user: { id: +parent.id }
          }
        }
      }
    })
  }
};

module.exports = {
  User
}
