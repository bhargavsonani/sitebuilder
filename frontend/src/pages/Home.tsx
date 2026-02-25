// import api from '@/configs/axios';
// import { useAuth } from '@/contexts/AuthContext';
// import { Loader2Icon } from 'lucide-react';
// import React from 'react'
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';

// function getCookie(name: string) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
//   return null;
// }
// const home = () => {
    
//   const [input, setInput] = React.useState('');
//   const [loading, setLoading] = React.useState(false);
//   const { user, signOut } = useAuth();
//   const navigate = useNavigate();

//   const authSession = getCookie('auth_session');
//   console.log(authSession); // This will log the value of the auth_session cookie

  


//   const onSubmitHandler = async (e : React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if(!user){
//         return toast.error("Please sign in to create a project")
//       }
//       else if(!input.trim()){
//         return toast.error('Please enter a message');
//       }
//       setLoading(true);
//       const {data} = await api.post('/api/user/project',{initial_prompt: input});
//       setLoading(false);
//       if (data.success && data.data?.projectId) {
//         navigate(`/projects/${data.data.projectId}`)
//       } else {
//         toast.error("Failed to create project: Invalid response");
//       }

//     } catch (error: any) {
//       setLoading(false);
//       toast.error(error?.response?.data?.message || error.message);
//       console.log("error during genrate project______________")

//     }
    

//   }
//   return (
//     <>
    
//       <section className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins">
//           {/* BACKGROUND IMAGE */}

//         <a href="https://prebuiltui.com" className="flex items-center gap-2 border border-slate-700 rounded-full p-1 pr-3 text-sm mt-20">
//           <span className="bg-indigo-600 text-xs px-3 py-1 rounded-full">NEW</span>
//           <p className="flex items-center gap-2">
//             <span>Try 30 days free trial option</span>
//             <svg className="mt-px" width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m1 1 4 3.5L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
//           </p>
//         </a>

//         <h1 className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl">
//           Turn thoughts into websites instantly, with AI.
//         </h1>

//         <p className="text-center text-base max-w-md mt-2">
//           Create, customize and publish websites than ever with intelligent design powered by AI.
//         </p>

//         <form onSubmit={onSubmitHandler} className="bg-white/10 max-w-2xl w-full rounded-xl p-4 mt-10 border border-indigo-600/70 focus-within:ring-2 ring-indigo-500 transition-all">
//           <textarea onChange={e => setInput(e.target.value)} className="bg-transparent outline-none text-gray-300 resize-none w-full" rows={4} placeholder="Describe your presentation in details" required />
//           <button className="ml-auto flex items-center gap-2 bg-gradient-to-r from-[#CB52D4] to-indigo-600 rounded-md px-4 py-2">
//             {!loading ? 'Create with AI' : (
//                 <>
//                     Creating <Loader2Icon className="animate-spin text-white ml-2 h-4 w-4" />
//                 </>
//             )}
//           </button>
//         </form>

//         <div className="flex flex-wrap items-center justify-center gap-16 md:gap-20 mx-auto mt-16">
//           <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/framer.svg" alt="" />
//           <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/huawei.svg" alt="" />
//           <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/instagram.svg" alt="" />
//           <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/microsoft.svg" alt="" />
//           <img className="max-w-28 md:max-w-32" src="https://saasly.prebuiltui.com/assets/companies-logo/walmart.svg" alt="" />
//         </div>
//       </section>
//     </>
//   )
// }

// export default home

import Footer from "@/components/Footer";
import api from "@/configs/axios";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Home: React.FC = () => {
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const onSubmitHandler = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!user) {
      return toast.error("Please sign in to create a project");
    }

    if (!input.trim()) {
      return toast.error("Please enter a message");
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/api/user/project",
        { initial_prompt: input }
      );

      if (data.success && data.data?.projectId) {
        navigate(`/projects/${data.data.projectId}`);
      } else {
        toast.error("Failed to create project");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

return (
  <>
  <section className="flex flex-col items-center text-white pb-24 px-4 sm:px-6 lg:px-8">
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-24 text-center leading-tight">
      Turn thoughts into websites instantly
    </h1>

    <p className="mt-4 text-gray-300 text-center max-w-xl">
      Describe your idea and let AI transform it into a real website.
    </p>

    <form
      onSubmit={onSubmitHandler}
      className="w-full max-w-2xl mt-12 rounded-2xl 
                 bg-white/10 backdrop-blur-xl 
                 border border-white/10
                 shadow-xl p-5 sm:p-6"
    >
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        className="w-full bg-transparent resize-none 
                   text-gray-200 placeholder-gray-400
                   outline-none rounded-lg
                   focus:ring-2 focus:ring-indigo-500/60
                   transition p-2"
        placeholder="Describe your website idea..."
      />

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex items-center gap-2
                     bg-indigo-600 hover:bg-indigo-700
                     active:scale-95
                     disabled:opacity-60 disabled:cursor-not-allowed
                     px-5 py-2.5 rounded-lg
                     font-medium
                     shadow-lg shadow-indigo-600/30
                     transition-all duration-200"
        >
          {loading ? (
            <>
              Creating
              <Loader2Icon className="animate-spin h-4 w-4" />
            </>
          ) : (
            "Create with AI"
          )}
        </button>
      </div>
    </form>
  </section>
  <Footer/>
  </>
);
};

export default Home;