import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  IconButton,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EmployerDetails = () => {
  const { id } = useParams(); // Get the id from the URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cin: "",
    address: "",
    email: "",
    hireDate: "",
    birthDate: "",
    image: null,
  });

  useEffect(() => {
    fetchEmployerDetails();
  }, [id]);

  const fetchEmployerDetails = () => {
    setLoading(true);
    fetch(`http://localhost:8085/api/employers/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEmployer(data);
        setFormData({
          name: data.name,
          phone: data.phone,
          cin: data.cin,
          address: data.address,
          email: data.email,
          hireDate: data.hireDate,
          birthDate: data.birthDate,
          image: data.image,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employer details:", error);
        setLoading(false);
      });
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleUpdate = () => {
    const formDataToUpdate = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToUpdate.append(key, formData[key]);
    });

    fetch(`http://localhost:8085/api/employers/${id}`, {
      method: "PUT",
      body: formDataToUpdate,
    })
      .then((response) => response.json())
      .then(() => {
        setEditMode(false);
        fetchEmployerDetails(); // Refresh the data
      })
      .catch((error) => {
        console.error("Error updating employer details:", error);
      });
  };

  return (
    <Box padding={3}>
      <IconButton
        onClick={() => navigate("/employers")}
        color="primary"
        aria-label="back"
      >
        <ArrowBackIcon />
      </IconButton>
      {loading ? (
        <CircularProgress />
      ) : employer ? (
        <Card>
          <CardContent>
            <Typography variant="h4">Employer Details</Typography>
            <Box marginY={2}>
              <Typography variant="h6">Name</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{employer.name}</Typography>
              )}
            </Box>
            <Box marginY={2}>
              <Typography variant="h6">Phone</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{employer.phone}</Typography>
              )}
            </Box>
            <Box marginY={2}>
              <Typography variant="h6">Cin</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{employer.cin}</Typography>
              )}
            </Box>
            <Box marginY={2}>
              <Typography variant="h6">Address</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{employer.address}</Typography>
              )}
            </Box>
            <Box marginY={2}>
              <Typography variant="h6">Email</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{employer.email}</Typography>
              )}
            </Box>
            <Box marginY={2}>
              <Typography variant="h6">Hire Date</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{employer.hireDate}</Typography>
              )}
            </Box>
            <Box marginY={2}>
              <Typography variant="h6">Birth Date</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              ) : (
                <Typography>{employer.birthDate}</Typography>
              )}
            </Box>
            {editMode && (
              <Box marginY={2}>
                <Typography variant="h6">Image</Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Box>
            )}
            <Box marginY={2}>
              {editMode ? (
                <Button variant="contained" color="primary" onClick={handleUpdate}>
                  Update
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleEditToggle}>
                  Edit
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6">Employer not found</Typography>
      )}
    </Box>
  );
};

export default EmployerDetails;
