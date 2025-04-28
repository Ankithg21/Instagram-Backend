import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextRequest {
    user?: string; // you can type this properly if you want
}

export async function authenticate(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("Unauthorized: No token provided");
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized: Token Missing" },
                { status: 401 }
            );
        }

        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret);

        let userEmail: string | undefined;

        if (typeof decoded === 'string') {
            userEmail = decoded; 
        } else if ((decoded as JwtPayload).email) {
            userEmail = (decoded as JwtPayload).email;
        } 

        (request as AuthenticatedRequest).user = userEmail;

        return null; // null means no error, move ahead
    } catch (error) {
        console.log("Authentication Error:", error);
        return NextResponse.json(
            { error: "Unauthorized: Invalid Token" },
            { status: 401 }
        );
    }
}
