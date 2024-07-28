import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTodos,
  addNewTodo,
  updateTodo,
  deleteTodo,
} from "../redux/todoSlice";
import { logout } from "../redux/authSlice"; // Import the logout action
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Typography,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TodoList = () => {
  const userEmail = useSelector((state) => state.auth.email);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [dueDate, setDueDate] = useState(null); // State for due date
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);
  const remainingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchTodos(userEmail));
    }
  }, [dispatch, userEmail]);

  const handleAddTodo = () => {
    if (input.trim()) {
      dispatch(
        addNewTodo({
          userEmail,
          text: input,
          completed: false,
          dueDate, // Pass due date to the API
        })
      );
      setInput("");
      setDueDate(null); // Reset due date after adding
    }
  };

  const handleEditTodo = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id) => {
    if (editText.trim()) {
      dispatch(
        updateTodo({
          id,
          userEmail,
          todoData: { text: editText },
        })
      );
      setEditId(null);
      setEditText("");
    }
  };

  const handleToggleTodo = (id, completed) => {
    dispatch(
      updateTodo({
        id,
        userEmail,
        todoData: { completed: !completed },
      })
    );
  };

  const handleDeleteTodo = (id) => {
    dispatch(
      deleteTodo({
        id,
        userEmail,
      })
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          color="#195377"
        >
          To-Do List
        </Typography>
        <Paper
          elevation={3}
          sx={{ padding: 2, marginBottom: 2, backgroundColor: "#AED6F1" }}
        >
          <Box display="flex" justifyContent="space-between" mb={2}>
            {userEmail && (
              <Box
                sx={{
                  padding: 1,
                  borderRadius: 1,
                  backgroundColor: "#1C5477",
                  border: "2px solid black",
                }}
              >
                <Typography variant="h6" component="div" color="#E6E8EA">
                  Your Email: {userEmail}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#1A5276",
                color: "white",
                "&:hover": { backgroundColor: "#154360" },
              }}
            >
              Logout
            </Button>
          </Box>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            label="Add Todo"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 1 }}
          />
          <div style={{ marginTop: 16 }}>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText="Select Due Date"
              className="form-control"
              style={{
                width: "100%",
                padding: "16px",
                border: "1px solid #ccc",
                borderRadius: "16px",
              }}
            />
          </div>

          <Button
            onClick={handleAddTodo}
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            sx={{
              marginTop: 2,
              backgroundColor: "#1A5276",
              color: "white",
              "&:hover": { backgroundColor: "#154360" },
            }}
            disabled={!userEmail}
          >
            Add
          </Button>
        </Paper>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom color="#95020F">
              Remaining Tasks
            </Typography>
            <Paper
              elevation={3}
              sx={{ padding: 2, backgroundColor: "#ffccbc" }}
            >
              <List>
                {remainingTodos.map((todo) => (
                  <Paper
                    key={todo._id}
                    sx={{ marginBottom: 1, backgroundColor: "#ffe0b2" }}
                  >
                    <ListItem>
                      <Checkbox
                        checked={todo.completed}
                        onChange={() =>
                          handleToggleTodo(todo._id, todo.completed)
                        }
                        color="primary"
                      />
                      {editId === todo._id ? (
                        <TextField
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => handleSaveEdit(todo._id)}
                          fullWidth
                          variant="outlined"
                          sx={{ marginRight: 1 }}
                        />
                      ) : (
                        <>
                          <ListItemText primary={todo.text} />
                          <Typography variant="body2" color="textSecondary">
                            {todo.dueDate
                              ? `Due Date: ${new Date(
                                  todo.dueDate
                                ).toLocaleDateString()}`
                              : "No due date"}
                          </Typography>
                        </>
                      )}
                      <IconButton
                        onClick={() => handleEditTodo(todo._id, todo.text)}
                      >
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteTodo(todo._id)}>
                        <Delete color="secondary" />
                      </IconButton>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom color="#09AF43">
              Completed Tasks
            </Typography>
            <Paper
              elevation={3}
              sx={{ padding: 2, backgroundColor: "#c8e6c9" }}
            >
              <List>
                {completedTodos.map((todo) => (
                  <Paper
                    key={todo._id}
                    sx={{ marginBottom: 1, backgroundColor: "#a5d6a7" }}
                  >
                    <ListItem>
                      <Checkbox
                        checked={todo.completed}
                        onChange={() =>
                          handleToggleTodo(todo._id, todo.completed)
                        }
                        color="primary"
                      />
                      {editId === todo._id ? (
                        <TextField
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onBlur={() => handleSaveEdit(todo._id)}
                          fullWidth
                          variant="outlined"
                          sx={{ marginRight: 1 }}
                        />
                      ) : (
                        <>
                          <ListItemText
                            primary={todo.text}
                            sx={{
                              textDecoration: todo.completed
                                ? "line-through"
                                : "none",
                            }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            {todo.dueDate
                              ? `Due Date: ${new Date(
                                  todo.dueDate
                                ).toLocaleDateString()}`
                              : "No due date"}
                          </Typography>
                        </>
                      )}
                      <IconButton
                        onClick={() => handleEditTodo(todo._id, todo.text)}
                      >
                        <Edit color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteTodo(todo._id)}>
                        <Delete color="secondary" />
                      </IconButton>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TodoList;
