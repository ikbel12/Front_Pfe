import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // 1
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { login } from "../../redux/apiCalls";
import { Toaster } from "react-hot-toast";
import ResetDialog from "../../components/ResetDialog";

function SignInSide() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 3
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  // @ts-ignore
  const errorMessage = useSelector((state) => state?.user?.error); // 2


  const handleSubmit = async (/** @type {{ preventDefault: () => void; }} */ event) => {
    event.preventDefault();
    try {
      await login(dispatch, { email, password });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError(
        "Une erreur inattendue s'est produite. Veuillez réessayer plus tard."
      );
    }
  };

  const handleResetPasswordFormClick = () => {
    setOpenDialog(true);
  };

  const handleSignUpClick = () => {
    navigate("/SignUp");
  };

  const defaultTheme = createTheme();

  return (
    <ThemeProvider theme={defaultTheme}>
      <ResetDialog openDialog={openDialog} setOpenDialog={setOpenDialog} />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>

              <Grid container>
                <Grid item xs>
                  <Button onClick={handleResetPasswordFormClick}>
                    Forgot password?
                  </Button>
                </Grid>
                <Grid item>
                  <Link onClick={handleSignUpClick} variant="body2">
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
              {/* {errorMessage && (
                <Typography color="error" variant="body2" align="center">
                  Invalid email or password
                </Typography>
              )} */}
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Toaster />
    </ThemeProvider>
  );
}

export default SignInSide;
