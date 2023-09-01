import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import UserAccount from "@/models/userAccount";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from '@/utils/database';
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text", placeholder: "John Smith" },
      },
      async authorize(credentials) {
        if (credentials) {
          await connectToDB();

          if (!credentials.email || !credentials.password) {
            throw new Error('Please enter an email and password')
          }
          // check to see if user exists
          const user = await UserAccount.findOne({
            email: credentials.email
          });
          // if no user was found 
          if (!user || !user?.hashedPassword) {
            throw new Error('No user found')
          }
          // check to see if password matches
          const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)

          // if password does not match
          if (!passwordMatch) {
            throw new Error('Incorrect password')
          }

          return user;
        }
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await UserAccount.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        if (credentials) {
          return true
        }
        
        await connectToDB();

        const userExists = await UserAccount.findOne({ email: profile.email });
        if (!userExists) {
          await UserAccount.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }

        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    }
  }
})

export { handler as GET, handler as POST }