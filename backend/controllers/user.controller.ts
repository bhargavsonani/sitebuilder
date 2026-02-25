// // get user credits
// import { Request, Response } from "express";
// import User from "../models/user.model.js";
// import { AuthRequest } from "../types/auth.types.js";
// import { getUserById } from "../services/auth.service.js";
// import mongoose from "mongoose";
// import WebsiteProjectModel from "../models/websiteProject.model.js";
// import ConversationModel from "../models/conversation.model.js";
// import openai from "../configs/openai.js";
// import VersionModel from "../models/version.model.js";
// import { timeStamp } from "node:console";

// export const getUserCredits = async (req: AuthRequest, res: Response) => {
//   try {
//     console.log("getUserCredits called - userId:", req.userId);
//     const userId = req.userId;
//     if (!userId) {
//         console.log("getUserCredits - No userId found");
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized",
//             error: "Unauthorized",
//         });
//     }
//     const user = await getUserById(userId.toString());
//     if (!user) {
//         console.log("getUserCredits - User not found for userId:", userId);
//         return res.status(404).json({
//             success: false,
//             message: "User not found",
//             error: "User not found",
//         });
//     }
//     console.log("getUserCredits - Success, credits:", user.credits);
//     return res.status(200).json({
//         success: true,
//         message: "User credits fetched successfully",
//         data: { credits: user.credits },
//     });
//   } catch (error: any) {
//     console.error("Error getting user credits:", error);
//     return res.status(500).json({
//         success: false,
//         message: "Failed to get user credits",
//         error: error.message || "Internal server error",
//     });
//   }
// };

// // create user project (requires authenticate middleware → req.userId)
// export const createUserProject = async (req: AuthRequest, res: Response) => {
//     console.log("[CONTROLLER] createUserProject called");
//     const userId = req.userId;
//     console.log("[CONTROLLER] userId:", userId);
//     console.log("[CONTROLLER] body:", req.body);
//     try {
//     if (!userId) {
//         return res.status(401).json({
//             success: false,
//             message: "Unauthorized",
//             error: "Unauthorized",
//         });
//     }
//     const user = await getUserById(userId.toString());
//     const {  initial_prompt } = req.body;
//     if (!user) {
//         return res.status(404).json({
//             success: false,
//             message: "User not found",
//             error: "User not found",
//         });
//     }
//     if (user.credits < 3) {
//         return res.status(400).json({
//             success: false,
//             message: "Insufficient credits",
//             error: "Insufficient credits",
//         });
//     }

//     const projectName = initial_prompt.length > 50 ? initial_prompt.substring(0, 47) + "..." : initial_prompt;
//     const project = new WebsiteProjectModel({
//         name: projectName,
//         initial_prompt,
//         userId: new mongoose.Types.ObjectId(userId),
//     });
//     await project.save();

//     await User.findByIdAndUpdate(user._id, { totalCreation: user.totalCreation + 1 });
//     await User.findByIdAndUpdate(user._id, { credits: user.credits - 3 });

//     await ConversationModel.create({
//         role: "user",
//         content: initial_prompt,
//         projectId: project._id,
//     });

//     // Send response so frontend can navigate; run AI flow in background
//     return res.status(200).json({
//         success: true,
//         message: "Project created successfully",
//         data: { projectId: project._id.toString() }
//     });

//     // Enhance prompt and generate code in background (do not await)
//     (async () => {
//       try {
//     const promptEnhanceResponse = await openai.chat.completions.create({
//         model: 'arcee-ai/trinity-large-preview:free',
//         messages: [
//             {
//                 role: "system",
//                 content: `
//                         You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

//                             Enhance this prompt by:
//                             1. Adding specific design details (layout, color scheme, typography)
//                             2. Specifying key sections and features
//                             3. Describing the user experience and interactions
//                             4. Including modern web design best practices
//                             5. Mentioning responsive design requirements
//                             6. Adding any missing but important elements

//                         Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max).`,
//             },
//             {
//                 role: "user",
//                 content: initial_prompt,
//             }
//         ],
//     });

//     const enhancedPrompt = promptEnhanceResponse.choices[0].message.content;

