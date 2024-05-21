import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Header from "../../components/Header";
import toast, { Toaster } from "react-hot-toast";

const Client = () => {
  const theme = useTheme();
  const [clients, setClients] = useState([
    {
      id: 1,
      nom: "Client 1",
      adresse: "Address 1",
      telephone: "123456789",
      email: "client1@example.com",
      services: "Service 1",
    },
    {
      id: 2,
      nom: "Client 2",
      adresse: "Address 2",
      telephone: "987654321",
      email: "client2@example.com",
      services: "Service 2",
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState(null);
  const [newClientData, setNewClientData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    services: "",
  });

  const handleDeleteClick = (id) => {
    setDeleteClientId(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    setClients(clients.filter((client) => client.id !== deleteClientId));
    setOpenConfirmDialog(false);
    toast.success("Client deleted successfully", {
      duration: 4000,
      position: "top-center",
      style: { background: "green", color: "white" },
    });
  };

  const handleCancelDelete = () => {
    setDeleteClientId(null);
    setOpenConfirmDialog(false);
  };

  const handleAddClient = () => {
    const newClient = {
      id: clients.length ? clients[clients.length - 1].id + 1 : 1,
      nom: newClientData.nom,
      adresse: newClientData.adresse,
      telephone: newClientData.telephone,
      email: newClientData.email,
      services: newClientData.services,
    };
    setClients([...clients, newClient]);
    setOpenDialog(false);
    setNewClientData({
      nom: "",
      adresse: "",
      telephone: "",
      email: "",
      services: "",
    });
    toast.success("Client added successfully", {
      duration: 4000,
      position: "top-center",
      style: { background: "green", color: "white" },
    });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100, flex: 0.7 },
    { field: "nom", headerName: "Name", flex: 0.7 },
    { field: "adresse", headerName: "Address", flex: 0.7 },
    { field: "telephone", headerName: "Phone Number", flex: 0.7 },
    { field: "email", headerName: "Email", flex: 0.7 },
    { field: "services", headerName: "Services", flex: 0.7 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.palette.error.main,
            color: "#fff",
            "&:hover": {
              backgroundColor: theme.palette.error.main,
            },
          }}
          size="small"
          startIcon={<DeleteOutline />}
          onClick={() => handleDeleteClick(row.id)}
        >
          Delete
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box>
      <Toaster />
      <Header title="Clients" subTitle="List of Clients" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          mb: 2,
          px: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Add Client
        </Button>
      </Box>
      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={clients}
          // @ts-ignore
          columns={columns}
        />
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={newClientData.nom}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                nom: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            value={newClientData.adresse}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                adresse: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={newClientData.telephone}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                telephone: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={newClientData.email}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                email: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Services"
            fullWidth
            value={newClientData.services}
            onChange={(e) =>
              setNewClientData({
                ...newClientData,
                services: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddClient}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this client?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Client;
