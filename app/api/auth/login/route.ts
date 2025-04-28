import User from "@/models/User.model";
import connectDB from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {
        await connectDB();
        const {email, password} =await request.json();
        if(!email || !password){
            return NextResponse.json(
                {error: "Email and Password is required."},
                {status: 400},
            );
        }
        const user = await User.findOne({email});

        if(!user){
            return NextResponse.json(
                {message: "User not yet Registered."},
                {status: 400},
            );
        }

        const isCorrectPassword =await user.isValidPassword(password);

        if(!isCorrectPassword){
            return NextResponse.json(
                {message: "wrong Password"},
                {status: 400},
            );
        }

        const token =await user.generateJWT();
        return NextResponse.json(
            {
                message: "User Logged in Successfully.",
                token: token,
            },
            {status: 200},
        )
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json(
            {error: "Error Occured while login."},
            {status: 500},
        );
    }

}