//     await ConversationModel.create({
//         role: "assistant",
//         content: ` I've enhanced your prompt to: "${enhancedPrompt}"`,
//         projectId: project._id,
//     });

//     await ConversationModel.create({
//         role: "assistant",
//         content: 'Now generating website code...',
//         projectId: project._id,
//     });

//     // generate website code

//     const  codeGenrationResponse = await openai.chat.completions.create({
//         model: "arcee-ai/trinity-large-preview:free",
//         messages:[
//             {
//                 role: "system",
//                 content: `You are an expert web developer. Create a complete, production-ready, single-page website based on this request: "${enhancedPrompt}"

//     CRITICAL REQUIREMENTS:
//     - You MUST output valid HTML ONLY. 
//                     - Use Tailwind CSS for ALL styling
//                     - Include this EXACT script in the <head>: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
//                     - Use Tailwind utility classes extensively for styling, animations, and responsiveness
//                     - Make it fully functional and interactive with JavaScript in <script> tag before closing </body>
//                     - Use modern, beautiful design with great UX using Tailwind classes
//                     - Make it responsive using Tailwind responsive classes (sm:, md:, lg:, xl:)
//                     - Use Tailwind animations and transitions (animate-*, transition-*)
//                     - Include all necessary meta tags
//                     - Use Google Fonts CDN if needed for custom fonts
//                     - Use placeholder images from https://placehold.co/600x400
//                     - Use Tailwind gradient classes for beautiful backgrounds
//                     - Make sure all buttons, cards, and components use Tailwind styling

//                     CRITICAL HARD RULES:
//                     1. You MUST put ALL output ONLY into message.content.
//                     2. You MUST NOT place anything in "reasoning", "analysis", "reasoning_details", or any hidden fields.
//                     3. You MUST NOT include internal thoughts, explanations, analysis, comments, or markdown.
//                     4. Do NOT include markdown, explanations, notes, or code fences.

//                     The HTML should be complete and ready to render as-is with Tailwind CSS.`
//             },{
//                 role: "user",
//                 content: enhancedPrompt || '',
//             }
//         ]
//     })

//     const code = codeGenrationResponse.choices[0].message.content || '';

//     // create version for the project
//     const version = new VersionModel({
//         code: code.replace(/```[a-z]*\n?/gi,'').replace(/```$/g,'').trim(),
//         description: 'Initial version',
//         projectId: project._id,
//     });
//     await version.save();

//     await ConversationModel.create({
//         role: "assistant",
//         content: ` I've created your website! You can now preview it and request any changes.`,
//         projectId: project._id,
//     });

//     await WebsiteProjectModel.findByIdAndUpdate(project._id, {
//         current_code: code.replace(/```[a-z]*\n?/gi,'').replace(/```$/g,'').trim(),
//         current_version_index: version._id.toString(),
//     });
//       } catch (bgError: any) {
//         console.error('Background project creation error:', bgError);
//         await User.findByIdAndUpdate(userId, { $inc: { credits: 3 } });
//       }
//     })();
//   } catch (error: any) {
//     return res.status(500).json({
//         success: false,
//         message: "Failed to create user project",
//         error: error.message || "Internal server error",
//     });
//   }
// };


// // get user project by ID
// export const getUserProject = async (req: AuthRequest, res: Response) => {
//     const userId = req.userId;
//     try {
//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized",
//                 error: "Unauthorized",
//             });
//         }

//         const {projectId} = req.params;

//         const project = await WebsiteProjectModel.findOne({
//             _id: projectId,
//             userId: userId
//         });

//         if (!project) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Project not found",
//                 error: "Project not found",
//             });
//         }

//         // Get conversations and versions separately
//         const conversations = await ConversationModel.find({ 
//             projectId: project._id 
//         }).sort({ timestamp: 1 });
        
//         const versions = await VersionModel.find({ 
//             projectId: project._id 
//         }).sort({ timestamp: 1 });

