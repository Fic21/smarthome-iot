import jwt from 'jsonwebtoken'

nterface UserPayLoad{
    id:number;
    email:string;
}

export function generateToken(user: UserPayLoad): string {
    return jwt.sign(user, process.env.JWT_SECRET as string,{
        expiresIn: '7d',
    });
    
}