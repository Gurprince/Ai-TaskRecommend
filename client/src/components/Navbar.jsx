import { Link, useNavigate } from 'react-router-dom';

   const Navbar = () => {
     const navigate = useNavigate();

     const handleLogout = () => {
       localStorage.removeItem('token');
       navigate('/login');
     };

     return (
       <nav className="bg-gray-800 p-4">
         <div className="container mx-auto flex justify-between items-center">
           <div className="text-white font-bold">SkillSync AI</div>
           <div className="space-x-4">
             <Link to="/tasks" className="text-white hover:text-gray-300">
               Generate Tasks
             </Link>
             <Link to="/accepted-tasks" className="text-white hover:text-gray-300">
               Accepted Tasks
             </Link>
             <button onClick={handleLogout} className="text-white hover:text-gray-300">
               Logout
             </button>
           </div>
         </div>
       </nav>
     );
   };

   export default Navbar;