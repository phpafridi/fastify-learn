import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import helmet from "@fastify/helmet";
import authRoutes from "./routes/auth-routes.js";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {serializerCompiler,validatorCompiler} from "fastify-type-provider-zod"
import dbPlugin from "./plugins/db-plugin.js";
import jwtOptions from "./utils/jwt-token.js";
import userRoutes from "./routes/user-routes.js";
import authPlugin from "./plugins/auth-plugin.js";

const app = fastify({
    logger: true
}).withTypeProvider<ZodTypeProvider>();

app.register(cors);
app.register(helmet);
app.register(dbPlugin);
app.register(jwt,jwtOptions);
app.register(authPlugin)
app.register(authRoutes);
app.register(userRoutes);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/", async (request, response) => {
    return { hello: "world" };
});

app.setErrorHandler(function(error:any,validation,reply){
     if('validation' in error && Array.isArray((error as any).validation)){
               const validationIssue = (error as any).validation;
               const errors = validationIssue.map((issue:{instancePath:string,message:string})=>({
                     field:issue.instancePath.substring(1),
                     message : issue.message
               }))

               reply.status(422).send({
                  message : "Please pass all required fields.",
                  errors
               })
     }
})

export default app;