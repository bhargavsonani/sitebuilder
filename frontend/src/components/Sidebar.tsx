// import React, { useEffect, useRef, useState } from 'react'
// import type { Message, Project, Version } from '../types'
// import { BotIcon, EyeIcon, Loader2Icon, SendIcon, UserIcon } from 'lucide-react'
// import { Link } from 'react-router-dom'

// interface SidebarProps {
//   isMenuOpen: boolean
//   project: Project
//   setProject: (project: Project) => void
//   isGenerating: boolean
//   setIsGenerating: (isGenerating: boolean) => void
// }

// const Sidebar = ({
//   isMenuOpen,
//   project,
//   setProject,
//   isGenerating,
//   setIsGenerating,
// }: SidebarProps) => {
//   const messageRef = useRef<HTMLDivElement>(null)
//   const [input, setInput] = useState('')

//   const handleRollback = (versionId: string) => {}

//   const handleRevisions = (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!input.trim()) return

//     // Create user message
//     const userMessage: Message = {
//       id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//       role: 'user',
//       content: input.trim(),
//       timestamp: new Date().toISOString()
//     }

//     // Add user message to conversation
//     const updatedProject = {
//       ...project,
//       conversation: [...(project.conversation || []), userMessage],
//       updatedAt: new Date().toISOString()
//     }
//     setProject(updatedProject)
//     setInput('') // Clear input

//     setIsGenerating(true)

//     // Simulate API call and bot response
//     setTimeout(() => {
//       const botMessage: Message = {
//         id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
//         role: 'assistant',
//         content: 'I understand your request. Let me update the website accordingly.',
//         timestamp: new Date().toISOString()
//       }

//       // Add bot response to conversation
//       const finalProject = {
//         ...updatedProject,
//         conversation: [...updatedProject.conversation, botMessage],
//         updatedAt: new Date().toISOString()
//       }
//       setProject(finalProject)
//       setIsGenerating(false)
//     }, 3000)
//   }

//   useEffect(() => {
//     if (messageRef.current) {
//       messageRef.current.scrollIntoView({ behavior: 'smooth' })
//     }
//   }, [project.conversation?.length, isGenerating])

//   return (
//     <div
//       className={`h-full sm:max-w-sm rounded-xl bg-gray-900 border-gray-800 transition-all ${
//         isMenuOpen ? 'max-sm:w-0 overflow-hidden' : 'w-full'
//       }`}
//     >
//       <div className="flex flex-col h-full">
//         <div className="flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4">
//           {[...project.conversation, ...project.versions]
//             .sort(
//               (a, b) =>
//                 new Date(a.timestamp as string).getTime() -
//                 new Date(b.timestamp as string).getTime()
//             )
//             .map((message) => {
//               const isMessage = 'content' in message

//               if (isMessage) {
//                 const msg = message as Message
//                 const isUser = msg.role === 'user'

//                 return (
//                   <div
//                     key={msg.id}
//                     className={`flex items-start gap-3 ${
//                       isUser ? 'justify-end' : 'justify-start'
//                     }`}
//                   >
//                     {!isUser && (
//                       <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
//                         <BotIcon className="size-5 text-white" />
//                       </div>
//                     )}

//                     <div
//                       className={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm mt-5 ${
//                         isUser
//                           ? 'bg-linear-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-none'
//                           : 'rounded-tl-none bg-gray-800 text-gray-100'
//                       }`}
//                     >
//                       {msg.content}
//                     </div>

//                     {isUser && (
//                       <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
//                         <UserIcon className="size-5 text-gray-200" />
//                       </div>
//                     )}
//                   </div>
//                 )
//               } else {
//                 const ver = message as Version
//                 return (
//                   <div
//                     key={ver.id}
//                     className="p-3 my-2 w-4/5 rounded-xl bg-gray-800 shadow flex flex-col gap-2"
//                   >
//                     <div className="text-xs font-medium">
//                       code updated <br />
//                       <span className="text-gray-500 text-xs">
//                         {new Date(ver.timestamp).toLocaleString()}
//                       </span>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       {project.current_version_index === ver.id ? (
//                         <button className="bg-gray-700 text-xs px-3 py-1 rounded-md">
//                           Current Version
//                         </button>
//                       ) : (
//                         <button
//                           onClick={() => handleRollback(ver.id)}
//                           className="px-3 py-1 rounded-md bg-indigo-600 text-white"
//                         >
//                           Rollback to this Version
//                         </button>
//                       )}

