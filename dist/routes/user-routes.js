const userRoutes = async (app, opts) => {
    app.get('/user', async (req, reply) => {
        return reply.send({ message: "User Find", user: req.user });
    });
    app.get('/allUsers', async (req, reply) => {
        const users = await app.prisma.user.findMany();
        return reply.status(200).send({ data: users });
    });
};
export default userRoutes;