//         if (!project) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Project not found",
//                 error: "Project not found",
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Project fetched successfully",
//             data: { 
//                 project: {
//                     ...project.toObject(),
//                     conversations,
//                     versions
//                 }
//             }
//         });
//     }
//     catch (error: any) {
//         console.error("Error getting user project:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to get user project",
//             error: error.message || "Internal server error",
//         });
//     }
// }

// // Get all projects for current user
// export const getUserProjects = async (req: AuthRequest, res: Response) => {
//     const userId = req.userId;
//     try {
//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized",
//                 error: "Unauthorized",
//             });
//         }

//         const projects = await WebsiteProjectModel.find({ userId: userId })
//             .sort({ createdAt: -1 });

//         // Get conversations and versions for each project
//         const projectsWithDetails = await Promise.all(
//             projects.map(async (project) => {
//                 const conversations = await ConversationModel.find({ 
//                     projectId: project._id 
//                 }).sort({ timestamp: 1 });
                
//                 const versions = await VersionModel.find({ 
//                     projectId: project._id 
//                 }).sort({ timestamp: 1 });

//                 return {
//                     ...project.toObject(),
//                     conversations,
//                     versions
//                 };
//             })
//         );

//         return res.status(200).json({
//             success: true,
//             message: "Projects fetched successfully",
//             data: { projects: projectsWithDetails }
//         });
//     } catch (error: any) {
//         console.error("Error getting all user projects:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to get user projects",
//             error: error.message || "Internal server error",
//         });
//     }
// };


// // toggle project publish
// export const togglePubish = async (req: AuthRequest, res: Response) => {
//     const userId = req.userId;
//     try {
//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized",
//                 error: "Unauthorized",
//             });
//         }

//        const {projectId} = req.params;
//        const project = await WebsiteProjectModel.findOne({
//             _id: projectId,
//             userId: userId
//        });

//        if(!project){
//         return res.status(404).json({
//             success: false,
//             message: "Project not found",
//             error: "Project not found",
//         });
//        }

//        project.isPublished = !project.isPublished;
//        await project.save();

//         return res.status(200).json({
//             success: true,
//             message: project.isPublished ? 'Project published successfully' : 'Project unpublished successfully',
//             data: { isPublished: project.isPublished }
//         });
//     }
//     catch (error: any) {
//         console.error("Error toggling project publish:", error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || "Failed to toggle project publish",
//             error: error.message || "Internal server error",
//         });
//     }
// }


// // purchase credits
// export const PurchasedCredit = async (req: AuthRequest, res: Response) => {
//     const userId = req.userId;
//     try {
//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized",
//                 error: "Unauthorized",
//             });
//         }

//         const { credits, amount } = req.body;

//         if (!credits || !amount) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Credits and amount are required",
//                 error: "Missing required fields",
//             });
//         }

//         const user = await getUserById(userId.toString());
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//                 error: "User not found",
//             });
//         }

//         // Update user credits
//         user.credits += credits;
//         await user.save();

//         return res.status(200).json({
//             success: true,
//             message: "Credits purchased successfully",
//             data: { credits: user.credits },
//         });
//     } catch (error: any) {
//         console.error("Error purchasing credits:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Failed to purchase credits",
//             error: error.message || "Internal server error",
//         });
//     }
// };  



import { Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import WebsiteProjectModel from "../models/websiteProject.model.js";
import ConversationModel, { Role } from "../models/conversation.model.js";
import VersionModel from "../models/version.model.js";
import openai from "../configs/openai.js";
import { AuthRequest } from "../types/auth.types.js";
import { getUserById } from "../services/auth.service.js";

/* =========================
   GET USER CREDITS
========================= */
export const getUserCredits = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await getUserById(req.userId.toString());
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User credits fetched successfully",
      data: { credits: user.credits },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user credits",
      error: error.message,
    });
  }
};

