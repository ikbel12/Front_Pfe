import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Snackbar,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    num: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData
      );

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setLoginSuccess(true);
          setTimeout(() => navigate("/"), 1000);
        }, 1000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setError("Email already in use");
        }
      }
    }
  };

  const handleSignInClick = () => {
    navigate("/");
  };

  const handleCloseSnackbar = () => {
    setError("");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
          bgcolor="background.default"
          sx={{
            marginTop: "-5vh", // Adjust this value to move the form higher or lower
          }}
        >
          <Box
            component="form"
            role="form"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            maxWidth="600px" // Adjusted the max width to make the form wider
            width="100%" // Ensures the form is responsive
            p={3}
            boxShadow={4}
            bgcolor="background.paper"
            borderRadius={2}
            sx={{
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "grey.300",
            }}
            onSubmit={handleSubmit}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box sx={{ mt: 3, width: "100%" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="prenom"
                    required
                    fullWidth
                    id="prenom"
                    label="First Name"
                    autoFocus
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="nom"
                    label="Last Name"
                    name="nom"
                    autoComplete="family-name"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="num"
                    label="Phone Number"
                    type="tel"
                    id="phoneNumber"
                    autoComplete="tel"
                    value={formData.num}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link onClick={handleSignInClick} variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Container>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error}
      />
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Sign up successful. Redirecting..."
      />
    </ThemeProvider>
  );
}
