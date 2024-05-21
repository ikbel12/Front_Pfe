import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    isFetching: false,
    error: false,
    token:null
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = true;
      state.userInfo = action.payload;
      state.token = action.payload.accessToken;
    },
    loginFailed: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logoutSuccess: (state) => {
      state.isFetching = false;
      state.userInfo = null;
      state.token = null;
    },
    updateInfoSuccess: (state, action) => {
      state.isFetching = true;
      state.userInfo = action.payload;
    },
    updateImageSuccess: (state, action) => {
      state.isFetching = true;
      state.userInfo = action.payload;
    },
  },
});
export const {
  loginStart,
  loginSuccess,
  loginFailed,
  logoutSuccess,
  updateInfoSuccess,
  updateImageSuccess,
} = userSlice.actions;
export default userSlice.reducer;
