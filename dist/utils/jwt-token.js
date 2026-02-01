const jwtOptions = {
    secret: process.env.JWT_SECRET || "YOUR-KEY",
    sign: {
        expiresIn: "7d",
        algorithm: "HS256"
    }
};
export default jwtOptions;
