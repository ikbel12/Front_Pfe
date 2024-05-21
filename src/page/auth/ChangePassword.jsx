import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link as RouterLink } from "react-router-dom";
import { publicRequest } from "../../requestMethod";
import LockIcon from "@mui/icons-material/Lock";

export default function ChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [password, setPassword] = useState({ value: "", isValid: true });
  const [confPassword, setConfPassword] = useState({
    value: "",
    isValid: true,
  });
  const { search } = useLocation();

  const resetAlert = (ms) => {
    setTimeout(() => {
      setAlert({ show: false, message: "", type: "" });
    }, ms);
  };

  const querys = {};
  for (const query of search.slice(1).split("&")) {
    const [key, value] = query.split("=");
    querys[key] = value;
  }

  const handlePasswordInputChanges = (e) => {
    setPassword((prevState) => ({
      ...prevState,
      value: e.target?.value,
    }));
  };

  const handleConfPasswordInputChanges = (e) => {
    setConfPassword((prevState) => ({
      ...prevState,
      value: e.target?.value,
    }));
  };

  const validatePasswords = () => {
    setPassword((prevState) => ({
      ...prevState,
      isValid: confPassword.value === prevState.value,
    }));
    setConfPassword((prevState) => ({
      ...prevState,
      isValid: prevState.value === password.value,
    }));
  };

  useEffect(() => {
    validatePasswords();
  }, [password.value, confPassword.value]);

  const sendButtonHandler = () => {
    setIsLoading(true);
    publicRequest
      .put(`/auth/create-password/${querys.token}`, {
        newPassword: password.value,
      })
      .then((response) => {
        console.log(response);
        setAlert({
          show: true,
          message:
            "Réinitialisation de votre mot de passe avec succès. Vous serez redirigé vers la page d'authentification dans quelques secondes...",
          type: "success",
        });
        setTimeout(() => {
          navigate("/");
        }, 10000);
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "ERR_BAD_REQUEST") {
          setAlert({ show: true, message: "Jeton invalide", type: "error" });
        } else if (error.code === "ERR_NETWORK") {
          setAlert({
            show: true,
            message: "Problème côté serveur 500",
            type: "error",
          });
        } else {
          setAlert({ show: true, message: error.message, type: "error" });
        }
        resetAlert(10000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  let userEmail;
  try {
    userEmail = JSON.parse(atob(querys.token?.split(".")[1])).userEmail;
  } catch (error) {
    throw error;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
      sx={{
        marginTop: "-10vh", // Adjust this value to move the form higher or lower
      }}
    >
      <Box
        component="form"
        role="form"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxWidth="360px"
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
      >
        <LockIcon color="primary" style={{ fontSize: 50 }} />
        <Typography variant="h5" mb={4}>
          Change Password
        </Typography>
        <Box mb={2} width="100%">
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            value={userEmail}
            disabled
          />
        </Box>
        <Box mb={2} width="100%">
          <TextField
            fullWidth
            variant="outlined"
            label="New Password"
            type="password"
            error={!password.isValid}
            helperText={!password.isValid && "Passwords do not match"}
            value={password.value}
            onChange={handlePasswordInputChanges}
            onBlur={validatePasswords}
          />
        </Box>
        <Box mb={2} width="100%">
          <TextField
            fullWidth
            variant="outlined"
            label="Confirm Password"
            type="password"
            error={!confPassword.isValid}
            helperText={!confPassword.isValid && "Passwords do not match"}
            value={confPassword.value}
            onChange={handleConfPasswordInputChanges}
            onBlur={validatePasswords}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={!password.isValid || !confPassword.isValid || isLoading}
          onClick={sendButtonHandler}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Confirm"
          )}
        </Button>
        {alert.show && (
          <Typography mt={2} color={alert.type} fontWeight="bold">
            {alert.message}
          </Typography>
        )}
        <Box mt={2}>
          <Link component={RouterLink} to="/" variant="body2" color="primary">
            Return to the Login page
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
