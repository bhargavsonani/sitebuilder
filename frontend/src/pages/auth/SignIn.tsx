// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { Loader2 } from "lucide-react";

// const SignIn = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const { signIn } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       await signIn(email, password);
//       navigate("/projects");
//     } catch (err: any) {
//       setError(err.message || "Failed to sign in");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <div className="max-w-md w-full space-y-8 p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
//             Sign in to your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-300">
//             Or{" "}
//             <Link
//               to="/auth/signup"
//               className="font-medium text-indigo-400 hover:text-indigo-300"
//             >
//               create a new account
//             </Link>
//           </p>
//         </div>

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           <div className="space-y-4">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-300">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="Enter your email"
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-300">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-400 text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="Enter your password"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="animate-spin h-5 w-5 mr-2" />
//                   Signing in...
//                 </>
//               ) : (
//                 "Sign in"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignIn;


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-[#020617]">
      {/* Aurora background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md p-8 space-y-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-[fadeIn_0.6s_ease-out]">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Sign in
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Or{" "}
            <Link
              to="/auth/signup"
              className="font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hover:opacity-80"
            >
              create a new account
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-xl px-4 py-3 text-sm bg-red-500/10 text-red-300 border border-red-500/30">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 transition"
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-white/20 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
