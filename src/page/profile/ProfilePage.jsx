// ProfilePage.jsx
import { useState } from "react";
import {
  Button,
  TextField,
  Avatar,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import { update } from "../../redux/apiCalls";
import { userRequest } from "../../requestMethod";
import toast, { Toaster } from "react-hot-toast";

const ProfilePageContainer = styled("div")({
  flexGrow: 1,
});

const AvatarImage = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(15),
  height: theme.spacing(15),
  marginBottom: theme.spacing(2),
  marginLeft: "auto",
  marginRight: "auto",
  display: "block",
}));

const ProfilePage = () => {
  // @ts-ignore
  const user = useSelector((state) => state?.user?.userInfo);
  const dispatch = useDispatch();
 
  const [profileImage, setProfileImage] = useState(user?.image);
  const [isDateOfBirthFocused, setIsDateOfBirthFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [updated,setUpdated] = useState(false); 

  const [profileData, setProfileData] = useState({
    nom: user?.nom,
    prenom: user?.prenom,
    email: user?.email,
    num: user?.num,
    image: user?.image,
    isAdmin: user?.isAdmin,
    dateOfBirth: user?.dateOfBirth,
    password: user?.password,
    address: user?.address,
  });

  const handleEditPassword = async () => {
    try {
      await userRequest.patch("/user/change-password",{oldPassword, newPassword, repeatNewPassword:newPassword});
      toast.success('Password updated successfully',{
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setOpenDialog(false);
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      console.log(error);
      setOldPassword("");
      setNewPassword("");
      toast.error('Error updating password', {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  }

  // useEffect(() => {
  //   console.log("Token from Redux:", token); // Affiche le token dans la console
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:3000/api/user/userinfo",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       const userData = response.data;
  //       setProfileData(userData);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error.message);
  //     }
  //   };

  //   fetchUserData();

  //   const storedImageUrl = localStorage.getItem("profileImage");
  //   if (storedImageUrl) {
  //     setProfileImage(storedImageUrl);
  //   }
  // }, [token]);

  const handleProfileDataChange = (event) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleImageChange = (event) => {
    setUpdated(true);
    const image = event.target.files[0];
    const imageUrl = URL.createObjectURL(image);
    setProfileData({ ...profileData, image: image });
    setProfileImage(imageUrl);
  };

  const handleEditProfile = async() => {
    try {
      await update(dispatch, profileData);
    } catch (error) {
      console.log(error);
    }
  }
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const response = await axios.patch(
  //       "http://localhost:3000/api/user/update",
  //       profileData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       console.log("Profile updated successfully");
  //     } else {
  //       console.error("Failed to update profile");
  //     }
  //   } catch (error) {
  //     console.error("Error updating profile:", error.message);
  //   }
  // };
  const handleDateOfBirthFocus = () => {
    setIsDateOfBirthFocused(true);
  };

  const handleDateOfBirthBlur = () => {
    setIsDateOfBirthFocused(false);
  };

  const handleEmailFocus = () => {
    setIsEmailFocused(true);
  };

  const handleEmailBlur = () => {
    setIsEmailFocused(false);
  };

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // const changePassword = async (oldPassword, newPassword) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3000/api/user/updatePassword",
  //       { oldPassword, newPassword },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 201) {
  //       console.log("Password changed successfully");
  //     } else {
  //       throw new Error("Failed to change password");
  //     }
  //   } catch (error) {
  //     console.error("Error changing password:", error.message);
  //   }
  // };

  // const handlePasswordChange = async () => {
  //   try {
  //     await changePassword(oldPassword, newPassword);
  //     setOldPassword("");
  //     setNewPassword("");
  //     handleCloseDialog();
  //   } catch (error) {
  //     console.error("Error changing password:", error.message);
  //   }
  // };

  return (
    <Box>
      <Header title="Profile Page" subTitle="Modify your account here" />
      <ProfilePageContainer>
        <AvatarImage src={updated ? profileImage : `http://localhost:3000/${profileImage}`} alt="Profile" />
        <Box display="flex" justifyContent="center" marginBottom={2}>
          <label htmlFor="upload-button">
            <Button variant="contained" component="span">
              Choose Picture
            </Button>
            <input
              id="upload-button"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </label>
        </Box>
        <form>
          <TextField
            fullWidth
            label="Last Name"
            name="nom"
            value={profileData.nom}
            onChange={handleProfileDataChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="First Name"
            name="prenom"
            value={profileData.prenom}
            onChange={handleProfileDataChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="num"
            value={profileData.num}
            onChange={handleProfileDataChange}
            variant="outlined"
            margin="normal"
          />
          {/* <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={profileData.dateOfBirth}
            onChange={handleProfileDataChange}
            onFocus={handleDateOfBirthFocus}
            onBlur={handleDateOfBirthBlur}
            variant="outlined"
            margin="normal"
            InputLabelProps={{
              style: {
                visibility: isDateOfBirthFocused ? "visible" : "hidden",
              },
            }}
          /> */}
          
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleProfileDataChange}
            // onFocus={handleEmailFocus}
            // onBlur={handleEmailBlur}
            variant="outlined"
            margin="normal"
          
          />
          <Button onClick={handleOpenDialog}>Change Password</Button>
          {/* <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={profileData.password}
            onChange={handleProfileDataChange}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
            variant="outlined"
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton onClick={toggleShowPassword} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
            InputLabelProps={{
              style: {
                visibility:
                  isPasswordFocused || !profileData.password
                    ? "visible"
                    : "hidden",
              },
            }}
          /> */}
          {/* <TextField
            fullWidth
            label="Access"
            name="isAdmin"
            value={profileData.isAdmin}
            onChange={handleProfileDataChange}
            variant="outlined"
            margin="normal"
          /> */}
         

          <Box display="flex" justifyContent="center">
            <Button onClick={handleEditProfile} variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </form>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditPassword} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </ProfilePageContainer>
      <Toaster />
    </Box>
  );
};
export default ProfilePage;
