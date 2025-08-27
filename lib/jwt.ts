import jwt, { SignOptions } from 'jsonwebtoken';

interface JWTPayload {
    user: string;
    iat?: number;
    exp?: number;
}

export function generateToken(payload: JWTPayload): string {
    try {
        const secretKey = process.env.SECRET_KEY || "rootSecretKey";
        const expiresIn: SignOptions["expiresIn"] = (process.env.JWT_EXPIRATION as SignOptions["expiresIn"]) || "1h";
        const options: SignOptions = { expiresIn };
        return jwt.sign({ ...payload }, secretKey, options);
    } catch (error) {
        console.error('Token generation error:', error);
        throw error;
    }
}

export function verifyToken(token: string): Promise<JWTPayload> {
    const secret = process.env.SECRET_KEY || 'rootSecretKey';
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded as JWTPayload);
            }
        });
    });
}