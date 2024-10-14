import "./App.css";
import { Routes ,Route} from "react-router-dom";
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import Signup from "./pages/Signup";
import About from "./pages/About";

function App() {
  return (
    <div  className="w-screen min-h-screen bg-richblack-900 flex flex-col">
      <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>} />
    
        <Route path="login" element={<OpenRoute> <Login/> </OpenRoute>}/>
        <Route path="signup" element={<Signup/> }/>
        <Route path="forgot-password" element={<OpenRoute> <ForgotPassword/> </OpenRoute>}/>
        <Route path="update-password/:id" element={<OpenRoute> <UpdatePassword/> </OpenRoute>}/>
        <Route path="verify-email" element={<OpenRoute> <VerifyEmail/> </OpenRoute>}/>
        <Route path="about" element={<OpenRoute> <About/> </OpenRoute>}/>



      </Routes>
     
    </div>
  );
}

export default App;
