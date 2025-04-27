import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest){
    try {
        const {email, password} = await request.json();
        if(!email || !password){
            return NextResponse.json(
                {error: "Email and Password is required!"},
                {status: 400},
            )
        }
        await connectDB();
        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json(
                {error: "Email is Already registered."},
                {status: 400},
            ) 
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({email, password: hashedPassword});
        return NextResponse.json(
            {message: "User registered Successfully."},
            {status: 201},
        );
    } catch (error: any) {
        return NextResponse.json(
            {error: "Failed to register user."},
            {status: 500},
        );
    }
};
