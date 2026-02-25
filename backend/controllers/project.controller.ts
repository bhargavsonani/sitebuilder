// import { Response } from "express";
// import { AuthRequest } from "../types/auth.types.js";
// import { getUserById } from "../services/auth.service.js";
// import WebsiteProjectModel from "../models/websiteProject.model.js";
// import ConversationModel from "../models/conversation.model.js";
// import User from "../models/user.model.js";
// import openai from "../configs/openai.js";
// import VersionModel from "../models/version.model.js";


// // controller function to make revision
// export const makeRevision = async (req: AuthRequest, res: Response) => {
//     const userId = req.userId;
//     try {
//         const {projectId} = req.params;
//         const {message} = req.body;
        
//       if (!userId) {
//           return res.status(401).json({
//               success: false,
//               message: "Unauthorized",
//               error: "Unauthorized",
//           });
//       }
//       const user = await getUserById(userId.toString());
//       if (!user) {
//           return res.status(404).json({
//               success: false,
//               message: "User not found",
//               error: "User not found",
//           });
//       }

//       if(user.credits<2){
//         return res.status(403).json({
//             message:"add more credits to make changes"
//         });
//       }

//       if(!message || message.trim() === ''){
//         return res.status(400).json({
//             message:"Please enter a valid prompt"
//         });
//       }

//       const currentProject = await WebsiteProjectModel.findOne({
//         _id: projectId,
//         userId: userId
//       });

//       if(!currentProject){
//         return res.status(404).json({
//             success: false,
//             message: "Project not found"
//         });
//       }

//       await ConversationModel.create({
//         role: 'user',
//         content: message,
//         projectId: currentProject._id
//       });

//       await User.findByIdAndUpdate(userId, { 
//         $inc: { credits: -2 } 
//       });
    
//     //   enhance uset propmt
      
//     const promptEnhanceResponse = await openai.chat.completions.create({
//         model: 'arcee-ai/trinity-large-preview:free',
//         messages:[
//             {
//                 role:'system',
//                 content:`You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

//                             Enhance this by:
//                             1. Being specific about what elements to change
//                             2. Mentioning design details (colors, spacing, sizes)
//                             3. Clarifying the desired outcome
//                             4. Using clear technical terms

//                         Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).`
//             },
//             {
//                 role:'user',
//                 content:`User's request : "${message}"`
//             }
//         ]

//     })

//     const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;

    
//     await ConversationModel.create({
//         role: "assistant",
//         content: ` I've enhanced your prompt to: "${enhancedPrompt}"`,
//         projectId: currentProject._id
//     });

//     await ConversationModel.create({
//         role: "assistant",
//         content: `Now making changes to your website...`,
//         projectId: currentProject._id
//     });

//     // genrate website cde
//     const codeGenrationResponse = await openai.chat.completions.create({
//         model:'arcee-ai/trinity-large-preview:free',
//         messages:[
//             {
//                 role:'system',
//                 content:`
//                     You are an expert web developer. 

//                     CRITICAL REQUIREMENTS:
//                     - Return ONLY the complete updated HTML code with the requested changes.
//                     - Use Tailwind CSS for ALL styling (NO custom CSS).
//                     - Use Tailwind utility classes for all styling changes.
//                     - Include all JavaScript in <script> tags before closing </body>
//                     - Make sure it's a complete, standalone HTML document with Tailwind CSS
//                     - Return the HTML Code Only, nothing else

//                     Apply the requested changes while maintaining the Tailwind CSS styling approach.

//                 `
//             },{
//                 role:'user',
//                 content:`Here is the current website code: "${currentProject.current_code}" the user wants this change: "${enhancedPrompt}"`
//             }
//         ]
//     })

//     const code = codeGenrationResponse.choices[0].message.content || '';

//     const cleanedCode = code.replace(/```[a-z]*\n?/gi,'').replace(/```$/g,'').trim();
    
//     const version = new VersionModel({
//         code: cleanedCode,
//         description: 'changes made',
//         projectId: currentProject._id
//     });
//     await version.save();

