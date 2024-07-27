import React, { useState, useEffect } from "react";
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
  Alert,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getUserDataFromToken } from "../components/jwtUtils";

const theme = createTheme();

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [employerName, setEmployerName] = useState("");
  const [employerPhone, setEmployerPhone] = useState("");
  const [employerCin, setEmployerCin] = useState("");
  const [employerAddress, setEmployerAddress] = useState("");
  const [employerHireDate, setEmployerHireDate] = useState("");
  const [employerBirthDate, setEmployerBirthDate] = useState("");
  const [employerUrl, setEmployerUrl] = useState("");

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
    const token = localStorage.getItem("token");
  const { role } = getUserDataFromToken(token);

  useEffect(() => {
    if (role && role !== "ADMIN") {
      navigate("/unauthorized"); // Redirect if the user is not an ADMIN
    }
  }, [role, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFieldErrors({});

    const errors = {};

    if (!username) errors.username = "Username is required.";
    if (!email) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    if (!confirmPassword)
      errors.confirmPassword = "Confirm Password is required.";
    if (!employerName) errors.employerName = "Employer Name is required.";
    if (!employerPhone) errors.employerPhone = "Employer Phone is required.";
    if (!employerCin) errors.employerCin = "Employer CIN is required.";
    if (!employerAddress)
      errors.employerAddress = "Employer Address is required.";
    if (!employerHireDate)
      errors.employerHireDate = "Employer Hire Date is required.";
    if (!employerBirthDate)
      errors.employerBirthDate = "Employer Birth Date is required.";
    if (!employerUrl) errors.employerUrl = "Employer URL is required.";

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("roles", "USER"); // Adjust as needed
    formData.append("employerName", employerName);
    formData.append("employerPhone", employerPhone);
    formData.append("employerCin", employerCin);
    formData.append("employerAddress", employerAddress);
    formData.append("employerHireDate", employerHireDate);
    formData.append("employerBirthDate", employerBirthDate);
    formData.append("employerUrl", employerUrl);

    try {
      const response = await axios.post(
        "http://localhost:8085/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("Registration successful:", response.data);
      navigate("/login"); // Redirect to login page
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data.message === "Username already exists") {
          setError("Username already exists. Please choose another one.");
        } else {
          setError("Registration failed. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Registration failed:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            marginBottom: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <Grid container spacing={3}>
              {/* Employer Information */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="employerName"
                  label="Employer Name"
                  name="employerName"
                  error={!!fieldErrors.employerName}
                  helperText={fieldErrors.employerName}
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="employerPhone"
                  label="Employer Phone"
                  name="employerPhone"
                  error={!!fieldErrors.employerPhone}
                  helperText={fieldErrors.employerPhone}
                  value={employerPhone}
                  onChange={(e) => setEmployerPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="employerCin"
                  label="Employer CIN"
                  name="employerCin"
                  error={!!fieldErrors.employerCin}
                  helperText={fieldErrors.employerCin}
                  value={employerCin}
                  onChange={(e) => setEmployerCin(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="employerAddress"
                  label="Employer Address"
                  name="employerAddress"
                  error={!!fieldErrors.employerAddress}
                  helperText={fieldErrors.employerAddress}
                  value={employerAddress}
                  onChange={(e) => setEmployerAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="employerHireDate"
                  label="Employer Hire Date"
                  name="employerHireDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldErrors.employerHireDate}
                  helperText={fieldErrors.employerHireDate}
                  value={employerHireDate}
                  onChange={(e) => setEmployerHireDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="employerBirthDate"
                  label="Employer Birth Date"
                  name="employerBirthDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldErrors.employerBirthDate}
                  helperText={fieldErrors.employerBirthDate}
                  value={employerBirthDate}
                  onChange={(e) => setEmployerBirthDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="employerUrl"
                  label="Employer URL"
                  name="employerUrl"
                  error={!!fieldErrors.employerUrl}
                  helperText={fieldErrors.employerUrl}
                  value={employerUrl}
                  onChange={(e) => setEmployerUrl(e.target.value)}
                />
              </Grid>

              {/* User Information */}
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="username"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  error={!!fieldErrors.username}
                  helperText={fieldErrors.username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={!!fieldErrors.email}
                  helperText={fieldErrors.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={!!fieldErrors.password}
                  helperText={fieldErrors.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  error={!!fieldErrors.confirmPassword}
                  helperText={fieldErrors.confirmPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
