import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../components/Axios";
import ProjectCard from "../components/project-card/ProjectCard";
import { Grid, Typography } from "@mui/material";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  DialogActions,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
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
    tasks: [],
    payment: null,
    image: null,
  });
  const [employers, setEmployers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employersRes, materialsRes, tasksRes, paymentsRes] =
          await Promise.all([
            axios.get("http://localhost:8085/api/employers"),
            axios.get("http://localhost:8085/api/materials"),
            axios.get("http://localhost:8085/api/tasks"),
            axios.get("http://localhost:8085/api/payments"),
          ]);
        setEmployers(employersRes.data);
        setMaterials(materialsRes.data);
        setTasks(tasksRes.data);
        setPayments(paymentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [employerId]);

  useEffect(() => {
    fetchProjects();
  }, [employerId]);

  const fetchProjects = async () => {
    setLoading(true);

    try {
      const url = employerId
        ? `http://localhost:8085/api/projects/employers/${employerId}`
        : "http://localhost:8085/api/projects";
      const { data } = await axios.get(url);
      setProjects(data);

      // Fetch project images
      const imagePromises = data.map((project) =>
        axios
          .get(`http://localhost:8085/api/projects/${project.id}/image`, {
            responseType: "blob",
          })
          .then((response) => {
            const imageUrl = URL.createObjectURL(response.data);
            return { id: project.id, imageUrl };
          })
          .catch(() => ({ id: project.id, imageUrl: null }))
      );

      const imagesData = await Promise.all(imagePromises);
      const imagesMap = imagesData.reduce((acc, { id, imageUrl }) => {
        acc[id] = imageUrl;
        return acc;
      }, {});

      setImages(imagesMap);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchProjects();
    } else {
      try {
        const { data } = await axios.get(
          `http://localhost:8085/api/projects/name/${searchQuery}`
        );
        setProjects(data);
      } catch (error) {
        console.error("Error searching projects:", error);
      }
    }
  };

  const handleAddProject = () => {
    setAddModalOpen(true);
  };

  const addProject = async () => {
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
    formData.append("employers", newProjectData.employers);
    formData.append("materials", newProjectData.materials);
    formData.append("tasks", newProjectData.tasks);
    formData.append("payment", newProjectData.payment);

    try {
      await axios.post("http://localhost:8085/api/projects", formData);
      fetchProjects();
      setAddModalOpen(false);
      showSnackbar("Project added successfully", "success");
    } catch (error) {
      console.error("Error adding project:", error);
      showSnackbar("Failed to add project", "error");
    }
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
            <Typography
              variant="h6"
              color="textSecondary"
              align="center"
              mt={2}
            >
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
              setNewProjectData({
                ...newProjectData,
                description: e.target.value,
              })
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
                  setNewProjectData({
                    ...newProjectData,
                    paid: e.target.checked,
                  })
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
                  setNewProjectData({
                    ...newProjectData,
                    done: e.target.checked,
                  })
                }
              />
            }
            label="Done"
          />
          <TextField
            type="date"
            fullWidth
            margin="dense"
            value={newProjectData.startDate}
            onChange={(e) =>
              setNewProjectData({
                ...newProjectData,
                startDate: e.target.value,
              })
            }
          />
          <TextField
            type="date"
            fullWidth
            margin="dense"
            value={newProjectData.endDate}
            onChange={(e) =>
              setNewProjectData({ ...newProjectData, endDate: e.target.value })
            }
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Employers</InputLabel>
            <Select
              multiple
              value={newProjectData.employers}
              onChange={(e) =>
                setNewProjectData({
                  ...newProjectData,
                  employers: e.target.value,
                })
              }
            >
              {employers.map((employer) => (
                <MenuItem key={employer.id} value={employer.id}>
                  {employer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Materials</InputLabel>
            <Select
              multiple
              value={newProjectData.materials}
              onChange={(e) =>
                setNewProjectData({
                  ...newProjectData,
                  materials: e.target.value,
                })
              }
            >
              {materials.map((material) => (
                <MenuItem key={material.id} value={material.id}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Tasks</InputLabel>
            <Select
              multiple
              value={newProjectData.tasks}
              onChange={(e) =>
                setNewProjectData({ ...newProjectData, tasks: e.target.value })
              }
            >
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.tasktype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Payment</InputLabel>
            <Select
              value={newProjectData.payment}
              onChange={(e) =>
                setNewProjectData({
                  ...newProjectData,
                  payment: e.target.value,
                })
              }
            >
              {payments.map((payment) => (
                <MenuItem key={payment.id} value={payment.id}>
                  {payment.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
