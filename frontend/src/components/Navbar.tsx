  // import React, { use } from 'react'
  // import { assets } from '../assets/assets';
  // import { Link, useNavigate } from 'react-router-dom';

  // const Navbar = () => {
  //     const [menuOpen, setMenuOpen] = React.useState(false);
  //     const navigate = useNavigate();
  //   return (
  //     <>
  //           <nav className="z-50 flex items-center justify-between w-full py-4 px-4 md:px-16 lg:px-24 xl:px-32 backdrop-blur border-b text-white border-slate-800">
  //         <Link to="/">
  //             <img src={assets.logo} alt="logo"  className='' />
  //           </Link>




  //           <div className="hidden md:flex items-center gap-8 transition duration-500">
  //             <Link to="/" className="hover:text-slate-300 transition">Home</Link>
  //             <Link to="/projects" className="hover:text-slate-300 transition">My Projects</Link>
  //             <Link to="/community" className="hover:text-slate-300 transition">Community</Link>
  //             <Link to="/pricing" className="hover:text-slate-300 transition">Pricing</Link>
  //           </div>

  //           <div className="flex items-center gap-3">
              
  //             <button onClick={()=>navigate('/auth/signin')} className="px-6 py-1.5 max-sm:text-sm bg-indigo-600 active:scale-95 hover:bg-indigo-700 transition rounded-md">
  //               Get started
  //             </button>
  //           </div>

  //           <button id="open-menu" className="md:hidden active:scale-90 transition" onClick={() => setMenuOpen(true)} >
  //             <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
  //           </button>
  //         </nav>

  //         {/* Mobile Menu */}
  //         {menuOpen && (
  //           <div className="fixed inset-0 z-[100] bg-black/60 text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300">
  //             <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
  //             <Link to="/projects" onClick={() => setMenuOpen(false)}>My Projects</Link>
  //             <Link to="/community" onClick={() => setMenuOpen(false)}>Community</Link>
  //             <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
              
  //             <button className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex" onClick={() => setMenuOpen(false)} >
  //               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  //             </button>
  //           </div>
  //         )}
  //         <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/hero/bg-gradient-2.png" className="absolute inset-0 -z-10 size-full opacity" alt="" />



  //     </>
  //   )
  // }

  // export default Navbar

  import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  // Credits come from user object (returned by /api/auth/me)
  // const credits = user?.credits ?? 0;

  return (
    <>
      <nav className="z-50 flex items-center justify-between w-full py-2 px-3 md:px-10 lg:px-16 xl:px-20 backdrop-blur border-b text-white border-slate-800">
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className="h-7 md:h-8 object-contain"
          />
        </Link>

        <div className="hidden md:flex items-center gap-6 transition duration-500">
          <Link to="/" className="hover:text-slate-300 transition">
            Home
          </Link>
          <Link to="/projects" className="hover:text-slate-300 transition">
            My Projects
          </Link>
          <Link to="/community" className="hover:text-slate-300 transition">
            Community
          </Link>
          <Link to="/pricing" className="hover:text-slate-300 transition">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-2">
         {loading ? (
          <div className="px-4 py-1 text-sm text-gray-400">Loading...</div>
         ) : !user ? (
          <button
            onClick={() => navigate('/auth/signin')}
            className="px-4 py-1 max-sm:text-sm bg-indigo-600 active:scale-95 hover:bg-indigo-700 transition rounded-md"
          >
            Get started
          </button>
         ): (
          <div className="flex items-center gap-3">      
            
            <button
              type="button"
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">{user.name}</span>
            </button>
            {/* <button className='bg-white/10 px-5 py-1.5 text-xs sm:text-sm border text-gray-200 rounded-full'>Credits: <span className='text-indigo-300'>{credits}</span> </button> */}
            <button
              onClick={async () => {
                try {
                  await signOut();
                  navigate("/");
                } catch (error) {
                  // Error is already handled by toast in signOut
                }
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
         ) 
          }
        </div>

        <button
          className="md:hidden active:scale-90 transition"
          onClick={() => setMenuOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 text-white backdrop-blur flex flex-col items-center justify-center text-base gap-6 md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/projects" onClick={() => setMenuOpen(false)}>
            My Projects
          </Link>
          <Link to="/community" onClick={() => setMenuOpen(false)}>
            Community
          </Link>
          <Link to="/pricing" onClick={() => setMenuOpen(false)}>
            Pricing
          </Link>

          <button
            className="active:ring-2 active:ring-white size-9 bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex items-center justify-center"
            onClick={() => setMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      )}

      <img
        src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/hero/bg-gradient-2.png"
        className="absolute inset-0 -z-10 size-full opacity-90"
        alt=""
      />
    </>
  );
};

export default Navbar;
