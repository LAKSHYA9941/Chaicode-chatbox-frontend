import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // This is where you would typically make an API call to your backend
        // For now, we'll use a simple check
        if (credentials?.email === 'test@example.com' && credentials?.password === 'password') {
          return {
            id: '1',
            email: 'test@example.com',
            name: 'Test User'
          };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/Login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    }
  }
};

export default NextAuth(authOptions);
