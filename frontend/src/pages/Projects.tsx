// // import React, { useEffect, useRef, useState } from 'react'
// // import { useNavigate, useParams, Link } from 'react-router-dom'
// // import type { Project } from '../types'
// // import {
// //   ArrowBigDownDashIcon,
// //   EyeIcon,
// //   EyeOffIcon,
// //   FullscreenIcon,
// //   LaptopIcon,
// //   Loader2Icon,
// //   MessageSquareIcon,
// //   SaveIcon,
// //   SmartphoneIcon,
// //   TabletIcon,
// //   XIcon,
// // } from 'lucide-react'
// // // import { dummyConversations, dummyProjects, dummyVersion } from '../assets/assets'
// // import Sidebar from '../components/Sidebar'
// // import ProjectPreview,{type ProjectPreviewRef} from '../components/ProjectPreview'
// // import api from '@/configs/axios'
// // import { toast } from 'sonner'
// // import { useAuth } from '@/contexts/AuthContext'

// // const Projects = () => {
// //   const { projectId } = useParams()
// //   const navigate = useNavigate()
// //    const { user } = useAuth();

// //   const [project, setProject] = useState<Project | null>(null)
// //   const [loading, setLoading] = useState(true)

// //   const [isGenrating, setIsGenrating] = useState(true)
// //   const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop')

// //   const [isMenuOpen, setIsMenuOpen] = useState(false)
// //   const [isSaving, setIsSaving] = useState(false)

// //   const previewRef = useRef<ProjectPreviewRef>(null);

// //   const fetchProjects = async () => {
// //    try {
// //     const {data} = await api.get(`/api/user/project/${projectId}`);
// //     setProject(data.project);
// //     setIsGenrating(data.project.current_code ? false : true);
// //     setLoading(false);
// //    } catch (error : any) {
// //     toast.error(error?.response?.data?.message || error.message);
// //     console.log(error);
// //    }
// //   }

// //   const saveProject = async () => {}

// //   // download code (index.htmk)
// //   const downloadCode = () => {
// //     const code = previewRef.current?.getCode() || project?.current_code;
// //     if (!code) {
// //       if(isGenrating){
// //         return 
// //       }
// //       return
// //     }
// //     const element = document.createElement('a');
// //     const file = new Blob([code], { type: 'text/html' });
// //     element.href = URL.createObjectURL(file);
// //     element.download = `${project?.name || 'project'}.html`;
// //     document.body.appendChild(element);
// //     element.click();  
// //   }

// //   const togglePublish = async () => {}

// // useEffect(() => {
// //   if(user){
// //     fetchProjects();
// //   }else {
// //     toast("Please login to view your project");
// //   }
// // }, [user])

// // useEffect(() => {
// //   if(project && !project.current_code){
// //     const intervalId = setInterval(fetchProjects,10000);
// //     return ()=> clearInterval(intervalId)
// //   }
// // }, [project])

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen">
// //         <Loader2Icon className="size-7 animate-spin text-violet-200" />
// //       </div>
// //     )
// //   }

// //   return project ? (
// //     <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
// //       {/* navbar */}
// //       <div className="flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar">
// //         {/* left */}
// //         <div className="flex items-center gap-2 sm:min-w-90 text-nowrap">
// //           <img
// //             src="/vite.svg"
// //             alt="logo"
// //             className="h-6 cursor-pointer"
// //             onClick={() => navigate('/')}
// //           />
// //           <div className="max-w-64 sm:max-w-xs">
// //             <p className="text-sm capitalize truncate">{project.name}</p>
// //             <p className="text-xs text-gray-400 -mt-0.5">
// //               Previewing last saved version
// //             </p>
// //           </div>

// //           <div className="sm:hidden flex-1 flex justify-end">
// //             {isMenuOpen ? (
// //               <MessageSquareIcon
// //                 onClick={() => setIsMenuOpen(false)}
// //                 className="size-6 cursor-pointer"
// //               />
// //             ) : (
// //               <XIcon
// //                 onClick={() => setIsMenuOpen(true)}
// //                 className="size-6 cursor-pointer"
// //               />
// //             )}
// //           </div>
// //         </div>

