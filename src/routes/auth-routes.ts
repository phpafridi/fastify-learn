import type {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyRequest,
    FastifyReply,
} from "fastify"
import fp from "fastify-plugin"

import { loginSchema, loginSchemaType, registerSchema, type registerSchemaType } from "../validations/auth-validation.js"
import { comparePasswords, hashPassword } from "../utils/helper.js"

const authRoutes = async (
    app: FastifyInstance,
    opts: FastifyPluginOptions
) => {
    app.post(
        "/register",
        { schema: { body: registerSchema } },
        async (req: FastifyRequest, reply: FastifyReply) => {
            const body = req.body as registerSchemaType

            const isUserExist = await app.prisma.user.findUnique({
                where: { email: body.email },
            })

            if (isUserExist) {
                return reply.status(409).send({ message: "User already exists." })
            }

            await app.prisma.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    password: await hashPassword(body.password),
                },
            })

            return reply.send({ message: "Register user successfully" })
        }
    )

    app.post('/login', { schema: { body: loginSchema } }, async (req: FastifyRequest, reply: FastifyReply) => {
        const body = req.body as loginSchemaType
        const user = await app.prisma.user.findUnique({
            where: { email: body.email }
        })

        if (!user) {
            return reply.status(401).send({ message: "Invalid credentails." })
        }

        const isPasswordValid = await comparePasswords(body.password, user.password)

        if (!isPasswordValid) {
            return reply.status(401).send({ message: "Invalid credentails." })
        }

        //jwt token
        const payload = {
            name: user.name,
            email: user.email,
            id: user.id
        }
        const token = app.jwt.sign(payload)

        return reply.send({ message: "Logged In Successful!", user : {...payload,token} })

    })

        app.get('/test', async (req: FastifyRequest, reply: FastifyReply) => {
        console.log('✅ Test endpoint hit from IP:', req.ip);
        return reply.send({ 
            success: true,
            message: 'Auth server is working!',
            timestamp: new Date().toISOString(),
            clientIp: req.ip,
            endpoints: ['/register', '/login', '/test']
        });
    });
}

export default fp(authRoutes)
