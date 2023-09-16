import prisma from "@/../prisma/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import Stripe from "stripe";

export const authOptions:NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks:{
    async session({ session, user }) {
      session!.user!.id = user.id;
      session!.user!.stripeCustomerId = user.stripeCustomerId;
      session!.user!.isActive = user.isActive;
      return session;
    },
  },
  events:{
    createUser: async ({ user }) => {

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2022-11-15",
      });

      await stripe.customers.create({
        email: user.email!,
        name: user.name!,
      })
      .then( async (customer) => {
        return prisma.user.update({
          where: { id: user.id },
          data: {
            stripeCustomerId: customer.id,
          },
        });
      })
    }
  }
}
