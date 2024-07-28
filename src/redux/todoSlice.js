// redux/todoSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "http://localhost:5000/api/todos"; // Replace with your backend API URL

// Async thunk to fetch todos for a specific user
const fetchTodos = createAsyncThunk("todos/fetchTodos", async (userEmail) => {
  const response = await axios.get(`${apiUrl}/${userEmail}`);
  return response.data;
});

// Async thunk to add a new todo for a specific user
const addNewTodo = createAsyncThunk("todos/addNewTodo", async (todoData) => {
  const response = await axios.post(`${apiUrl}`, todoData);
  return response.data;
});

// Async thunk to update a todo for a specific user
const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, userEmail, todoData }) => {
    const response = await axios.patch(
      `${apiUrl}/${userEmail}/${id}`,
      todoData
    );
    return response.data;
  }
);

// Async thunk to delete a todo for a specific user
const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async ({ id, userEmail }) => {
    await axios.delete(`${apiUrl}/${userEmail}/${id}`);
    return id;
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const updatedIndex = state.todos.findIndex(
          (todo) => todo._id === action.payload._id
        );
        if (updatedIndex !== -1) {
          state.todos[updatedIndex] = action.payload;
        }
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      });
  },
});

export default todoSlice.reducer;

export const selectAllTodos = (state) => state.todos.todos;
export const selectTodoById = (state, todoId) =>
  state.todos.todos.find((todo) => todo._id === todoId);

// Export async action creators
export { fetchTodos, addNewTodo, updateTodo, deleteTodo };
