import bcrypt from "bcrypt"

export const hashPassword = async(password : string): Promise<string> => {
       const salt = await bcrypt.genSalt(10);
       return bcrypt.hash(password,salt);
}

export const comparePasswords = async(password:string,hashPassword:string): Promise<boolean> => {
    return bcrypt.compare(password,hashPassword);
}