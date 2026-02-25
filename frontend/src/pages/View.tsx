// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom"
// import { dummyProjects } from "../assets/assets";
// import { Loader2Icon } from "lucide-react";
// import ProjectPreview from "../components/ProjectPreview";
// import type { Project } from "../types";


// const View = () => {
//   const {projectId} = useParams();
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(true)

//   const fetchCode = async () => {
//     const code = dummyProjects.find(project => project.id === projectId)?.current_code || '';
//     setTimeout(() => {
//       if(code){
//         setCode(code);
//         setLoading(false);
//       }
//     },2000)
//   }

//   useEffect(()=>{
//     fetchCode();
//   },[])

//   if(loading){
//     return (
//     <div className="flex items-center justify-center h-screen">
//       <Loader2Icon  className="size-7 animate-spin text-indigo-200"/>
//     </div>
//     )
//   }

//   return (
//     <div className="h-screen">
//         {code && <ProjectPreview project={{current_code:code } as Project}
//         isGenrating={false} showEditorPanel={false}/>}
//     </div>
//   )
// }

// export default View;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import ProjectPreview from "../components/ProjectPreview";
import type { Project } from "../types";
import api from "@/configs/axios";
import { toast } from "sonner";

const View: React.FC = () => {
  const { projectId } = useParams();
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  /* =========================
     FETCH PUBLISHED CODE
  ========================= */
  const fetchCode = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/api/project/published/${projectId}`
      );

      const codeFromApi = data?.data?.code;

      if (!codeFromApi) {
        throw new Error("No preview available");
      }

      setCode(codeFromApi);
      setLoading(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchCode();
    }
  }, [projectId]);

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

export default View;