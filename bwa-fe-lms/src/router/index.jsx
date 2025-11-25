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
import StudentCreatePage from "../pages/Manager/StudentCreate";
import { MANAGER_SESSION, STORAGE_KEY } from "../utils/const";
import {
  detailContent,
  getCategories,
  getCourse,
  getDetailCourse,
} from "../services/courseServices";
import { getStudent, getStudentById } from "../services/studentServices";

const router = createBrowserRouter([
  { path: "/", element: <ManagerHomePage /> },
  { path: "/manager/sign-in", element: <SigninPage /> },
  { path: "/manager/sign-up", element: <SignupPage /> },
  { path: "/manager/success-checkout", element: <SuccessCheckoutPage /> },
  {
    path: "/manager",
    id: MANAGER_SESSION,
    loader: async () => {
      const session = secureLocalStorage.getItem(STORAGE_KEY);
      // console.log(session)

      if (!session || session.role !== "manager") {
        throw redirect("/manager/sign-in");
      }

      return session;
    },
    element: <LayoutDashboard />,
    children: [
      {
        index: true,
        element: <ManagerHomePage />,
      },
      {
        path: "/manager/courses",
        loader: async () => {
          const data = await getCourse();
          // console.log(data)

          return data;
        },
        element: <ManageCoursePage />,
      },
      {
        path: "/manager/courses/create",
        loader: async () => {
          const categories = await getCategories();
          // console.log(categories)

          return { categories, course: null };
        },
        element: <CreateCoursePage />,
      },
      {
        path: "/manager/courses/:id",
        loader: async ({ params }) => {
          const course = await getDetailCourse(params.id);

          return { course: course?.data };
        },
        element: <ManageCourseDetailPage />,
      },
      {
        path: "/manager/courses/edit/:id",
        loader: async ({ params }) => {
          // console.log(params)
          const course = await getDetailCourse(params.id);
          // console.log(categories)
          // console.log(course)

          return { course: course?.data };
        },
        element: <CreateCoursePage />,
      },
      {
        path: "/manager/courses/:id/create",
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/edit/:contentId",
        loader: async ({ params }) => {
          const content = await detailContent(params.contentId);
          // console.log(content);

          return content?.data;
        },
        element: <ManageContentCreatePage />,
      },
      {
        path: "/manager/courses/:id/preview",
        loader: async ({ params }) => {
          const course = await getDetailCourse(params.id, true);

          return course?.data;
        },
        element: <CoursePreviewPage />,
      },
      {
        path: "/manager/students",
        loader: async () => {
          const students = await getStudent();
          // console.log(students);

          return students?.data;
        },
        element: <StudentsPage />,
      },
      {
        path: "/manager/students/create",
        element: <StudentCreatePage />,
      },
      {
        path: "/manager/students/edit/:id",
        loader: async ({ params }) => {
          const student = await getStudentById(params.id);

          return student?.data;
        },
        element: <StudentCreatePage />,
      },
    ],
  },
  {
    path: "/student",
    element: <LayoutDashboard isAdmin={false} />,
    children: [
      {
        index: true,
        element: <StudentPage />,
      },
      {
        path: "/student/detail-course/:id",
        element: <CoursePreviewPage />,
      },
    ],
  },
]);

export default router;
