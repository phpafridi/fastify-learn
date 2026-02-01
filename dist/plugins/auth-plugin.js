import fp from "fastify-plugin";
const publicRoutes = ["/login", "/register"];
const authPlugin = async (fastify, opts) => {
    fastify.addHook('onRequest', async (req, reply) => {
        if (!publicRoutes.includes(req.url)) {
            const token = req.headers["authorization"]?.split(" ")[1];
            if (!token) {
                return reply.status(401).send({ message: "Unauthorized." });
            }
            try {
                const user = fastify.jwt.verify(token);
                req.user = user;
            }
            catch (error) {
                return reply.status(401).send({ message: "Unauthorized." });
            }
        }
    });
};
export default fp(authPlugin);
