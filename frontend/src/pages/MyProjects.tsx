// import React, { useEffect, useState } from 'react';
// import type { Project } from '../types';
// import { Loader2Icon, PlusIcon, TrashIcon } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { dummyProjects } from '../assets/assets';
// import Footer from '../components/Footer';

// const MyProjects = () => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [projects, setProjects] = useState<Project[]>([]);
//   const navigate = useNavigate();

//   const fetchProjects = () => {
//     setLoading(true);

//     setTimeout(() => {
//       setProjects(dummyProjects);
//       setLoading(false);
//     }, 1000);
//   };

//   const deleteProject = (projectId: string) => {
//     setProjects(prev =>
//       prev.filter(project => project.id !== projectId)
//     );
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
//                 My Projects
//               </h1>

//               <button
//                 onClick={() => navigate('/')}
//                 className="flex items-center gap-2 text-white px-3 sm:px-6 py-1 sm:py-2 rounded bg-gradient-to-br from-indigo-500 to-indigo-600 hover:opacity-90 active:scale-95 transition-all"
//               >
//                 <PlusIcon size={18} />
//                 Create New
//               </button>
//             </div>

//             <div className="flex flex-wrap gap-3.5 mt-6">
//               {projects.map((project) => (
//                 <div
//                   key={project.id}
//                   onClick={() => navigate(`/projects/${project.id}`)}
//                   className="relative w-72 max-sm:mx-auto cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden shadow-md group hover:shadow-indigo-700/30 hover:border-indigo-800/80 transition-all duration-300"
//                 >
//                   {/* Preview */}
//                   <div className="relative w-full h-40 bg-gray-900 overflow-hidden border-b border-gray-800">
//                     {project.current_code ? (
//                       <iframe
//                         srcDoc={project.current_code}
//                         className="absolute top-0 left-0 w-[1200px] h-[880px] origin-top-left pointer-events-none"
//                         style={{ transform: 'scale(0.25)' }}
//                         sandbox="allow-scripts allow-same-origin"
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center h-full text-gray-400 text-sm">
//                         No Preview Available
//                       </div>
//                     )}
//                   </div>

//                   {/* Content */}
//                   <div className="p-4 text-white bg-gradient-to-b from-transparent group-hover:from-indigo-950 to-transparent transition-colors duration-300">
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

//                     <div
//                       onClick={(e) => e.stopPropagation()}
//                       className="flex justify-between items-center mt-6"
//                     >
//                       <span className="text-gray-400 text-xs">
//                         {new Date(project.createdAt).toLocaleDateString()}
//                       </span>

//                       <div className="flex gap-3 text-white text-sm">
//                         <button
//                           onClick={() => navigate(`/preview/${project.id}`)}
//                           className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-all"
//                         >
//                           Preview
//                         </button>
//                         <button
//                           onClick={() => navigate(`/projects/${project.id}`)}
//                           className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-all"
//                         >
//                           Open
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Delete */}
//                   <div onClick={(e) => e.stopPropagation()}>
//                     <TrashIcon
//                       onClick={() => deleteProject(project.id)}
//                       className="absolute top-3 right-3 scale-0 group-hover:scale-100 bg-white p-1.5 size-7 rounded text-red-400 hover:text-red-500 cursor-pointer transition-all"
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-[80vh]">
//             <h1 className="text-3xl font-semibold text-gray-300 mb-4">
//               No projects found
//             </h1>
//             <button
//               onClick={() => navigate('/')}
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

// export default MyProjects;


import React, { useEffect, useState } from "react";
import type { Project } from "../types";
import { Loader2Icon, PlusIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/configs/axios";
import { toast } from "sonner";
import Footer from "../components/Footer";

const MyProjects: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const navigate = useNavigate();

  /* =========================
     FETCH USER PROJECTS
  ========================= */
  const fetchProjects = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/user/projects");

      // backend returns { success, data: { projects } }
      const fetchedProjects = data?.data?.projects ?? [];

      setProjects(fetchedProjects);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE PROJECT
  ========================= */
  const deleteProject = async (projectId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/project/${projectId}`);

      setProjects((prev) =>
        prev.filter((project) => project._id !== projectId)
      );

      toast.success("Project deleted successfully");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message
      );
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
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-3xl font-semibold text-white">
                My Projects
              </h1>

              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-white px-3 sm:px-6 py-1 sm:py-2 rounded bg-gradient-to-br from-indigo-500 to-indigo-600 hover:opacity-90 active:scale-95 transition-all"
              >
                <PlusIcon size={18} />
                Create New
              </button>
            </div>

            {/* PROJECT GRID */}
            <div className="flex flex-wrap gap-3.5 mt-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  onClick={() =>
                    navigate(`/projects/${project._id}`)
                  }
                  className="relative w-72 max-sm:mx-auto cursor-pointer bg-gray-900/60 border border-gray-700 rounded-lg overflow-hidden shadow-md group hover:shadow-indigo-700/30 hover:border-indigo-800/80 transition-all duration-300"
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
                        Generating preview…
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 text-white bg-gradient-to-b from-transparent group-hover:from-indigo-950 to-transparent transition-colors duration-300">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium line-clamp-2">
                        {project.name}
                      </h2>
                      <span className="px-2.5 py-0.5 mt-1 ml-2 text-xs bg-gray-800 border border-gray-700 rounded-full">
                        Website
                      </span>
                    </div>

                    <p className="text-gray-400 mt-1 text-sm line-clamp-2">
                      {project.initial_prompt}
                    </p>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex justify-between items-center mt-6"
                    >
                      <span className="text-gray-400 text-xs">
                        {new Date(
                          project.createdAt
                        ).toLocaleDateString()}
                      </span>

                      <div className="flex gap-3 text-white text-sm">
                        <button
                          onClick={() =>
                            navigate(`/preview/${project._id}`)
                          }
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-all"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/projects/${project._id}`)
                          }
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/15 rounded-md transition-all"
                        >
                          Open
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* DELETE */}
                  <div onClick={(e) => e.stopPropagation()}>
                    <TrashIcon
                      onClick={() =>
                        deleteProject(project._id)
                      }
                      className="absolute top-3 right-3 scale-0 group-hover:scale-100 bg-white p-1.5 size-7 rounded text-red-400 hover:text-red-500 cursor-pointer transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-3xl font-semibold text-gray-300 mb-4">
              No projects found
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

export default MyProjects;