import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { password } = credentials || {};
                if (password === process.env.AUTH_PASSWORD) {
                    return { id: 1, name: "Admin" }; // Return user object on success
                }
                throw new Error("Invalid password");
            },
        }),
    ],
    pages: {
        signIn: "/admin-login", // Custom sign-in page
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
