import { Route, Routes, useLocation } from 'react-router-dom'
import Preview from './pages/Preview'
import Pricing from './pages/Pricing'
import Projects from './pages/Projects'
import MyProjects from './pages/MyProjects'
import Community from './pages/Community'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import CursorTrail from './components/CursorTrail'
import { Toaster } from 'sonner'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import View from './pages/View'
import Settings from './pages/Settings'

const App = () => {

  const  { pathname} = useLocation();
  const hideNavbar = pathname.startsWith('/projects/') &&
                    pathname !== '/projects' 
                    || pathname.startsWith('/view/') 
                    || pathname.startsWith('/preview/')
                    || pathname.startsWith('/auth/');

  return (
    <div>
      <Toaster/>
      {
        !hideNavbar && <Navbar />
      }
       <CursorTrail />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/projects/:projectId" element={<Projects />} />
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/preview/:projectId" element={<Preview />} />
        <Route path="/preview/:projectId/:versionId" element={<Preview />} />
        <Route path="/community" element={<Community />} />
        <Route path="/view/:projectId" element={<View />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
      </Routes>
    </div>
  )
}

export default App