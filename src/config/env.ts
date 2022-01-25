import dotenv from 'dotenv'
dotenv.config()

export const PORT = Number(process.env.PORT) || 4000
export const JWT_SECRET = process.env.JWT_SECRET || 'Super Secure JWT Secret'
