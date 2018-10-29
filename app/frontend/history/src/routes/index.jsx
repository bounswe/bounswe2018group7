import Components from "views/Components/Components.jsx";
import Login from "screens/FullScreen/Auth/Login";
import SignUp from "../screens/FullScreen/Auth/SignUp";

var indexRoutes = [
  { path: "/singin", name: "SigninPage", component: Login },
  { path: "/signup", name: "SignupPage", component: SignUp },
  { path: "/", name: "Components", component: Components }
];

export default indexRoutes;
