import bcrypt from "bcryptjs";
import mongoose, { Schema, model, models } from "mongoose";
import jwt from "jsonwebtoken";

export interface IUser {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    hashPassword(password: string): Promise<string>;
    isValidPassword(password: string): Promise<boolean>;
    generateJWT(): string;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});


userSchema.methods.hashPassword = async function(password: string) {
    const saltRounds = process.env.HASH_ROUNDS ? parseInt(process.env.HASH_ROUNDS) : 10; // Default value 10
    return bcrypt.hash(password, saltRounds);
};

userSchema.methods.isValidPassword = async function(password: string) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWT = function() {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    return jwt.sign(
        { email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
};

const User = models.User || model<IUser>("User", userSchema);

export default User;