// //         {/* middle */}
// //         <div className="hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md">
// //           <SmartphoneIcon
// //             onClick={() => setDevice('phone')}
// //             className={`size-6 p-1 cursor-pointer rounded ${
// //               device === 'phone'
// //                 ? 'bg-violet-500/10 text-violet-500'
// //                 : 'text-gray-400'
// //             }`}
// //           />
// //           <TabletIcon
// //             onClick={() => setDevice('tablet')}
// //             className={`size-6 p-1 cursor-pointer rounded ${
// //               device === 'tablet'
// //                 ? 'bg-violet-500/10 text-violet-500'
// //                 : 'text-gray-400'
// //             }`}
// //           />
// //           <LaptopIcon
// //             onClick={() => setDevice('desktop')}
// //             className={`size-6 p-1 cursor-pointer rounded ${
// //               device === 'desktop'
// //                 ? 'bg-violet-500/10 text-violet-500'
// //                 : 'text-gray-400'
// //             }`}
// //           />
// //         </div>

// //         {/* right */}
// //         <div className="flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm">
// //           <button
// //             onClick={saveProject}
// //             disabled={isSaving}
// //             className="max-sm:hidden bg-gray-800 hover:bg-gray-700 px-3 py-1 flex items-center gap-2 rounded border border-gray-700"
// //           >
// //             {isSaving ? (
// //               <Loader2Icon className="animate-spin" size={16} />
// //             ) : (
// //               <SaveIcon size={16} />
// //             )}
// //             Save
// //           </button>

// //           <Link
// //             className="flex items-center gap-2 px-4 py-1 rounded border border-gray-700 hover:border-gray-500"
// //             target="_blank"
// //             to={`/preview/${projectId}`}
// //           >
// //             <FullscreenIcon size={16} /> Preview
// //           </Link>

// //           <button
// //             onClick={downloadCode}
// //             className="bg-linear-to-br from-blue-700 to-blue-600 px-3.5 py-1 flex items-center gap-2 rounded"
// //           >
// //             <ArrowBigDownDashIcon size={16} /> Download
// //           </button>

// //           <button
// //             onClick={togglePublish}
// //             className="bg-linear-to-br from-blue-700 to-blue-600 px-3.5 py-1 flex items-center gap-2 rounded"
// //           >
// //             {project.isPublished ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
// //             {project.isPublished ? 'Unpublish' : 'Publish'}
// //           </button>
// //         </div>
// //       </div>

// //       {/* workspace */}
// //       <div className="flex-1 overflow-auto bg-gray-900 flex">
// //         <Sidebar
// //           isMenuOpen={isMenuOpen}
// //           project={project}
// //           setProject={(p) => setProject(p)}
// //           isGenerating={isGenrating}
// //           setIsGenerating={setIsGenrating}
// //         />
// //         <div className="flex-1 p-2 pl-0"><ProjectPreview ref={previewRef} project={project} isGenrating={isGenrating} device={device} /></div>
// //       </div>
// //     </div>
// //   ) : (
// //     <div className="flex items-center justify-center h-screen">
// //       <p className="text-2xl font-medium text-gray-200">
// //         Unable to load project!
// //       </p>
// //     </div>
// //   )
// // }

// // export default Projects

// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import type { Project } from "../types";
// import {
//   ArrowBigDownDashIcon,
//   EyeIcon,
//   EyeOffIcon,
//   FullscreenIcon,
//   LaptopIcon,
//   Loader2Icon,
//   MessageSquareIcon,
//   SaveIcon,
//   SmartphoneIcon,
//   TabletIcon,
//   XIcon,
// } from "lucide-react";
// import Sidebar from "../components/Sidebar";
// import ProjectPreview, {
//   type ProjectPreviewRef,
// } from "../components/ProjectPreview";
// import api from "@/configs/axios";
// import { toast } from "sonner";
// import { useAuth } from "@/contexts/AuthContext";

// const Projects: React.FC = () => {
//   const { projectId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [project, setProject] = useState<Project | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isGenerating, setIsGenerating] = useState(true);
//   const [device, setDevice] = useState<"phone" | "tablet" | "desktop">(
//     "desktop"
//   );
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isSaving, setIsSaving] = useState(false);

//   const previewRef = useRef<ProjectPreviewRef>(null);

//   /* =========================
//      FETCH PROJECT
//   ========================= */
//   const fetchProject = async () => {
//     try {
//       const { data } = await api.get(`/api/user/project/${projectId}`);

//       const apiProject = data?.data?.project;
//       if (!apiProject) {
//         throw new Error("Invalid project response");
//       }

//       // Normalize backend shape → frontend Project type
//       const normalizedProject: Project = {
//         // keep all original fields from backend
//         ...apiProject,
//         // ensure a stable id field for frontend components
//         id: apiProject.id || apiProject._id || projectId || "",
//         // map backend `conversations` → frontend `conversation`
//         conversation:
//           apiProject.conversation ??
//           apiProject.conversations ??
//           [],
//         // make sure versions have `id` alongside `_id`
//         versions: (apiProject.versions ?? []).map((v: any) => ({
//           id: v.id || v._id,
//           timestamp: v.timestamp,
//           code: v.code,
//         })),
//         current_version_index:
//           apiProject.current_version_index ?? apiProject.versionId ?? "",
//       };

