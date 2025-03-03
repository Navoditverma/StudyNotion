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
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact"
import PrivateRoute from "./components/core/Auth/PrivateRoute"
import MyProfile from "./components/core/Dashboard/MyProfile"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart/index"
import { ACCOUNT_TYPE } from "./utils/constants";
import { useSelector } from "react-redux";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses"
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import PurchaseHistory from "./components/core/Dashboard/PurchaseHistory"
import Settings from "./components/core/Dashboard/settings/index";

function App()  {
  const {user}=useSelector((state)=>state.profile)
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
        <Route path="about" element={<About/>}/>
        <Route path="/contact" element={<Contact />} />
        <Route element={ <PrivateRoute><Dashboard /></PrivateRoute>}>
          <Route path="dashboard/my-profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
            
            {
              user?.accountType=== ACCOUNT_TYPE.STUDENT && (
                <>
                <Route path="dashboard/cart" element={<Cart/>} />
                <Route path="dashboard/enrolled-courses" element={<EnrolledCourses/>} />
                <Route path="dashboard/purchase-history" element={<PurchaseHistory/>} />
                <Route path="dashboard/Settings" element={<Settings/>} />

                </>
              )
            }
            {
              user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/add-course" element={<AddCourse />} />
                <Route path="dashboard/my-courses" element={<MyCourses />} />
                <Route path="dashboard/edit-course/:courseId" element={<EditCourse/>} />
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/Settings" element={<Settings/>} />



                </>
          )
        }
      </Route>
      <Route path="catalog/:catalogName" element={<Catalog />} />
      <Route path="courses/:courseId" element={<CourseDetails />} />

      <Route element={
                      <PrivateRoute>
                        <ViewCourse/>
                      </PrivateRoute>
                      }
      >
      {
        user?.accountType=== ACCOUNT_TYPE.STUDENT && (
          <>
            <Route
              path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails/>}
            />
          </>
        )
      }
  

      </Route>
      </Routes>
     
    </div>
  );
}

export default App;
