import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import TodoList from "./components/TodoList";
import Login from "./components/Login";
import SignUp from "./components/SignUp";

const App = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/todos"
            element={token ? <TodoList /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
