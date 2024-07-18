import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/project-card/ProjectCard";
import {
  Box,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  FormControlLabel,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import image from "../assets/images/AxeoFM_Maquette3D_Drone-3.jpg";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [images, setImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    description: "",
    budget: 0,
    paid: false,
    done: false,
    startDate: "",
    endDate: "",
    employers: [],
    materials: [],
    image: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate(); // Move this inside the component

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch("http://localhost:8085/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
        data.forEach((project) => {
          fetch(`http://localhost:8085/api/projects/${project.id}/image`)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to fetch");
              }
              return response.blob();
            })
            .then((imageBlob) => {
              const imageUrl = URL.createObjectURL(imageBlob);
              setImages((prevImages) => ({
                ...prevImages,
                [project.id]: imageUrl,
              }));
            })
            .catch((error) => {
              console.error("Error fetching project image:", error);
              setImages((prevImages) => ({
                ...prevImages,
                [project.id]: null, // Set null for failed images
              }));
            });
        });
      })
      .catch((error) => console.error("Error fetching projects:", error));
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      fetchProjects();
    } else {
      fetch(`http://localhost:8085/api/projects/name/${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          setProjects([...data]);
        })
        .catch((error) => {
          console.error("Error searching projects by ID:", error);
        });
    }
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
      .then((data) => {
        fetchProjects();
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

  const handleCardClick = (id) => {
    navigate(`/project/${id}`);
  };

  return (
    <Box>
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box display="flex" alignItems="center">
          <TextField
            id="outlined-basic"
            label="Search by Keyword"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ minWidth: "700px", marginRight: 10 }}
          />
          <Button
            sx={{ width: "150px", height: "60px" }}
            variant="contained"
            color="primary"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
        <Box mb={3}></Box>
        <Box>
          <Button
            sx={{ width: "200px", height: "55px" }}
            variant="contained"
            color="primary"
            onClick={handleAddProject}
            startIcon={<AddIcon style={{ fontSize: "2rem" }} />}
          >
            Add Project
          </Button>
        </Box>
      </Box>
      <Box sx={{ flexGrow: 1, padding: 3 }}>
        <Grid container spacing={4}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard
                img={images[project.id] || image}
                title={project.name}
                description={project.description}
                endingDate={project.endDate}
                done={project.done}
                budget={project.budget}
                onClick={() => handleCardClick(project.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-basic"
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
            id="outlined-multiline-static"
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
            id="outlined-basic"
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
          <FormControlLabel
            control={
              <Switch
                checked={newProjectData.paid}
                onChange={(e) =>
                  setNewProjectData({
                    ...newProjectData,
                    paid: e.target.checked,
                  })
                }
                color="primary"
              />
            }
            label="Paid"
            style={{ marginBottom: 0 }}
          />
          <TextField
            id="outlined-basic"
            variant="standard"
            fullWidth
            margin="normal"
            type="date"
            value={newProjectData.startDate}
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                startDate: e.target.value,
              })
            }
          />
          <TextField
            id="outlined-basic"
            variant="standard"
            fullWidth
            margin="normal"
            type="date"
            value={newProjectData.endDate}
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                endDate: e.target.value,
              })
            }
          />
          {/* File input for image */}
          <TextField
            type="file"
            label="Image"
            variant="standard"
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                image: e.target.files[0],
              })
            }
            accept="image/*"
          />
          {/* Employers and Materials are arrays, you might need to implement appropriate input fields */}
          {/* For simplicity, assuming they are entered as comma-separated values */}
          <TextField
            id="outlined-basic"
            label="Employers (IDs, comma-separated)"
            variant="standard"
            fullWidth
            margin="normal"
            value={newProjectData.employers.join(", ")}
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                employers: e.target.value
                  .split(",")
                  .map((id) => Number(id.trim())),
              })
            }
          />
          <TextField
            id="outlined-basic"
            label="Materials (IDs, comma-separated)"
            variant="standard"
            fullWidth
            margin="normal"
            value={newProjectData.materials.join(", ")}
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                materials: e.target.value
                  .split(",")
                  .map((id) => Number(id.trim())),
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

export default Projects;
