const createUserId = () => {
    let id = 0;
    return () => ++id
}

module.exports = {
    createUserId,
}