//       setProject(normalizedProject);
//       setIsGenerating(!normalizedProject.current_code);
//       setLoading(false);
//     } catch (error: any) {
//       toast.error(error?.response?.data?.message || error.message);
//       navigate("/");
//     }
//   };

//   /* =========================
//      SAVE PROJECT CODE
//   ========================= */
//   const saveProject = async () => {
//     const code =
//       previewRef.current?.getCode() ||
//       project?.current_code;

//     if (!code || !projectId) return;

//     try {
//       setIsSaving(true);
//       await api.put(`/api/project/save/${projectId}`, {
//         code,
//       });
//       toast.success("Project saved successfully");
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || error.message
//       );
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   /* =========================
//      TOGGLE PUBLISH
//   ========================= */
//   const togglePublish = async () => {
//     if (!projectId) return;

//     try {
//       const { data } = await api.post(
//         `/api/user/publish-toggle/${projectId}`
//       );

//       setProject((prev) =>
//         prev
//           ? { ...prev, isPublished: data.data.isPublished }
//           : prev
//       );

//       toast.success(data.message);
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || error.message
//       );
//     }
//   };

//   /* =========================
//      DOWNLOAD HTML
//   ========================= */
//   const downloadCode = () => {
//     const code =
//       previewRef.current?.getCode() ||
//       project?.current_code;

//     if (!code) return;

//     const blob = new Blob([code], {
//       type: "text/html",
//     });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `${project?.name || "project"}.html`;
//     link.click();
//   };

//   /* =========================
//      EFFECTS
//   ========================= */
//   useEffect(() => {
//     if (!user) {
//       toast.error("Please login to view your project");
//       navigate("/");
//       return;
//     }
//     fetchProject();
//   }, [user, projectId]);

//   // polling only while generating
//   useEffect(() => {
//     if (!project?.current_code) {
//       const id = setInterval(fetchProject, 10000);
//       return () => clearInterval(id);
//     }
//   }, [project?.current_code]);

//   /* =========================
//      UI STATES
//   ========================= */
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2Icon className="size-7 animate-spin text-violet-200" />
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-xl text-gray-300">
//           Unable to load project
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
//       {/* NAVBAR */}
//       <div className="flex max-sm:flex-col sm:items-center gap-4 px-4 py-2">
//         <div className="flex items-center gap-2">
//           <img
//             src="/vite.svg"
//             className="h-6 cursor-pointer"
//             onClick={() => navigate("/")}
//           />
//           <div className="max-w-xs">
//             <p className="truncate">{project.name}</p>
//             <p className="text-xs text-gray-400">
//               Previewing last saved version
//             </p>
//           </div>
//         </div>

//         <div className="flex-1 flex justify-end gap-2">
//           <button
//             onClick={saveProject}
//             disabled={isSaving}
//             className="bg-gray-800 px-3 py-1 rounded flex items-center gap-2"
//           >
//             {isSaving ? (
//               <Loader2Icon className="animate-spin" size={16} />
//             ) : (
//               <SaveIcon size={16} />
//             )}
//             Save
//           </button>

//           <Link
//             to={`/preview/${projectId}`}
//             target="_blank"
//             className="border border-gray-700 px-3 py-1 rounded flex items-center gap-2"
//           >
//             <FullscreenIcon size={16} />
//             Preview
//           </Link>

//           <button
//             onClick={downloadCode}
//             className="bg-gradient-to-br from-blue-700 to-blue-600 px-3 py-1 rounded flex items-center gap-2"
//           >
//             <ArrowBigDownDashIcon size={16} />
//             Download
//           </button>

//           <button
//             onClick={togglePublish}
//             className="bg-gradient-to-br from-blue-700 to-blue-600 px-3 py-1 rounded flex items-center gap-2"
//           >
//             {project.isPublished ? (
//               <EyeOffIcon size={16} />
//             ) : (
//               <EyeIcon size={16} />
//             )}
//             {project.isPublished ? "Unpublish" : "Publish"}
//           </button>
//         </div>
//       </div>

//       {/* WORKSPACE */}
//       <div className="flex-1 flex overflow-hidden">
//         <Sidebar
//           isMenuOpen={isMenuOpen}
//           project={project}
//           setProject={setProject}
//           isGenerating={isGenerating}
//           setIsGenerating={setIsGenerating}
//         />
//         <div className="flex-1 p-2">
//           <ProjectPreview
//             ref={previewRef}
//             project={project}
//             isGenrating={isGenerating}
//             device={device}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Projects;



