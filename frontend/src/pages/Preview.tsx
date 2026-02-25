// // import { Loader2Icon } from "lucide-react";
// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { dummyProjects } from "../assets/assets";
// // import ProjectPreview from "../components/ProjectPreview";
// // import type { Project } from "../types";

// // const Preview = () => {
// //   const {projectId,versionId} = useParams();
// //    const [code, setCode] = useState('');
// //    const[ loading,setLoading] = useState(true)

// //    const fetchCode = async () => {
// //      setTimeout(() => {
// //       const code = dummyProjects.find(project => project.id === projectId)?.current_code || '';

// //       if(code){
// //         setCode(code);
// //         setLoading(false);
// //       }
// //     },2000)
// //   }
  
// //   useEffect(()=>{
// //     fetchCode();
// //   },[])

// //   if(loading){
// //     return (
// //     <div className="flex items-center justify-center h-screen">
// //       <Loader2Icon  className="size-7 animate-spin text-indigo-200"/>
// //     </div>
// //     )
// //   }



// //   return (
// //     <div className="h-screen">
// //          {code && <ProjectPreview project={{current_code:code } as Project}
// //         isGenrating={false} showEditorPanel={false}/>}
// //     </div>
// //   )
// // }

// // export default Preview


// import { Loader2Icon } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import ProjectPreview from "../components/ProjectPreview";
// import type { Project, Version } from "../types";
// import api from "@/configs/axios";
// import { toast } from "sonner";

// const Preview: React.FC = () => {
//   const { projectId, versionId } = useParams();
//   const [code, setCode] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchCode = async () => {
//     try {
//       setLoading(true);

//       // =============================
//       // CASE 1: VERSION PREVIEW
//       // =============================
//       if (versionId) {
//         const { data } = await api.get(
//           `/api/user/project/${projectId}`
//         );

//         const project = data?.data?.project;
//         if (!project) {
//           throw new Error("Project not found");
//         }

//         // const version = project.versions?.find(
//         //   (v: Version) =>
//         //     v._id === versionId || v.id === versionId
//         // );

//         const version = project.versions?.find(
//   (v: Version) => v.id === versionId || v._id === versionId);

//         if (!version) {
//           throw new Error("Version not found");
//         }

//         setCode(version.code);
//       }

//       // =============================
//       // CASE 2: PUBLISHED PROJECT
//       // =============================
//       else {
//         const { data } = await api.get(
//           `/api/project/preview/${projectId}`
//         );

//         const codeFromApi = data?.data?.code;
//         if (!codeFromApi) {
//           throw new Error("No published code found");
//         }

//         setCode(codeFromApi);
//       }

//       setLoading(false);
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message || error.message
//       );
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (projectId) {
//       fetchCode();
//     }
//   }, [projectId, versionId]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <Loader2Icon className="size-7 animate-spin text-indigo-200" />
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen">
//       {code ? (
//         <ProjectPreview
//           project={{ current_code: code } as Project}
//           isGenrating={false}
//           showEditorPanel={false}
//         />
//       ) : (
//         <div className="flex items-center justify-center h-screen text-gray-400">
//           No preview available
//         </div>
//       )}
//     </div>
//   );
// };

// export default Preview;


import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectPreview from "../components/ProjectPreview";
import type { Project, Version } from "../types";
import api from "@/configs/axios";
import { toast } from "sonner";

const Preview: React.FC = () => {
  const { projectId, versionId } = useParams();
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCode = async () => {
    try {
      setLoading(true);

      // =============================
      // VERSION PREVIEW
      // =============================
      if (versionId) {
        const { data } = await api.get(
          `/api/user/project/${projectId}`
        );

        const project = data?.data?.project;
        if (!project) {
          throw new Error("Project not found");
        }

        const version = project.versions?.find(
          (v: Version) =>
            v.id === versionId || v._id === versionId
        );

        if (!version) {
          throw new Error("Version not found");
        }

        setCode(version.code);
      }
      // =============================
      // PUBLISHED PROJECT PREVIEW
      // =============================
      else {
        const { data } = await api.get(
          `/api/project/preview/${projectId}`
        );

        const codeFromApi = data?.data?.code;
        if (!codeFromApi) {
          throw new Error("No preview code found");
        }

        setCode(codeFromApi);
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchCode();
    }
  }, [projectId, versionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-indigo-200" />
      </div>
    );
  }

  return (
    <div className="h-screen">
      {code ? (
        <ProjectPreview
          project={{ current_code: code } as Project}
          isGenrating={false}
          showEditorPanel={false}
        />
      ) : (
        <div className="flex items-center justify-center h-screen text-gray-400">
          No preview available
        </div>
      )}
    </div>
  );
};

export default Preview;
