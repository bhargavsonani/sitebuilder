// import React, {
//   forwardRef,
//   useRef,
//   useImperativeHandle,
//   useState,
//   useEffect,
// } from 'react'
// import type { Project } from '../types'
// import { iframeScript } from '../assets/assets'
// import EditorPanel from './EditorPanel'

// export interface ProjectPreviewRef {
//   getCode: () => string | undefined
// }

// interface ProjectPreviewProps {
//   project: Project
//   isGenrating: boolean
//   device?: 'phone' | 'tablet' | 'desktop'
//   showEditorPanel?: boolean
// }

// const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(
//   (
//     {
//       project,
//       isGenrating,
//       device = 'desktop',
//       showEditorPanel = true,
//     },
//     ref
//   ) => {
//     const iframeRef = useRef<HTMLIFrameElement>(null)
//     const [selectedElement, setSelectedElement] = useState<any>(null)

//     const resolution = {
//       phone: 'w-[412px]',
//       tablet: 'w-[768px]',
//       desktop: 'w-full',
//     }

//     useEffect(()=>{
//       const handleMessage = (event: MessageEvent) => {
//         if (event.data.type === 'elementSelected') {
//           setSelectedElement(event.data.element)
//         } 
//         else if(event.data.type === 'CLEAR_SELECTION')
//           setSelectedElement(null)
//       }
//       window.addEventListener('message', handleMessage)
//       return () => {
//         window.removeEventListener('message', handleMessage)
//       }
//     },[]);

//     const handleUpdate = (updates: any) => {
//       if(iframeRef.current?.contentWindow)
//         iframeRef.current.contentWindow.postMessage({type:'updateElement', payload:updates},'*')
//     }

//     const injectPreview = (html: string) => {
//       if (!html) return ''
//       if (showEditorPanel) return html
//       if (html.includes('</body>')) {
//         return html.replace('</body>', iframeScript + '</body>')
//       } else {
//         return html + iframeScript
//       }
//     }

//     // expose methods to parent
//     useImperativeHandle(ref, () => ({
//       getCode: () => project.current_code,
//     }))

//     return (
//       <div className="relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2">
//         {project.current_code ? (
//           <>
//           <iframe
//             ref={iframeRef}
//             srcDoc={injectPreview(project.current_code)}
//             className={`h-full max-sm:w-full ${
//               resolution[device]
//             } mx-auto transition-all`}

//           />
//           {showEditorPanel && selectedElement && (
//             <EditorPanel
//               selectedElement={selectedElement}
//               onUpdate={handleUpdate}

//               onClose={() => {}
//                 setSelectedElement(null)
//                 if(iframeRef.current?.contentWindow)
//                   iframeRef.current.contentWindow.postMessage({type:'CLEAR_SELECTION'},'*')

//               }
//             />

//           )}
//           </>
          
//         ) : (
//           isGenrating && (
//             <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
//               loading
//             </div>
//           )
//         )}
//       </div>
//     )
//   }
// )

// export default ProjectPreview


import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useEffect,
  use,
} from 'react'
import type { Project } from '../types'
import { iframeScript } from '../assets/assets'
import EditorPanel from './EditorPanel'
import { data } from 'react-router'
import LoaderSteps from './LoaderSteps'

export interface ProjectPreviewRef {
  getCode: () => string | undefined
}

interface ProjectPreviewProps {
  project: Project
  isGenrating: boolean
  device?: 'phone' | 'tablet' | 'desktop'
  showEditorPanel?: boolean
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(
  (
    {
      project,
      isGenrating,
      device = 'desktop',
      showEditorPanel = true,
    },
    ref
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null)
    const [selectedElement, setSelectedElement] = useState<any>(null)

    console.log('showEditorPanel:', showEditorPanel)
    console.log('selectedElement:', selectedElement)

    const resolution = {
      phone: 'w-[412px]',
      tablet: 'w-[768px]',
      desktop: 'w-full',
    }

    useImperativeHandle(ref, () => ({
      getCode: () =>{
        const doc = iframeRef.current?.contentDocument ;
        if(!doc) return undefined;
          // remove our selection class/ attributrs / outline from all elements
          doc.querySelectorAll('.ai-selected-element,[data-ai-selected]').forEach((el)=>{
            el.classList.remove('ai-selected-element');
            el.removeAttribute('data-ai-selected');
            (el as HTMLElement).style.outline = '';
          })

          // remove injected style +script from the document
          const previewStyle = doc.getElementById('ai-preview-style');
          if(previewStyle) previewStyle.remove();
          const previewScript = doc.getElementById('ai-preview-script');
          if(previewScript) previewScript.remove();

          // serialize the clean html
          const html =doc.documentElement.outerHTML
          return html;
        }
        
    }))

    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        console.log('Message received:', event.data)
        
        if (event.data.type === 'elementSelected') {
          console.log('Element selected:', event.data.element)
          setSelectedElement(event.data.element)
        } 
        else if (event.data.type === 'CLEAR_SELECTION') {
          console.log('Clearing selection')
          setSelectedElement(null)
        }
      }
      
      window.addEventListener('message', handleMessage)
      console.log('Message listener added')
      
      return () => {
        window.removeEventListener('message', handleMessage)
        console.log('Message listener removed')
      }
    }, [])

    const handleUpdate = (updates: any) => {
      console.log('Updating element:', updates)
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'updateElement', payload: updates }, '*')
      }
    }

    const injectPreview = (html: string) => {
      if (!html) return ''
      
      console.log('showEditorPanel in inject:', showEditorPanel)
      
      // Inject script when showEditorPanel is TRUE
      if (!showEditorPanel) {
        console.log('Skipping script injection - editor panel disabled')
        return html
      }
      
      console.log('Injecting iframe script')
      
      if (html.includes('</body>')) {
        return html.replace('</body>', iframeScript + '</body>')
      } else {
        return html + iframeScript
      }
    }

    // expose methods to parent
    useImperativeHandle(ref, () => ({
      getCode: () => project.current_code,
    }))

    const shouldShowPanel = showEditorPanel && selectedElement
    console.log('Should show panel:', shouldShowPanel)

    return (
      <div className="relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2">
        {project.current_code ? (
          <>
            <iframe
              ref={iframeRef}
              srcDoc={injectPreview(project.current_code)}
              className={`h-full max-sm:w-full ${resolution[device]} mx-auto transition-all`}
              sandbox="allow-scripts allow-same-origin"
            />
            {shouldShowPanel && (
              <EditorPanel
                selectedElement={selectedElement}
                onUpdate={handleUpdate}
                onClose={() => {
                  console.log('Closing editor panel')
                  setSelectedElement(null)
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage({ type: 'CLEAR_SELECTION' }, '*')
                  }
                }}
              />
            )}
          </>
        ) : (
          isGenrating && (
            // <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            //   <div className="text-white">Loading...</div>
            // </div>
            <LoaderSteps/>
          )
        )}
      </div>
    )
  }
)

ProjectPreview.displayName = 'ProjectPreview'

export default ProjectPreview