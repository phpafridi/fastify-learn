import type {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyRequest,
    FastifyReply,
} from "fastify"


const userRoutes = async (
    app: FastifyInstance,
    opts: FastifyPluginOptions
) => {
    app.get('/user',async(req:FastifyRequest,reply:FastifyReply)=>{
         return reply.send({message : "User Find" , user : req.user})
    })

    app.get('/allUsers',async(req:FastifyRequest,reply:FastifyReply)=>{
         const users = await app.prisma.user.findMany({
            select : {
                name : true,
                email : true
            }
         })
         return reply.status(200).send({data:users})
    })
}

export default userRoutes;