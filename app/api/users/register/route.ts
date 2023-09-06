import UserAccount from "@/models/userAccount"
import { connectToDB } from "@/utils/database"
import bcrypt from "bcrypt";

export const POST = async (req: any) => {
    const { email, username, password } = await req.json()

    if(!(email && password && username)){
        return new Response("Invalid user details", { status: 400 })
    }

    try {
        await connectToDB()
        
        const emailExists = await UserAccount.findOne({
            email: email
        })

        if (emailExists) {
            return new Response("Email already exists", { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new UserAccount({
            email: email,
            username: username,
            hashedPassword: hashedPassword
        })
        await newUser.save()

        return new Response("User registered successfully", { status: 200 })
    }
    catch (error) {
        return new Response("Failed to register user", { status: 500 })
    }
}