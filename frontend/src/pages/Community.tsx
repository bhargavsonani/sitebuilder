// // import React, { useEffect, useState } from 'react';
// // import type { Project } from '../types';
// // import { Loader2Icon } from 'lucide-react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { dummyProjects } from '../assets/assets';
// // import Footer from '../components/Footer';

// // const Community = () => {
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [projects, setProjects] = useState<Project[]>([]);
// //   const navigate = useNavigate();

// //   const fetchProjects = async () => {
// //     setLoading(true);

// //     // simulate API call
// //     setTimeout(() => {
// //       setProjects(dummyProjects);
// //       setLoading(false);
// //     }, 1000);
// //   };

// //   useEffect(() => {
// //     fetchProjects();
// //   }, []);

// //   return (
// //     <>
// //       <div className="px-4 md:px-16 lg:px-24 xl:px-32">
// //         {loading ? (
// //           <div className="flex items-center justify-center h-[80vh]">
// //             <Loader2Icon className="animate-spin text-indigo-200 size-7" />
// //           </div>
// //         ) : projects.length > 0 ? (
// //           <div className="py-10 min-h-[80vh]">
// //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //               <h1 className="text-3xl font-semibold text-white">
// //                 Published Projects
// //               </h1>
// //             </div>

// //             <div className="flex flex-wrap gap-3.5 mt-6">
// //               {projects.map((project) => (
// //                 <Link
// //                   key={project.id}
// //                   to={`/preview/${project.id}`}
// //                   target="_blank"
// //                   className="w-72 max-sm:mx-auto cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden shadow-md group hover:shadow-indigo-700/30 hover:border-indigo-800/80 transition-all duration-300"
// //                 >
// //                   {/* Preview */}
// //                   <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
// //                     {project.current_code ? (
// //                       <iframe
// //                         srcDoc={project.current_code}
// //                         className="absolute top-0 left-0 w-[1200px] h-[880px] origin-top-left pointer-events-none"
// //                         style={{ transform: 'scale(0.25)' }}
// //                         sandbox="allow-scripts allow-same-origin"
// //                       />
// //                     ) : (
// //                       <div className="flex items-center justify-center h-full text-gray-400 text-sm">
// //                         No Preview Available
// //                       </div>
// //                     )}
// //                   </div>

// //                   {/* Content */}
// //                   <div className="p-4 text-white bg-linear-to-br from-transparent group-hover:from-indigo-950 to-transparent transition-colors duration-300">
// //                     <div className="flex items-start justify-between">
// //                       <h2 className="text-lg font-medium line-clamp-2">
// //                         {project.name}
// //                       </h2>
// //                       <span className="px-2.5 py-0.5 mt-1 ml-2 text-xs bg-gray-800 border border-gray-700 rounded-full">
// //                         Website
// //                       </span>
// //                     </div>

// //                     <p className="text-gray-400 mt-1 text-sm line-clamp-2">
// //                       {project.initial_prompt}
// //                     </p>

// //                     <div className="flex justify-between items-center mt-6">
// //                       <span className="text-gray-400 text-xs">
// //                         {new Date(project.createdAt).toLocaleDateString()}
// //                       </span>

// //                       <button
// //                         onClick={(e) => {
// //                           e.preventDefault();
// //                           navigate(`/preview/${project.id}`);
// //                         }}
// //                         className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-colors flex items-center gap-2 text-sm"
// //                       >
// //                         <span className="bg-gray-200 size-4.5 rounded-full text-black font-semibold flex items-center justify-center">
// //                           {project.user?.name?.slice(0, 1) || 'U'}
// //                         </span>
// //                         {project.user?.name || 'Unknown'}
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </Link>
// //               ))}
// //             </div>
// //           </div>
// //         ) : (
// //           <div className="flex flex-col items-center justify-center h-[80vh]">
// //             <h1 className="text-3xl font-semibold text-gray-300 mb-4">
// //               No projects found
// //             </h1>
// //             <button
// //               onClick={() => navigate('/')}
// //               className="text-white px-5 py-2 mt-5 rounded-md bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all"
// //             >
// //               Create New Project
// //             </button>
// //           </div>
// //         )}
// //       </div>

// //       <Footer />
// //     </>
// //   );
// // };

// // export default Community;

// import React, { useEffect, useState } from "react";
// import type { Project } from "../types";
// import { Loader2Icon } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "@/configs/axios";
// import { toast } from "sonner";
// import Footer from "../components/Footer";

// const Community: React.FC = () => {
//   const [loading, setLoading] = useState<boolean>(true);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const navigate = useNavigate();

//   /* =========================
//      FETCH PUBLISHED PROJECTS
//   ========================= */
//   const fetchProjects = async () => {
//     try {
//       setLoading(true);

//       const { data } = await api.get("/api/project/published");

//       // backend: { success, data: { projects } }
//       const publishedProjects = data?.data?.projects ?? [];

