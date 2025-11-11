import { createBrowserRouter, redirect } from "react-router-dom";
import ManagerHomePage from "../pages/Manager/Home";
import SigninPage from "../pages/Signin";
import SignupPage from "../pages/Signup";
import SuccessCheckoutPage from "../pages/SuccessCheckOut";
import LayoutDashboard from "../components/Layout";
import ManageCoursePage from "../pages/Manager/Courses";
import CreateCoursePage from "../pages/Manager/CreateCourse";
import ManageCourseDetailPage from "../pages/Manager/CourseDetail";
import ManageContentCreatePage from "../pages/Manager/CourseContentCreate";
import CoursePreviewPage from "../pages/Manager/CoursePreview";
import StudentsPage from "../pages/Manager/Students";
import StudentPage from "../pages/Student";
import secureLocalStorage from "react-secure-storage";
import { MANAGER_SESSION, STORAGE_KEY } from "../utils/const";

const router = createBrowserRouter([
  { path: "/", element: <ManagerHomePage /> },
  { path: "/manager/sign-in", element: <SigninPage /> },
  { path: "/manager/sign-up", element: <SignupPage /> },
  { path: "/manager/success-checkout", element: <SuccessCheckoutPage /> },
  {
    path: "/manager",
    id: MANAGER_SESSION,
    loader: async() => {
      const session = secureLocalStorage.getItem(STORAGE_KEY)
      // console.log(session)

      if (!session || session.role !== 'manager') {
        throw redirect('/manager/sign-in')
      }

      return session
    },
    element: <LayoutDashboard />,
    children: [
      {
        index: true,
        element: <ManagerHomePage />,
      },
      {
        path: "/manager/courses",
        element: <ManageCoursePage />,
      },
      {
        path: "/manager/courses/create",
        element: <CreateCoursePage />,
      },
      {
        path: "/manager/courses/:id",
        element: <ManageCourseDetailPage />,
      },
      {
        path: "/manager/courses/:id/create",
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/preview",
        element: <CoursePreviewPage />,
      },
      {
        path: "/manager/students/create",
        element: <StudentsPage />,
      },
    ],
  },
  {
    path: "/student",
    element: <LayoutDashboard isAdmin={false} />,
    children: [
      {
        index: true,
        element: <StudentPage />
      },
      {
        path: '/student/detail-course/:id',
        element: <CoursePreviewPage />,
      },
    ]
  }
]);

export default router;