//     await ConversationModel.create({
//         role: "assistant",
//         content: ` I've made the changes to your website! You can now preview it and request any changes.`,
//         projectId: currentProject._id
//     });

//     await WebsiteProjectModel.findByIdAndUpdate(projectId, {
//         current_code: cleanedCode,
//         current_version_index: version._id.toString(),
//     });
    



//       const updatedUser = await getUserById(userId.toString());
//       return res.status(200).json({
//           success: true,
//           message: "Changes made successfully",
//           data: { credits: updatedUser?.credits || user.credits },
//       });
//     } catch (error: any) {
//         console.error("Error making revision:", error);
//         // Refund credits on error
//         if (userId) {
//             try {
//                 await User.findByIdAndUpdate(userId, { 
//                     $inc: { credits: 2 } 
//                 });
//             } catch (refundError) {
//                 console.error("Error refunding credits:", refundError);
//             }
//         }
//       return res.status(500).json({
//           success: false,
//           message: "Failed to make changes",
//           error: error.message || "Internal server error",
//       });
//     }
//   };


// // controller function to rollback to a specific version
// export const rollbackToVersion = async (req: AuthRequest, res: Response) => {
//     const userId = req.userId;
//     try {
//         const { projectId, versionId } = req.params;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized",
//                 error: "Unauthorized",
//             });
//         }

//         // Get the project, confirm owner
//         const project = await WebsiteProjectModel.findOne({ 
//             _id: projectId,
//             userId: userId
//         });

//         if (!project) {
//             return res.status(404).json({ 
//                 success: false,
//                 message: "Project not found" 
//             });
//         }

//         // Find the version
//         const version = await VersionModel.findOne({ 
//             _id: versionId,
//             projectId: projectId
//         });

//         if (!version) {
//             return res.status(404).json({ 
//                 success: false,
//                 message: "Version not found" 
//             });
//         }

//         // Update the project's code and version index to the selected version
//         await WebsiteProjectModel.findByIdAndUpdate(projectId, {
//             current_code: version.code,
//             current_version_index: version._id.toString(),
//         });

//         await ConversationModel.create({
//             role: "assistant",
//             content: `The project has been rolled back to version: ${versionId}`,
//             projectId: project._id
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Project rolled back to the selected version successfully.",
//             data: { versionId },
//         });

//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to rollback to the selected version",
//             error: error.message || "Internal server error",
//         });
//     }
// };

// // controller function to Delete a project
// export const deleteProject = async (req: AuthRequest, res: Response) => {
//     const userId = req.userId;
//     try {
//         const { projectId } = req.params;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized",
//                 error: "Unauthorized",
//             });
//         }

//         // Check if the project exists and belongs to this user
//         const project = await WebsiteProjectModel.findOne({
//             _id: projectId,
//             userId: userId
//         });

//         if (!project) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Project not found",
//             });
//         }

//         // Delete all related conversations and versions
//         await ConversationModel.deleteMany({ projectId: project._id });
//         await VersionModel.deleteMany({ projectId: project._id });

//         // Delete the project
//         await WebsiteProjectModel.findByIdAndDelete(projectId);

//         return res.status(200).json({
//             success: true,
//             message: "Project deleted successfully.",
//         });
//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to delete project",
//             error: error.message || "Internal server error",
//         });
//     }
// };

// // Controller for getting project code for preview
// export const getProjectPreview = async (req: AuthRequest, res: Response) => {
//     const userId = req.userId;
//     try {
//         const { projectId } = req.params;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized",
//                 error: "Unauthorized",
//             });
//         }

//         // Find project by id and userId
//         const project = await WebsiteProjectModel.findOne({
//             _id: projectId,
//             userId: userId
//         });

//         // Get versions separately
//         const versions = await VersionModel.find({ 
//             projectId: project?._id 
//         }).sort({ timestamp: 1 });

//         if (!project) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Project not found",
//             });
//         }

//         // Send the current_code for preview
//         return res.status(200).json({
//             success: true,
//             message: "Project preview fetched successfully",
//             data: {
//                 project: {
//                     ...project.toObject(),
//                     versions
//                 },
//                 code: project.current_code || '',
//             }
//         });

