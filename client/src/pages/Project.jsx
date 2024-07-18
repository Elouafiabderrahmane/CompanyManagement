import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledImage = styled("img")({
  width: "100%",
  height: "500px",
  objectFit: "cover",
  borderRadius: "8px",
  marginBottom: "16px",
});

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    description: "",
    budget: 0,
    paid: false,
    done: false,
    startDate: "",
    endDate: "",
    image: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8085/api/projects/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Project not found");
        return response.json();
      })
      .then((data) => {
        setProject(data);
        fetchImage(data.id);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const fetchImage = (projectId) => {
    fetch(`http://localhost:8085/api/projects/${projectId}/image`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        return response.blob();
      })
      .then((imageBlob) => {
        const imageUrl = URL.createObjectURL(imageBlob);
        setImage(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching project image:", error);
      });
  };

  const handleAddProject = () => {
    setAddModalOpen(true);
  };

  const addProject = () => {
    const formData = new FormData();
    formData.append("name", newProjectData.name);
    formData.append("description", newProjectData.description);
    formData.append("budget", newProjectData.budget);
    formData.append("paid", newProjectData.paid);
    formData.append("done", newProjectData.done);
    formData.append("startDate", newProjectData.startDate);
    formData.append("endDate", newProjectData.endDate);
    if (newProjectData.image) {
      formData.append("image", newProjectData.image);
    }

    fetch("http://localhost:8085/api/projects", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => {
        setAddModalOpen(false);
        showSnackbar("Project added successfully", "success");
      })
      .catch((error) => {
        console.error("Error adding project:", error);
        showSnackbar("Failed to add project", "error");
      });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box padding={3}>
      {image ? (
        <StyledImage src={image} alt={project.name} />
      ) : (
        <StyledImage
          src="https://via.placeholder.com/1200x500"
          alt={project.name}
        />
      )}
      <Typography variant="h4" gutterBottom>
        {project.name}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {`End Date: ${project.endDate}`}
      </Typography>
      <Typography variant="body1" paragraph>
        {project.description}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {`Budget: $${project.budget}`}
      </Typography>
      <Typography
        variant="body2"
        color={project.done ? "success.main" : "error.main"}
      >
        {project.done ? "Completed" : "In Progress"}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {`Paid: ${project.paid ? "Yes" : "No"}`}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {`Start Date: ${project.startDate}`}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {`Employers: ${project.employers.join(", ")}`}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleAddProject}>
        Add New Project
      </Button>

      {/* Add Project Dialog */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="standard"
            fullWidth
            margin="normal"
            value={newProjectData.name}
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                name: e.target.value,
              })
            }
          />
          <TextField
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            margin="normal"
            value={newProjectData.description}
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                description: e.target.value,
              })
            }
          />
          <TextField
            label="Budget"
            variant="standard"
            fullWidth
            margin="normal"
            type="number"
            value={newProjectData.budget}
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                budget: e.target.value,
              })
            }
          />
          <TextField
            type="file"
            label="Image"
            variant="standard"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                image: e.target.files[0],
              })
            }
            accept="image/*"
          />
          <TextField
            label="Start Date"
            type="date"
            variant="standard"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newProjectData.startDate}
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                startDate: e.target.value,
              })
            }
          />
          <TextField
            label="End Date"
            type="date"
            variant="standard"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newProjectData.endDate}
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                endDate: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={addProject} color="primary">
            Add Project
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={
          <Button
            color="inherit"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
          >
            Close
          </Button>
        }
        ContentProps={{
          style: {
            backgroundColor:
              snackbar.severity === "success"
                ? "#4caf50"
                : snackbar.severity === "error"
                ? "#f44336"
                : "#1976d2",
          },
        }}
      />
    </Box>
  );
};

export default Project;
