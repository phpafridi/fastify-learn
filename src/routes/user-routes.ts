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
}

export default userRoutes;