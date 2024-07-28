import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiUrl = "http://localhost:5000/api/auth";

// Async thunk for user registration
const registerUser = createAsyncThunk("auth/registerUser", async (userData) => {
  const response = await axios.post(`${apiUrl}/register`, userData);
  return response.data;
});

// Async thunk for user login
const loginUser = createAsyncThunk("auth/loginUser", async (userData) => {
  const response = await axios.post(`${apiUrl}/login`, userData);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: "",
    token: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.email = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        const decodedToken = jwtDecode(action.payload.token);
        state.email = decodedToken.user.email;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        const decodedToken = jwtDecode(action.payload.token);
        state.email = decodedToken.user.email;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

export { registerUser, loginUser };