//                       <Link
//                         target="_blank"
//                         to={`/preview/${project.id}/${ver.id}`}
//                       >
//                         <EyeIcon className="size-6 p-1 text-gray-400 hover:bg-indigo-500 rounded" />
//                       </Link>
//                     </div>
//                   </div>
//                 )
//               }
//             })}

//           {isGenerating && (
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
//                 <BotIcon className="size-5 text-white animate-pulse" />
//               </div>

//               <div className="flex gap-1.5">
//                 <span className="size-2 rounded-full animate-bounce bg-gray-600" />
//                 <span className="size-2 rounded-full animate-bounce bg-gray-600 delay-150" />
//                 <span className="size-2 rounded-full animate-bounce bg-gray-600 delay-300" />
//               </div>
//             </div>
//           )}

//           <div ref={messageRef} />

//           <form
//             className="m-3 relative"
//             onSubmit={handleRevisions}
//           >
//             <div className="flex items-center gap-2">
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 rows={4}
//                 disabled={isGenerating}
//                 placeholder="Describe your website or request changes..."
//                 className="flex-1 p-3 rounded-xl resize-none text-sm outline-none ring ring-gray-700 focus:ring-indigo-500 bg-gray-800 text-gray-100"
//               />
//               <button disabled={isGenerating || !input.trim() } className='absolute bottom-2.5 right-2.5 rounded-full bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-colors disabled:opacity-60'>
//                 {isGenerating ? (
//                   <Loader2Icon className="size-7 p-1.5 animate-spin text-white" />
//                 ) : (
//                   <SendIcon className="size-7 p-1.5 text-white" />
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Sidebar


// import React, { useEffect, useRef, useState } from "react";
// import type { Message, Project, Version } from "../types";
// import {
//   BotIcon,
//   EyeIcon,
//   Loader2Icon,
//   SendIcon,
//   UserIcon,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import api from "@/configs/axios";
// import { toast } from "sonner";

// interface SidebarProps {
//   isMenuOpen: boolean;
//   project: Project;
//   setProject: (project: Project) => void;
//   isGenerating: boolean;
//   setIsGenerating: (isGenerating: boolean) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   isMenuOpen,
//   project,
//   setProject,
//   isGenerating,
//   setIsGenerating,
// }) => {
//   const messageRef = useRef<HTMLDivElement>(null);
//   const [input, setInput] = useState("");

//   const fetchProject = async ()=>{
//     try {
//       const {data} = await api.get(`/api/user/project/${project.id}`)
//       setProject(data.project)

//     } catch (error:any) {
//        toast.error(error?.response?.data?.message || error.message);
//       console.log(error);
//     }
//   } 

//   const handleRollback =async (versionId: string) => {
//     // implement later
//     try {
//       const confirm = window.confirm('Are you sure you want to rollback to this version?')
//       if(!confirm) return;
//       setIsGenerating(true);
//       const {data} = await api.get(`/api/project/rollback/${project.id}/${versionId}`);
//       const {data : data2} = await api.get(`/api/user/project/${project.id}/${versionId}`);
//       toast.success(data.message);
//       setProject(data2.project);
//       setIsGenerating(false);
//     } catch (error : any) {
//       setIsGenerating(false);
//        toast.error(error?.response?.data?.message || error.message);
//       console.log(error);
//     }
//   };

//   const handleRevisions = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;
//     let interval : number | undefined;
//     try {
//       setIsGenerating(true);
//       interval = setInterval(()=>{
//         fetchProject();
//       },100000);
//       const {data} = await api.post(`/api/project/revision/${project.id}`,{message : input});
//       fetchProject();
//       toast.success(data.message);
//       setInput('')
//       clearInterval(interval);
//       setIsGenerating(false);
//     } catch (error : any) {
//       setIsGenerating(false);
//       toast.error(error?.response?.data?.message || error.message);
//       console.log(error);
//       clearInterval(interval);
//     }

 
//   };

//   /* =========================
//      AUTO SCROLL
//   ========================= */
//   useEffect(() => {
//     messageRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [project.conversation?.length, isGenerating]);

//   /* =========================
//      SAFE MERGED TIMELINE
//   ========================= */
//   const timeline = [
//     ...(project.conversation ?? []),
//     ...(project.versions ?? []),
//   ].sort((a: any, b: any) => {
//     const ta = new Date(a.timestamp ?? 0).getTime();
//     const tb = new Date(b.timestamp ?? 0).getTime();
//     return ta - tb;
//   });

