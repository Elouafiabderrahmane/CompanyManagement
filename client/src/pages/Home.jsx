import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          backgroundImage: 'url("https://source.unsplash.com/random/1600x900")', // Replace with your image URL
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional dark overlay
          }}
        />
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            padding: 4,
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Our Website
          </Typography>
          <Typography variant="h5" component="p" paragraph>
            Explore our features and services. We are dedicated to providing you
            with the best experience possible.
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Get Started
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Home;