/* =========================
   CREATE USER PROJECT
========================= */
export const createUserProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { initial_prompt } = req.body;

    if (!userId || !initial_prompt) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    // // Atomic credit deduction
    // const user = await User.findOneAndUpdate(
    //   { _id: userId, credits: { $gte: 3 } },
    //   { $inc: { credits: -3, totalCreation: 1 } },
    //   { new: true }
    // );

    // if (!user) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Insufficient credits",
    //   });
    // }

    const projectName =
      initial_prompt.length > 50
        ? initial_prompt.slice(0, 47) + "..."
        : initial_prompt;

    const project = await WebsiteProjectModel.create({
      name: projectName,
      initial_prompt,
      userId,
    });

    await ConversationModel.create({
      role: Role.user,
      content: initial_prompt,
      projectId: project._id,
    });

    // Immediate response
    res.status(200).json({
      success: true,
      message: "Project created successfully",
      data: { projectId: project._id.toString() },
    });

    // Background AI generation
    (async () => {
      try {
        const enhanceRes = await openai.chat.completions.create({
          model: "arcee-ai/trinity-large-preview:free",
          messages: [
            {
              role: "system",
              content:
                "Enhance the website request with design, UX, responsiveness, and best practices. Return only the enhanced prompt.",
            },
            { role: "user", content: initial_prompt },
          ],
        });

        const enhancedPrompt =
          enhanceRes.choices[0].message.content || initial_prompt;

        await ConversationModel.create({
          role: Role.assistant,
          content: enhancedPrompt,
          projectId: project._id,
        });

        const codeRes = await openai.chat.completions.create({
          model: "arcee-ai/trinity-large-preview:free",
          messages: [
            {
              role: "system",
              content:
                "Generate a complete single-page HTML website using Tailwind CSS only. Output HTML only.",
            },
            { role: "user", content: enhancedPrompt },
          ],
        });

        const rawCode = codeRes.choices[0].message.content || "";
        const cleanCode = rawCode
          .replace(/```[a-z]*\n?/gi, "")
          .replace(/```/g, "")
          .trim();

        const version = await VersionModel.create({
          code: cleanCode,
          description: "Initial version",
          projectId: project._id,
        });

        await WebsiteProjectModel.findByIdAndUpdate(project._id, {
          current_code: cleanCode,
          current_version_index: version._id.toString(),
        });

        await ConversationModel.create({
          role: Role.assistant,
          content:
            "I've created your website! You can now preview it and request changes.",
          projectId: project._id,
        });
      } catch (bgError) {
        console.error("Background project creation error:", bgError);
        // await User.findByIdAndUpdate(userId, { $inc: { credits: 3 } });
      }
    })();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user project",
      error: error.message,
    });
  }
};

/* =========================
   GET USER PROJECT BY ID
========================= */
export const getUserProject = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    if (
      !req.userId ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const project = await WebsiteProjectModel.findOne({
      _id: projectId,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const conversations = await ConversationModel.find({
      projectId: project._id,
    }).sort({ timestamp: 1 });

    const versions = await VersionModel.find({
      projectId: project._id,
    }).sort({ timestamp: 1 });

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: {
        project: {
          ...project.toObject(),
          conversations,
          versions,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user project",
      error: error.message,
    });
  }
};

/* =========================
   GET ALL USER PROJECTS
========================= */
export const getUserProjects = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const projects = await WebsiteProjectModel.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: { projects },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user projects",
      error: error.message,
    });
  }
};

/* =========================
   TOGGLE PROJECT PUBLISH
========================= */
export const togglePubish = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    if (
      !req.userId ||
      !(projectId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
      });
    }

    const project = await WebsiteProjectModel.findOne({
      _id: projectId,
      userId: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.isPublished = !project.isPublished;
    await project.save();

    return res.status(200).json({
      success: true,
      message: project.isPublished
        ? "Project published successfully"
        : "Project unpublished successfully",
      data: { isPublished: project.isPublished },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle publish",
      error: error.message,
    });
  }
};

/* =========================
   PURCHASE CREDITS
========================= */
export const PurchasedCredit = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { credits, amount } = req.body;

    const CREDIT_PACKS: Record<number, number> = {
      10: 100,
      25: 200,
      50: 350,
    };

    if (!CREDIT_PACKS[credits] || CREDIT_PACKS[credits] !== amount) {
      return res.status(400).json({
        success: false,
        message: "Invalid credit purchase",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { credits } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Credits purchased successfully",
      data: { credits: user?.credits },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to purchase credits",
      error: error.message,
    });
  }
};