//       setProjects(publishedProjects);
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || error.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   return (
//     <>
//       <div className="px-4 md:px-16 lg:px-24 xl:px-32">
//         {loading ? (
//           <div className="flex items-center justify-center h-[80vh]">
//             <Loader2Icon className="animate-spin text-indigo-200 size-7" />
//           </div>
//         ) : projects.length > 0 ? (
//           <div className="py-10 min-h-[80vh]">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <h1 className="text-3xl font-semibold text-white">
//                 Published Projects
//               </h1>
//             </div>

//             <div className="flex flex-wrap gap-3.5 mt-6">
//               {projects.map((project) => (
//                 <Link
//                   key={project._id}
//                   to={`/preview/${project._id}`}
//                   target="_blank"
//                   className="w-72 max-sm:mx-auto cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden shadow-md group hover:shadow-indigo-700/30 hover:border-indigo-800/80 transition-all duration-300"
//                 >
//                   {/* PREVIEW */}
//                   <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
//                     {project.current_code ? (
//                       <iframe
//                         srcDoc={project.current_code}
//                         className="absolute top-0 left-0 w-[1200px] h-[880px] origin-top-left pointer-events-none"
//                         style={{ transform: "scale(0.25)" }}
//                         sandbox="allow-scripts allow-same-origin"
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center h-full text-gray-400 text-sm">
//                         No Preview Available
//                       </div>
//                     )}
//                   </div>

//                   {/* CONTENT */}
//                   <div className="p-4 text-white bg-gradient-to-br from-transparent group-hover:from-indigo-950 to-transparent transition-colors duration-300">
//                     <div className="flex items-start justify-between">
//                       <h2 className="text-lg font-medium line-clamp-2">
//                         {project.name}
//                       </h2>
//                       <span className="px-2.5 py-0.5 mt-1 ml-2 text-xs bg-gray-800 border border-gray-700 rounded-full">
//                         Website
//                       </span>
//                     </div>

//                     <p className="text-gray-400 mt-1 text-sm line-clamp-2">
//                       {project.initial_prompt}
//                     </p>

//                     <div className="flex justify-between items-center mt-6">
//                       <span className="text-gray-400 text-xs">
//                         {new Date(
//                           project.createdAt
//                         ).toLocaleDateString()}
//                       </span>

//                       <button
//                         onClick={(e) => {
//                           e.preventDefault();
//                           navigate(`/preview/${project._id}`);
//                         }}
//                         className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-colors flex items-center gap-2 text-sm"
//                       >
//                         <span className="bg-gray-200 size-4.5 rounded-full text-black font-semibold flex items-center justify-center">
//                           {project.userId?.name?.slice(0, 1) || "U"}
//                         </span>
//                         {project.userId?.name || "Unknown"}
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-[80vh]">
//             <h1 className="text-3xl font-semibold text-gray-300 mb-4">
//               No published projects yet
//             </h1>
//             <button
//               onClick={() => navigate("/")}
//               className="text-white px-5 py-2 mt-5 rounded-md bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all"
//             >
//               Create New Project
//             </button>
//           </div>
//         )}
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default Community;


import React, { useEffect, useState } from "react";
import type { Project } from "../types";
import { Loader2Icon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/configs/axios";
import { toast } from "sonner";
import Footer from "../components/Footer";
import axios from "axios";

const Community: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  /* =========================
     FETCH PUBLISHED PROJECTS
  ========================= */
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("https://sitebuilder-5dsm.vercel.app/api/project/published");

      const fetchedProjects = (data?.data?.projects ?? []).map(
        (p: any) => ({
          ...p,
          id: p.id || p._id, // normalize _id → id
        })
      );

      setProjects(fetchedProjects);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <div className="px-4 md:px-16 lg:px-24 xl:px-32">
        {loading ? (
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2Icon className="animate-spin text-indigo-200 size-7" />
          </div>
        ) : projects.length > 0 ? (
          <div className="py-10 min-h-[80vh]">
            <h1 className="text-3xl font-semibold text-white">
              Published Projects
            </h1>

            <div className="flex flex-wrap gap-3.5 mt-6">
              {projects.map((project) => {
                const authorName =
                  typeof project.userId === "string"
                    ? "User"
                    : project.userId?.name || "User";

                return (
                  <Link
                    key={project.id}
                    to={`/preview/${project.id}`}
                    target="_blank"
                    className="w-72 max-sm:mx-auto cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden shadow-md hover:shadow-indigo-700/30 hover:border-indigo-800/80 transition-all duration-300"
                  >
                    {/* PREVIEW */}
                    <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
                      {project.current_code ? (
                        <iframe
                          srcDoc={project.current_code}
                          className="absolute top-0 left-0 w-[1200px] h-[880px] origin-top-left pointer-events-none"
                          style={{ transform: "scale(0.25)" }}
                          sandbox="allow-scripts allow-same-origin"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          No Preview Available
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 text-white">
                      <h2 className="text-lg font-medium line-clamp-2">
                        {project.name}
                      </h2>

                      <p className="text-gray-400 mt-1 text-sm line-clamp-2">
                        {project.initial_prompt}
                      </p>

                      <div className="flex justify-between items-center mt-6">
                        <span className="text-gray-400 text-xs">
                          {new Date(
                            project.createdAt
                          ).toLocaleDateString()}
                        </span>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/preview/${project.id}`);
                          }}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md flex items-center gap-2 text-sm"
                        >
                          <span className="bg-gray-200 size-4.5 rounded-full text-black font-semibold flex items-center justify-center">
                            {authorName.slice(0, 1)}
                          </span>
                          {authorName}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-3xl font-semibold text-gray-300 mb-4">
              No published projects yet
            </h1>
            <button
              onClick={() => navigate("/")}
              className="text-white px-5 py-2 mt-5 rounded-md bg-indigo-500 hover:bg-indigo-600 active:scale-95 transition-all"
            >
              Create New Project
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Community;
