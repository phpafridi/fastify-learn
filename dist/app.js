import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import authRoutes from "./routes/auth-routes.js";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import dbPlugin from "./plugins/db-plugin.js";
import jwtOptions from "./utils/jwt-token.js";
import userRoutes from "./routes/user-routes.js";
const app = fastify({
    logger: true
}).withTypeProvider();
app.register(cors);
app.register(helmet);
app.register(dbPlugin);
app.register(jwt, jwtOptions);
//app.register(authPlugin)
app.register(authRoutes);
app.register(userRoutes);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.get("/", async (request, response) => {
    return { hello: "world" };
});
app.setErrorHandler(function (error, validation, reply) {
    if ('validation' in error && Array.isArray(error.validation)) {
        const validationIssue = error.validation;
        const errors = validationIssue.map((issue) => ({
            field: issue.instancePath.substring(1),
            message: issue.message
        }));
        reply.status(422).send({
            message: "Please pass all required fields.",
            errors
        });
    }
});
export default app;