//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to get project code",
//             error: error.message || "Internal server error",
//         });
//     }
// };


// // Controller to get a published project (public endpoint)
// export const getPublishedProject = async (req: AuthRequest, res: Response) => {
//     try {
//         // Find all published projects
//         const projects = await WebsiteProjectModel.find({
//             isPublished: true
//         })
//         .populate('userId', 'name email')
//         .sort({ createdAt: -1 })
//         .limit(50)
//         .lean();

//         return res.status(200).json({
//             success: true,
//             message: "Published projects fetched successfully",
//             data: { projects },
//         });

//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to get published project",
//             error: error.message || "Internal server error",
//         });
//     }
// };


// export const getProjectById = async (req: AuthRequest, res: Response) => {
//     try {
//         const { projectId } = req.params;
//         if (!projectId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Project ID is required",
//             });
//         }

//         const project = await WebsiteProjectModel.findOne({
//             _id: projectId,
//             isPublished: true
//         });

//         if (!project || !project.current_code) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Published project not found or has no code",
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Project fetched successfully",
//             data: {
//                 code: project.current_code,
//                 project: {
//                     id: project._id,
//                     name: project.name,
//                     isPublished: project.isPublished
//                 }
//             }
//         });

//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to get project",
//             error: error.message || "Internal server error",
//         });
//     }
// };

// export const saveProjectCode = async (req: AuthRequest, res: Response) => {
//     try {
//         const userId = req.userId;
//         const { projectId } = req.params;
//         const { code } = req.body;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized",
//                 error: "Unauthorized",
//             });
//         }

//         if (!code){
//             return res.status(400).json({
//                 success: false,
//                 message: "Code is required",
//             });
//         }

//         const project = await WebsiteProjectModel.findOne({
//             _id: projectId,
//             userId: userId
//         });

//         if (!project) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Project not found",
//             });
//         }

//         await WebsiteProjectModel.findByIdAndUpdate(projectId, {
//             current_code: code,
//             current_version_index: ''
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Project code saved successfully",
//         });
//     } catch (error: any) {
//         return res.status(500).json({
//             success: false,
//             message: "Failed to save project code",
//             error: error.message || "Internal server error",
//         });
//     }
// };



import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../types/auth.types.js";
import { getUserById } from "../services/auth.service.js";
import WebsiteProjectModel from "../models/websiteProject.model.js";
import ConversationModel from "../models/conversation.model.js";
import User from "../models/user.model.js";
import openai from "../configs/openai.js";
import VersionModel from "../models/version.model.js";

/* ===============================
   MAKE REVISION
================================ */
export const makeRevision = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  // let creditsDeducted = false;

  try {
    const { projectId } = req.params;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Please enter a valid prompt" });
    }

    // const user = await User.findOneAndUpdate(
    //   { _id: userId, credits: { $gte: 2 } },
    //   { $inc: { credits: -2 } },
    //   { new: true }
    // );

    // if (!user) {
    //   return res.status(403).json({
    //     message: "Add more credits to make changes",
    //   });
    // }

    // creditsDeducted = true;

    const currentProject = await WebsiteProjectModel.findOne({
      _id: projectId,
      userId,
    });

    if (!currentProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    await ConversationModel.create({
      role: "user",
      content: message,
      projectId: currentProject._id,
    });

    /* ---- Enhance prompt ---- */
    const enhanceRes = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "system",
          content:
            "Enhance the user's website change request. Return only the enhanced request.",
        },
        { role: "user", content: message },
      ],
    });

    const enhancedPrompt =
      enhanceRes.choices[0].message.content || message;

    await ConversationModel.create({
      role: "assistant",
      content: `I've enhanced your prompt to: "${enhancedPrompt}"`,
      projectId: currentProject._id,
    });

    /* ---- Generate updated code ---- */
    const codeRes = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "system",
          content:
            "Return ONLY updated full HTML using Tailwind CSS. No markdown.",
        },
        {
          role: "user",
          content: `Current code: "${currentProject.current_code || ""}"
Requested change: "${enhancedPrompt}"`,
        },
      ],
    });

    const rawCode = codeRes.choices[0].message.content || "";
    const cleanedCode = rawCode
      .replace(/```[a-z]*\n?/gi, "")
      .replace(/```/g, "")
      .trim();

    const version = await VersionModel.create({
      code: cleanedCode,
      description: "Changes made",
      projectId: currentProject._id,
    });

    await WebsiteProjectModel.findByIdAndUpdate(projectId, {
      current_code: cleanedCode,
      current_version_index: version._id.toString(),
    });

    await ConversationModel.create({
      role: "assistant",
      content: "I've made the requested changes to your website.",
      projectId: currentProject._id,
    });

    return res.status(200).json({
      success: true,
      message: "Changes made successfully",
      // data: { credits: user.credits },
    });
  } catch (error: any) {
    // if (creditsDeducted && userId) {
    //   await User.findByIdAndUpdate(userId, { $inc: { credits: 2 } });
    // }

    return res.status(500).json({
      success: false,
      message: "Failed to make changes",
      error: error.message,
    });
  }
};

