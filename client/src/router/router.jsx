import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "../Layout/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Quiz from "../pages/Quiz";
import Dashboard from "../pages/Dashboard";
import AddQuiz from "../pages/AddQuiz";
import Rank from "../pages/Rank";
import AddQuestion from "../pages/AddQuestion";
import CategoryAdd from "../pages/CategoryAdd";
import UserList from "../pages/UserList";
import PrivateRoute from "./PrivateRoute";
import { useContext } from "react";
import { UserContext } from "../Provider/Context";
import Result from "../pages/Result";
import Sidebar from "../pages/components/Sidebar";
import Scores from "../pages/Score";
import Performance from "../pages/Performance";


function AppRouter() {
  const { user } = useContext(UserContext);
  const isAuthenticated = !!user; // Ensure isAuthenticated is a boolean

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/quiz"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} element={<Quiz />} />
            }
          />
          <Route
            path="/dashboard"
            
          >
            <Route
              index
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} element={<Sidebar><Dashboard /></Sidebar>} />
              }
            />
            <Route
              path="/dashboard/add-quiz"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} element={<Sidebar><AddQuiz /></Sidebar>} />
              }
            />
            <Route
              path="/dashboard/add-question/:id"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} element={<Sidebar><AddQuestion /></Sidebar>} />
              }
            />
            <Route
              path="/dashboard/category-add"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} element={<Sidebar><CategoryAdd /></Sidebar>} />
              }
            />
            <Route
              path="/dashboard/user-list"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} element={<Sidebar><UserList /></Sidebar>} />
              }
            />
            <Route
              path="/dashboard/user-list/Performance/:id"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} element={<Sidebar><Performance /></Sidebar>} />
              }
            />
            <Route
              path="/dashboard/rank"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} element={<Sidebar><Rank /></Sidebar>} />
              }
            />
            <Route
              path="/dashboard/scores"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated} element={<Sidebar><Scores /></Sidebar>} />
              }
            />
          </Route>
          <Route
            path="/result"
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} element={<Result />} />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default AppRouter;
