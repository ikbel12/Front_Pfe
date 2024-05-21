import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import Header from "../../components/Header";
import { userRequest } from "../../requestMethod";
import toast, { Toaster } from "react-hot-toast";

const Subscriptions = () => {
  const theme = useTheme();
  const [subscriptions, setSubscriptions] = useState([
    {
      id: "",
      nom: "",
      fournisseur: "",
      date_debut: "",
      date_fin: "",
      statut: "",
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [deleteSubscriptionId, setDeleteSubscriptionId] = useState(null);
  const [newSubscriptionData, setNewSubscriptionData] = useState({
    nom: "",
    fournisseur: "",
    date_debut: "",
    date_fin: "",
    statut: "ok",
  });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await userRequest.get("/service/getallservices");
        // setSubscriptions(response.data);
        console.log(response);

        setSubscriptions(
          response.data.map(
            (
              /** @type {{ _id: any; nom: any; fournisseur: any; date_debut: any; date_fin: any; statut: any; }} */ subscription
            ) => ({
              id: subscription._id,
              nom: subscription.nom,
              fournisseur: subscription.fournisseur,
              date_debut: subscription.date_debut,
              date_fin: subscription.date_fin,
              statut: subscription.statut,
            })
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchSubscriptions();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 100, flex: 0.7 },
    {
      field: "nom",
      headerName: "Service Name",
      flex: 0.7,
      cellClassName: "name-column--cell",
    },
    {
      field: "fournisseur",
      headerName: "Supplier Name",
      flex: 0.5,
      cellClassName: "name-column--cell",
    },
    {
      field: "date_debut",
      headerName: "Start date",
      headerAlign: "left",
      align: "left",
      flex: 0.7,
      width: 120,
    },
    {
      field: "date_fin",
      headerName: "Expiry Date",
      headerAlign: "left",
      flex: 0.7,
      align: "left",
      width: 120,
    },
    {
      field: "statut",
      headerName: "Status",
      flex: 0.3,
      renderCell: ({ row: { statut } }) => (
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
            backgroundColor:
              statut === "expired"
                ? theme.palette.error.main // Red for Expired
                : statut === "ok"
                ? theme.palette.success.main // Green for Not expired
                : "#3da58a",
          }}
        >
          {statut === "expired" && (
            <WarningAmberOutlinedIcon sx={{ color: "#fff" }} fontSize="small" />
          )}
          {statut === "ok" && (
            <GppGoodOutlinedIcon sx={{ color: "#fff" }} fontSize="small" />
          )}
          <Typography sx={{ fontSize: "13px", color: "#fff" }}>
            {statut}
          </Typography>
        </Box>
      ),
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
          sx={{
            backgroundColor: "#fff",
            color: theme.palette.error.main,
            "&:hover": {
              backgroundColor: theme.palette.error.main,
              color: "#fff",
            },
          }}
          size="small"
          startIcon={<DeleteOutline />}
          onClick={() => handleDeleteClick(row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleAddSubscription = async () => {
    try {
      const response = await userRequest.post(
        "/service/create",
        newSubscriptionData
      );
      setSubscriptions([
        ...subscriptions,
        {
          id: response.data._id,
          nom: response.data.nom,
          fournisseur: response.data.fournisseur,
          date_debut: response.data.date_debut,
          date_fin: response.data.date_fin,
          statut: response.data.statut,
        },
      ]);
      setOpenDialog(false);
      toast.success("Subscription added successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to add subscription", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteSubscriptionId(id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await userRequest.delete(
        `/service/deleteservices/${deleteSubscriptionId}`
      );
      setOpenConfirmDialog(false);
      toast.success("Subscription deleted successfully", {
        duration: 4000,
        position: "top-center",
        style: { background: "green", color: "white" },
      });
      setSubscriptions(
        subscriptions.filter(
          (subscription) => subscription.id !== deleteSubscriptionId
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete subscription", {
        duration: 4000,
        position: "top-center",
        style: { background: "red", color: "white" },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteSubscriptionId(null);
    setOpenConfirmDialog(false);
  };

  return (
    <Box>
      <Toaster />
      <Header title="Services" subTitle="List of CLOUD Services" />
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
          Create Service
        </Button>
      </Box>
      <Box sx={{ height: 650, width: "99%", mx: "auto" }}>
        <DataGrid
          slots={{
            toolbar: GridToolbar,
          }}
          rows={subscriptions}
          // @ts-ignore
          columns={columns}
        />
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Service Name"
            fullWidth
            value={newSubscriptionData.nom}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                nom: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Supplier Name"
            fullWidth
            value={newSubscriptionData.fournisseur}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                fournisseur: e.target.value,
              })
            }
          />

          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newSubscriptionData.date_debut}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                date_debut: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Expiry Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newSubscriptionData.date_fin}
            onChange={(e) =>
              setNewSubscriptionData({
                ...newSubscriptionData,
                date_fin: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSubscription}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirmDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this service ?
          </Typography>
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

export default Subscriptions;