//   return (
//     <div
//       className={`h-full sm:max-w-sm rounded-xl bg-gray-900 border-gray-800 transition-all ${
//         isMenuOpen ? "max-sm:w-0 overflow-hidden" : "w-full"
//       }`}
//     >
//       <div className="flex flex-col h-full">
//         <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-4">
//           {timeline.map((item: Message | Version) => {
//             const isMessage = "content" in item;

//             /* =========================
//                MESSAGE
//             ========================= */
//             if (isMessage) {
//               const msg = item as Message;
//               const isUser = msg.role === "user";

//               return (
//                 <div
//                   key={msg.id}
//                   className={`flex items-start gap-3 ${
//                     isUser ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   {!isUser && (
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
//                       <BotIcon className="size-5 text-white" />
//                     </div>
//                   )}

//                   <div
//                     className={`max-w-[80%] p-2 px-4 rounded-2xl mt-5 ${
//                       isUser
//                         ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-none"
//                         : "rounded-tl-none bg-gray-800 text-gray-100"
//                     }`}
//                   >
//                     {msg.content}
//                   </div>

//                   {isUser && (
//                     <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
//                       <UserIcon className="size-5 text-gray-200" />
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             /* =========================
//                VERSION CARD
//             ========================= */
//             const ver = item as Version;
//             const verId = ver._id || ver.id;

