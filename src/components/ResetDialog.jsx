import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { publicRequest } from '../requestMethod';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetDialog({openDialog, setOpenDialog}) {
  // const [open, setOpen] = React.useState(false);
  const [email,setEmail] = React.useState("");

  const handleClose = () => {
    setOpenDialog(false);
  }
  const handleSubmit = async() => {
    try {
      const response = publicRequest.post("/auth/forget-password",{email});
      console.log(response);
      toast.success("Please check your email to reset your password",{duration: 4000});
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong",{duration: 4000});
    }
  }
  return (
    <React.Fragment>
      <Toaster />
      <Dialog
        open={openDialog}
        onClose={handleClose}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