/* ===============================
   ROLLBACK TO VERSION
================================ */
export const rollbackToVersion = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, versionId } = req.params;

    if (
      !req.userId ||
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(versionId)
    ) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const project = await WebsiteProjectModel.findOne({
      _id: projectId,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const version = await VersionModel.findOne({
      _id: versionId,
      projectId,
    });

    if (!version) {
      return res.status(404).json({ message: "Version not found" });
    }

    await WebsiteProjectModel.findByIdAndUpdate(projectId, {
      current_code: version.code,
      current_version_index: version._id.toString(),
    });

    await ConversationModel.create({
      role: "assistant",
      content: `i've made the changes to your website! You can now preview it `,
      projectId: project._id,
    });

    return res.status(200).json({
      success: true,
      message: "Rollback successful",
      data: { versionId },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to rollback",
      error: error.message,
    });
  }
};

/* ===============================
   DELETE PROJECT
================================ */
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    if (
      !req.userId ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const project = await WebsiteProjectModel.findOne({
      _id: projectId,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await ConversationModel.deleteMany({ projectId });
    await VersionModel.deleteMany({ projectId });
    await WebsiteProjectModel.findByIdAndDelete(projectId);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};

/* ===============================
   GET PROJECT PREVIEW
================================ */
export const getProjectPreview = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    if (
      !req.userId ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const project = await WebsiteProjectModel.findOne({
      _id: projectId,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const versions = await VersionModel.find({
      projectId: project._id,
    }).sort({ timestamp: 1 });

    return res.status(200).json({
      success: true,
      data: {
        project: { ...project.toObject(), versions },
        code: project.current_code || "",
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to get project preview",
      error: error.message,
    });
  }
};

/* ===============================
   GET PUBLISHED PROJECTS
================================ */
export const getPublishedProject = async (_req: AuthRequest, res: Response) => {
  try {
    const projects = await WebsiteProjectModel.find({ isPublished: true })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({
      success: true,
      data: { projects },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch published projects",
      error: error.message,
    });
  }
};

/* ===============================
   GET PUBLISHED PROJECT BY ID
================================ */
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await WebsiteProjectModel.findOne({
      _id: projectId,
      isPublished: true,
    });

    if (!project || !project.current_code) {

      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      data: {
        code: project.current_code,
        project: {
          id: project._id,
          name: project.name,
          isPublished: project.isPublished,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to get project",
      error: error.message,
    });
  }
};

/* ===============================
   SAVE PROJECT CODE
================================ */
export const saveProjectCode = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { code } = req.body;

    if (
      !req.userId ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      return res.status(400).json({ message: "Invalid request" });
    }

    if (!code) {
      return res.status(400).json({ message: "Code is required" });
    }

    const project = await WebsiteProjectModel.findOne({
      _id: projectId,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await WebsiteProjectModel.findByIdAndUpdate(projectId, {
      current_code: code,
      current_version_index: "",
    });

    return res.status(200).json({
      success: true,
      message: "Project code saved successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to save project code",
      error: error.message,
    });
  }
};