//             return (
//               <div
//                 key={verId}
//                 className="p-3 my-2 w-4/5 rounded-xl bg-gray-800 shadow flex flex-col gap-2"
//               >
//                 <div className="text-xs font-medium">
//                   Code updated
//                   <br />
//                   <span className="text-gray-500">
//                     {new Date(ver.timestamp).toLocaleString()}
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   {project.current_version_index === verId ? (
//                     <button className="bg-gray-700 text-xs px-3 py-1 rounded-md">
//                       Current Version
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleRollback(verId)}
//                       className="px-3 py-1 rounded-md bg-indigo-600 text-white"
//                     >
//                       Rollback
//                     </button>
//                   )}

//                   <Link to={`/preview/${project._id}/${verId}`} target="_blank">
//                     <EyeIcon className="size-6 p-1 text-gray-400 hover:bg-indigo-500 rounded" />
//                   </Link>
//                 </div>
//               </div>
//             );
//           })}

//           {isGenerating && (
//             <div className="flex items-start gap-3">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
//                 <BotIcon className="size-5 text-white animate-pulse" />
//               </div>

//               <div className="flex gap-1.5">
//                 <span className="size-2 rounded-full animate-bounce bg-gray-600" />
//                 <span className="size-2 rounded-full animate-bounce bg-gray-600 delay-150" />
//                 <span className="size-2 rounded-full animate-bounce bg-gray-600 delay-300" />
//               </div>
//             </div>
//           )}

//           <div ref={messageRef} />

//           {/* INPUT */}
//           <form className="m-3 relative" onSubmit={handleRevisions}>
//             <textarea
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               rows={4}
//               disabled={isGenerating}
//               placeholder="Describe your website or request changes..."
//               className="w-full p-3 rounded-xl resize-none text-sm outline-none bg-gray-800 text-gray-100"
//             />

//             <button
//               disabled={isGenerating || !input.trim()}
//               className="absolute bottom-3 right-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
//             >
//               {isGenerating ? (
//                 <Loader2Icon className="size-7 p-1.5 animate-spin text-white" />
//               ) : (
//                 <SendIcon className="size-7 p-1.5 text-white" />
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import React, { useEffect, useRef, useState } from "react";
import type { Message, Project, Version } from "../types";
import {
  BotIcon,
  EyeIcon,
  Loader2Icon,
  SendIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/configs/axios";
import { toast } from "sonner";

interface SidebarProps {
  isMenuOpen: boolean;
  project: Project;
  setProject: (project: Project) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isMenuOpen,
  project,
  setProject,
  isGenerating,
  setIsGenerating,
}) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  /* =========================
     FETCH PROJECT (SAFE)
  ========================= */
  const fetchProject = async () => {
    try {
      const { data } = await api.get(
        `/api/user/project/${project._id}`
      );

      // backend returns { success, data: { project } }
      const fetchedProject = data?.data?.project;
      if (!fetchedProject) return;

      setProject({
        ...fetchedProject,
        conversation: fetchedProject.conversations ?? fetchedProject.conversation ?? [],
        versions: fetchedProject.versions ?? [],
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message
      );
    }
  };

  /* =========================
     ROLLBACK VERSION (FIXED)
  ========================= */
  const handleRollback = async (versionId: string) => {
    try {
      const confirmRollback = window.confirm(
        "Are you sure you want to rollback to this version?"
      );
      if (!confirmRollback) return;

      setIsGenerating(true);

      // ✅ correct rollback route + correct project id
      const { data } = await api.get(
        `/api/project/rollback/${project._id}/${versionId}`
      );

      toast.success(data.message);

      // ✅ refetch project correctly
      await fetchProject();

      setIsGenerating(false);
    } catch (error: any) {
      setIsGenerating(false);
      toast.error(
        error?.response?.data?.message || error.message
      );
    }
  };

  /* =========================
     SEND REVISION REQUEST
  ========================= */
  const handleRevisions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    let interval: number | undefined;

    try {
      setIsGenerating(true);

      // poll while AI works
      interval = window.setInterval(fetchProject, 5000);

      const { data } = await api.post(
        `/api/project/revision/${project._id}`,
        { message: input }
      );

      toast.success(data.message);
      setInput("");

      await fetchProject();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message
      );
    } finally {
      if (interval) clearInterval(interval);
      setIsGenerating(false);
    }
  };

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [project.conversation?.length, isGenerating]);

  /* =========================
     MERGED TIMELINE (SAFE)
  ========================= */
  const timeline = [
    ...(project.conversation ?? []),
    ...(project.versions ?? []),
  ].sort((a: any, b: any) => {
    const ta = new Date(a.timestamp ?? 0).getTime();
    const tb = new Date(b.timestamp ?? 0).getTime();
    return ta - tb;
  });

  return (
    <div
      className={`h-full sm:max-w-sm rounded-xl bg-gray-900 border-gray-800 transition-all ${
        isMenuOpen ? "max-sm:w-0 overflow-hidden" : "w-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-4">
          {timeline.map((item: Message | Version) => {
            const isMessage = "content" in item;

            /* ---------- MESSAGE ---------- */
            if (isMessage) {
              const msg = item as Message;
              const isUser = msg.role === "user";

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                      <BotIcon className="size-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-2 px-4 rounded-2xl mt-5 ${
                      isUser
                        ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-none"
                        : "rounded-tl-none bg-gray-800 text-gray-100"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <UserIcon className="size-5 text-gray-200" />
                    </div>
                  )}
                </div>
              );
            }

            /* ---------- VERSION CARD ---------- */
            const ver = item as Version;
            const verId = ver._id || ver.id;

            return (
              <div
                key={verId}
                className="p-3 my-2 w-4/5 rounded-xl bg-gray-800 shadow flex flex-col gap-2"
              >
                <div className="text-xs font-medium">
                  Code updated
                  <br />
                  <span className="text-gray-500">
                    {new Date(ver.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  {project.current_version_index === verId ? (
                    <button className="bg-gray-700 text-xs px-3 py-1 rounded-md">
                      Current Version
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRollback(verId)}
                      className="px-3 py-1 rounded-md bg-indigo-600 text-white"
                    >
                      Rollback
                    </button>
                  )}

                  <Link
                    to={`/preview/${project._id}/${verId}`}
                    target="_blank"
                  >
                    <EyeIcon className="size-6 p-1 text-gray-400 hover:bg-indigo-500 rounded" />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* ---------- AI TYPING ---------- */}
          {isGenerating && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
                <BotIcon className="size-5 text-white animate-pulse" />
              </div>

              <div className="flex gap-1.5">
                <span className="size-2 rounded-full animate-bounce bg-gray-600" />
                <span className="size-2 rounded-full animate-bounce bg-gray-600 delay-150" />
                <span className="size-2 rounded-full animate-bounce bg-gray-600 delay-300" />
              </div>
            </div>
          )}

          <div ref={messageRef} />

          {/* ---------- INPUT ---------- */}
          <form className="m-3 relative" onSubmit={handleRevisions}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              disabled={isGenerating}
              placeholder="Describe your website or request changes..."
              className="w-full p-3 rounded-xl resize-none text-sm outline-none bg-gray-800 text-gray-100"
            />

            <button
              disabled={isGenerating || !input.trim()}
              className="absolute bottom-3 right-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
            >
              {isGenerating ? (
                <Loader2Icon className="size-7 p-1.5 animate-spin text-white" />
              ) : (
                <SendIcon className="size-7 p-1.5 text-white" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;