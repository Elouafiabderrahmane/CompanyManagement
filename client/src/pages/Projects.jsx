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
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import image from "../assets/images/AxeoFM_Maquette3D_Drone-3.jpg";


const Projects = ({ employerId }) => {
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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [employerId]);

  const fetchProjects = () => {
    setLoading(true);

    const url = employerId
      ? `http://localhost:8085/api/projects/employers/${employerId}`
      : "http://localhost:8085/api/projects";
    fetch(url)
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
                [project.id]: null,
              }));
            });
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setLoading(false);
      });
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      fetchProjects();
    } else {
      fetch(`http://localhost:8085/api/projects/name/${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          setProjects(data);
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
            style={{ width: "700px", marginRight: 10 }}
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
  {projects.length > 0 ? (
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
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      mt={5}
    >
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtUVYATWPrDOHE_R5qO_XBS5VyJ6Sx78bSUw&s"
        alt="No projects"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <Typography variant="h6" color="textSecondary" align="center" mt={2}>
        There are no projects here.
      </Typography>
    </Box>
  )}
</Box>

      {/* Add Project Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={newProjectData.name}
            onChange={(e) =>
              setNewProjectData({ ...newProjectData, name: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={newProjectData.description}
            onChange={(e) =>
              setNewProjectData({ ...newProjectData, description: e.target.value })
            }
          />
          <TextField
            label="Budget"
            fullWidth
            margin="dense"
            type="number"
            value={newProjectData.budget}
            onChange={(e) =>
              setNewProjectData({ ...newProjectData, budget: e.target.value })
            }
          />
          <FormControlLabel
            control={
              <Switch
                checked={newProjectData.paid}
                onChange={(e) =>
                  setNewProjectData({ ...newProjectData, paid: e.target.checked })
                }
              />
            }
            label="Paid"
          />
          <FormControlLabel
            control={
              <Switch
                checked={newProjectData.done}
                onChange={(e) =>
                  setNewProjectData({ ...newProjectData, done: e.target.checked })
                }
              />
            }
            label="Done"
          />
          <TextField
            label="Start Date"
            fullWidth
            margin="dense"
            value={newProjectData.startDate}
            onChange={(e) =>
              setNewProjectData({ ...newProjectData, startDate: e.target.value })
            }
          />
          <TextField
            label="End Date"
            fullWidth
            margin="dense"
            value={newProjectData.endDate}
            onChange={(e) =>
              setNewProjectData({ ...newProjectData, endDate: e.target.value })
            }
          />
          <input
            type="file"
            onChange={(e) =>
              setNewProjectData({ ...newProjectData, image: e.target.files[0] })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button onClick={addProject} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Box>
  );
};

export default Projects;
