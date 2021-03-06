import dotenv from 'dotenv'
dotenv.config()

export const PORT = 4000
export const JWT_SECRET = process.env.JWT_SECRET || 'Super Secure JWT Secret'
export const SALT_NUMBER = 10
