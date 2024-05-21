import toast from "react-hot-toast";
import { publicRequest, userRequest } from "../requestMethod";

import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutSuccess,
  updateInfoSuccess,
} from "./userSlice";

export const login = async (/** @type {(arg0: { payload: any; type: "user/loginStart" | "user/loginSuccess" | "user/loginFailed"; }) => void} */ dispatch, /** @type {any} */ user) => {
  dispatch(loginStart());
  try {
    const result = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(result.data));

    window.location.href = "/home";
  } catch (error) {
    dispatch(loginFailed());
    toast.error("Invalid Email or Password", {
      duration: 4000,
      position: "top-center",
      style: { background: "red", color: "white" },
    });
  }
};

export const logout = async (/** @type {(arg0: { payload: undefined; //   style: { background: "red", color: "white" },
   //   style: { background: "red", color: "white" },
  // });
  type: "user/logoutSuccess"; }) => void} */ dispatch) => {
  dispatch(logoutSuccess());
  window.location.href = "/";
};

export const update = async (/** @type {(arg0: { payload: any; //   style: { background: "red", color: "white" },
   //   style: { background: "red", color: "white" },
  // });
  type: "user/updateInfoSuccess"; }) => void} */ dispatch, /** @type {any} */ user) => {
  try {
    const formData = new FormData();
    formData.append("image", user.image);
    formData.append("nom",user.nom);
    formData.append("prenom",user.prenom);
    formData.append("email",user.email);
    formData.append("num", user.num);
    formData.append("address", user.address);
    formData.append("dateOfBirth", user.dateOfBirth);
    formData.append("isAdmin", user.isAdmin);

    const result = await userRequest.patch("/user/update", formData);
    console.log(result);
    dispatch(updateInfoSuccess(result.data));
    toast.success("Profile has been updated", {
      duration: 4000,
      position: "top-center",
      style: { background: "green", color: "white" },
    });
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong", {
      duration: 4000,
      position: "top-center",
      style: { background: "red", color: "white" },
    });
  }
};

export const deleteAccount = async (/** @type {(arg0: { payload: undefined; //   style: { background: "red", color: "white" },
   //   style: { background: "red", color: "white" },
  // });
  type: "user/logoutSuccess"; }) => void} */ dispatch, /** @type {string} */ user) => {
  const result = await publicRequest.delete("/user/delete/" + user);
  dispatch(logoutSuccess(result.data));

  window.location.href = "/";
};
