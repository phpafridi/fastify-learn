import z from "zod";

export const registerSchema = z.object({
    name : z.string().min(2).max(100),
    email : z.email(),
    password : z.string().min(2).max(100)
})

export const loginSchema = z.object({
    email : z.email(),
    password : z.string().min(2).max(100)
})



export type registerSchemaType = z.infer<typeof registerSchema>
export type loginSchemaType = z.infer<typeof loginSchema>