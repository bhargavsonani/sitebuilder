// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { client } from "../db"; // your mongodb client
// import 'dotenv/config'
// const trustedOrigins = process.env.TRUSTED_ORIGINS?.split(",") || []


// export const auth = betterAuth({
//     database: mongodbAdapter(client),
//     emailAndPassword: { 
//     enabled: true, 
//   }, 
//     trustedOrigins,
//    baseUrl : process.env.BETTER_AUTH_URL!,
//     secret :  process.env.BETTER_AUTH_SECRET!, 
//     advanced : {
//         cookies : {
//             session_token : {
//                 name : 'auth_session',
//                 attributes : {
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === 'production',
//                     sameSite : 'none',
//                     path: '/',

//                 }
//             }
//         }
//     }

// });

// This file is kept for better-auth compatibility if needed
// The main authentication is now handled by the custom auth system in:
// - routes/auth.routes.ts
// - controllers/auth.controller.ts
// - services/auth.service.ts
// - middleware/auth.middleware.ts

// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import mongoose from "mongoose";
// import "dotenv/config";

// const trustedOrigins =
//   process.env.TRUSTED_ORIGINS?.split(",") || [];

// // Create MongoDB client for better-auth
// const client = mongoose.connection;

// export const auth = betterAuth({
//   database: mongodbAdapter(client),

//   emailAndPassword: {
//     enabled: true,
//   },

//   trustedOrigins,

//   baseUrl: process.env.BETTER_AUTH_URL!,
//   secret: process.env.BETTER_AUTH_SECRET!,

//   advanced: {
//     cookies: {
//       session_token: {
//         name: "auth_session",
//         attributes: {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           sameSite: "none",
//           path: "/",
//         },
//       },
//     },
//   },
// });
