import React, { useMemo, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { Box } from "@mui/material";
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  DeleteOutline,
} from "@mui/icons-material";
import Header from "../../components/Header";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { userRequest } from "../../requestMethod";

const Team = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [modifyRoleDialog, setModifyRoleDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToModifyRole, setUserToModifyRole] = useState("");
  const [newUserData, setNewUserData] = useState({
    prenom: "",
    nom: "",
    email: "",
    num: "",
    password: "",
    isAdmin: false,
  });
  const [newRole, setNewRole] = useState("User");

  const columns = useMemo(
    () => [
      {
        field: "_id",
        headerName: "Login ID",
        width: 100,
        align: "left",
        headerAlign: "left",
        flex: 0.7,
      },
      {
        field: "prenom",
        headerName: "First Name",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "nom",
        headerName: "Last Name",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "email",
        headerName: "Email",
        flex: 0.6,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "num",
        headerName: "Phone",
        flex: 0.4,
        align: "left",
        headerAlign: "left",
      },
      {
        field: "isAdmin",
        headerName: "Access",
        flex: 0.25,
        align: "left",
        headerAlign: "left",
        renderCell: ({ row }) => {
          let icon;
          let backgroundColor;
          if (row.isAdmin) {
            icon = (
              <AdminPanelSettingsOutlined
                sx={{ color: "#fff" }}
                fontSize="small"
              />
            );
            backgroundColor = theme.palette.primary.dark;
          } else {
            icon = <LockOpenOutlined sx={{ color: "#fff" }} fontSize="small" />;
            backgroundColor = "#3da58a";
          }

          return (
            <Box
              sx={{
                p: "5px",
                width: "99px",
                borderRadius: "3px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 1,
                backgroundColor,
              }}
            >
              {icon}
              <Typography sx={{ fontSize: "13px", color: "#fff" }}>
                {row.isAdmin ? "Admin" : "User"}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteOutline />}
            onClick={() => handleDeleteUserClick(row._id)}
          >
            Delete
          </Button>
        ),
      },
    ],
    [theme.palette.primary.dark]
  );

  const handleDeleteUserClick = (id) => {
    setUserToDelete(id);
    setConfirmDeleteDialog(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/user/${userToDelete}`);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userToDelete)
      );
      setConfirmDeleteDialog(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleModifyRoleClick = (id) => {
    setUserToModifyRole(id);
    setModifyRoleDialog(true);
  };

  const handleModifyRole = async () => {
    try {
      console.log(newRole);
      await userRequest.patch(`/user/update-role/${userToModifyRole}`, {
        isAdmin: newRole === "User" ? false : true,
      });

      setModifyRoleDialog(false);
      setUserToModifyRole("");
      fetchUsers();
    } catch (error) {
      console.error("Error modifying user role:", error);
      toast.error("Failed to modify user role.", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/allUsers"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/register", newUserData);

      setOpenDialog(false);
      setNewUserData({
        prenom: "",
        nom: "",
        email: "",
        num: "",
        password: "",
        isAdmin: false,
      });

      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(error.response.data, {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  return (
    <Box>
      <Toaster />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          px: 2,
        }}
      >
        <Header title={"TEAM"} subTitle={"Managing the Team Members"} />
        <Box sx={{ marginLeft: "auto" }}>
          {" "}
          {/* Placez la modification ici */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Create User
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModifyRoleDialog(true)}
            sx={{ marginLeft: "10px" }}
          >
            Modify Role
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: 600, mx: "auto", overflowY: "auto" }}>
        <DataGrid
          rows={users}
          // @ts-ignore
          columns={columns}
          rowHeight={38}
          autoHeight
          getRowId={(row) => row._id}
        />
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            value={newUserData.prenom}
            onChange={(e) =>
              setNewUserData({ ...newUserData, prenom: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={newUserData.nom}
            onChange={(e) =>
              setNewUserData({ ...newUserData, nom: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUserData.email}
            onChange={(e) =>
              setNewUserData({ ...newUserData, email: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            value={newUserData.num}
            onChange={(e) =>
              setNewUserData({ ...newUserData, num: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUserData.password}
            onChange={(e) =>
              setNewUserData({ ...newUserData, password: e.target.value })
            }
          />
          <TextField
            select
            margin="dense"
            label="Access"
            fullWidth
            value={newUserData.isAdmin ? "Admin" : "User"}
            onChange={(e) =>
              setNewUserData({
                ...newUserData,
                isAdmin: e.target.value === "Admin",
              })
            }
            sx={{ marginBottom: "15px" }}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddUser}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDeleteDialog}
        onClose={() => setConfirmDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialog(false)}>Cancel</Button>
          <Button
            sx={{
              backgroundColor: "#fff",
              color: "red",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={handleDeleteUser}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={modifyRoleDialog}
        onClose={() => setModifyRoleDialog(false)}
      >
        <DialogTitle>Modify User Role</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User ID"
            fullWidth
            value={userToModifyRole}
            onChange={(e) => setUserToModifyRole(e.target.value)}
          />
          <TextField
            select
            margin="dense"
            label="Role"
            fullWidth
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            sx={{ marginBottom: "15px" }}
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModifyRoleDialog(false)}>Cancel</Button>
          <Button onClick={handleModifyRole}>Modify</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Team;