import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { Project } from "../types";
import {
  ArrowBigDownDashIcon,
  EyeIcon,
  EyeOffIcon,
  FullscreenIcon,
  Loader2Icon,
  SaveIcon,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import ProjectPreview, {
  type ProjectPreviewRef,
} from "../components/ProjectPreview";
import api from "@/configs/axios";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Projects: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(true);
  const [device] = useState<"phone" | "tablet" | "desktop">("desktop");
  const [isMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const previewRef = useRef<ProjectPreviewRef>(null);

  /* =========================
     FETCH PROJECT
  ========================= */
  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/api/user/project/${projectId}`);
      const apiProject = data?.data?.project;

      if (!apiProject) {
        throw new Error("Invalid project response");
      }

      const normalizedProject: Project = {
        ...apiProject,
        id: apiProject.id || apiProject._id || projectId || "",
        conversation:
          apiProject.conversation ??
          apiProject.conversations ??
          [],
        versions: (apiProject.versions ?? []).map((v: any) => ({
          id: v.id || v._id,
          timestamp: v.timestamp,
          code: v.code,
        })),
        current_version_index:
          apiProject.current_version_index ??
          apiProject.versionId ??
          "",
      };

      setProject(normalizedProject);
      setIsGenerating(!normalizedProject.current_code);
      setLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      navigate("/");
    }
  };

  /* =========================
     SAVE PROJECT
  ========================= */
  const saveProject = async () => {
    const code =
      previewRef.current?.getCode() || project?.current_code;

    if (!code || !projectId) return;

    try {
      setIsSaving(true);
      await api.put(`/api/project/save/${projectId}`, { code });
      toast.success("Project saved successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================
     TOGGLE PUBLISH
  ========================= */
  const togglePublish = async () => {
    if (!projectId) return;

    try {
      const { data } = await api.post(
        `/api/user/publish-toggle/${projectId}`
      );

      setProject((prev) =>
        prev ? { ...prev, isPublished: data.data.isPublished } : prev
      );

      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  /* =========================
     DOWNLOAD HTML
  ========================= */
  const downloadCode = () => {
    const code =
      previewRef.current?.getCode() || project?.current_code;

    if (!code) return;

    const blob = new Blob([code], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${project?.name || "project"}.html`;
    link.click();
  };

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    if (!user) {
      toast.error("Please login to view your project");
      navigate("/");
      return;
    }
    fetchProject();
  }, [user, projectId]);

  useEffect(() => {
    if (!project?.current_code) {
      const id = setInterval(fetchProject, 10000);
      return () => clearInterval(id);
    }
  }, [project?.current_code]);

  /* =========================
     UI STATES
  ========================= */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-violet-200" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-300">
          Unable to load project
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
      {/* NAVBAR */}
      <div className="flex max-sm:flex-col sm:items-center gap-4 px-4 py-2">
        <div className="flex items-center gap-2">
          <img
            src="/vite.svg"
            className="h-6 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <div className="max-w-xs">
            <p className="truncate">{project.name}</p>
            <p className="text-xs text-gray-400">
              Previewing last saved version
            </p>
          </div>
        </div>

        <div className="flex-1 flex justify-end gap-2">
          <button
            onClick={saveProject}
            disabled={isSaving}
            className="bg-gray-800 px-3 py-1 rounded flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2Icon className="animate-spin" size={16} />
            ) : (
              <SaveIcon size={16} />
            )}
            Save
          </button>

          <Link
            to={`/preview/${projectId}`}
            target="_blank"
            className="border border-gray-700 px-3 py-1 rounded flex items-center gap-2"
          >
            <FullscreenIcon size={16} />
            Preview
          </Link>

          <button
            onClick={downloadCode}
            className="bg-gradient-to-br from-blue-700 to-blue-600 px-3 py-1 rounded flex items-center gap-2"
          >
            <ArrowBigDownDashIcon size={16} />
            Download
          </button>

          <button
            onClick={togglePublish}
            className="bg-gradient-to-br from-blue-700 to-blue-600 px-3 py-1 rounded flex items-center gap-2"
          >
            {project.isPublished ? (
              <EyeOffIcon size={16} />
            ) : (
              <EyeIcon size={16} />
            )}
            {project.isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isMenuOpen={isMenuOpen}
          project={project}
          setProject={setProject}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />

        <div className="flex-1 p-2">
          <ProjectPreview
            ref={previewRef}
            project={project}
            isGenrating={isGenerating}
            device={device}
          />
        </div>
      </div>
    </div>
  );
};

export default Projects;
