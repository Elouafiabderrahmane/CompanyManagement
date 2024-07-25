import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { styled } from "@mui/system";
import defaultImage from "../assets/images/AxeoFM_Maquette3D_Drone-3.jpg";
import PeopleIcon from "@mui/icons-material/People";
import BuildIcon from "@mui/icons-material/Build";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Table from "../components/table/Table";
import Tasks from "./Tasks";
import Materials from "./Materials"; // Import the Materials component
import Employers from "./Employers";
import axios from "../components/Axios";

const StyledImage = styled("img")({
  width: "100%",
  height: "auto",
  borderRadius: "8px",
  marginBottom: "16px",
});

const ProjectDetails = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`& .${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

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
  const [view, setView] = useState("projectDetails");
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const tableHeaders = {
    materials: ["", "Material Name", "Quantity", "Price", "Project"],
    employers: ["", "Name", "Role", "Email", "Phone"],
    tasks: [
      "",
      "Task Type",
      "Done",
      "Title",
      "Description",
      "Starting Date",
      "Ending Date",
      "Project",
      "Employer",
      "Update",
      "Delete",
    ],
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8085/api/projects/${id}`)
      .then((response) => {
        setProject(response.data);
        fetchImage(response.data.id);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const fetchImage = (projectId) => {
    axios
      .get(`http://localhost:8085/api/projects/${projectId}/image`, {
        responseType: "blob",
      })
      .then((response) => {
        const imageUrl = URL.createObjectURL(response.data);
        setImage(imageUrl);
      })
      .catch((error) => {
        console.error("Error fetching project image:", error);
        setImage(defaultImage); // Set default image if fetching fails
      });
  };

  const fetchData = (dataType) => {
    setTableLoading(true);
    axios
      .get(`http://localhost:8085/api/projects/${id}/${dataType}`)
      .then((response) => {
        setTableData(response.data);
        setView(dataType);
        setTableLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTableLoading(false);
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

    axios
      .post("http://localhost:8085/api/projects", formData)
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

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      {Object.values(item).map((val, i) => (
        <td key={i}>{val}</td>
      ))}
    </tr>
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box padding={3}>
      {view === "projectDetails" ? (
        <>
          <Box
            sx={{ marginBottom: "20px" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              sx={{
                width: "150px",
                height: "60px",
                marginRight: "10px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              variant="contained"
              color="primary"
              startIcon={<PeopleIcon />}
              onClick={() => setView("employers")}
            >
              Employers
            </Button>
            <Button
              sx={{
                width: "150px",
                height: "60px",
                marginRight: "10px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              variant="contained"
              color="primary"
              startIcon={<BuildIcon />}
              onClick={() => setView("materials")} // Update to show Materials component
            >
              Materials
            </Button>
            <Button
              sx={{
                width: "150px",
                height: "60px",
                marginRight: "10px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              variant="contained"
              color="primary"
              startIcon={<AssignmentIcon />}
              onClick={() => setView("tasks")}
            >
              Tasks
            </Button>
          </Box>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            {project.name}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ProjectDetails>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {`End Date: ${project.endDate}`}
                </Typography>
                <Typography variant="body1" paragraph>
                  {project.description}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {`Budget: $${project.budget}`}
                </Typography>
                <Typography
                  variant="body2"
                  color={project.done ? "success.main" : "error.main"}
                  paragraph
                  display="flex"
                  alignItems="center"
                >
                  {project.done ? (
                    <>
                      <CheckCircleIcon color="success" />
                      &nbsp;Completed
                    </>
                  ) : (
                    <>
                      <CancelIcon color="error" />
                      &nbsp;In Progress
                    </>
                  )}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {`Paid: ${project.paid ? "Yes" : "No"}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {`Start Date: ${project.startDate}`}
                </Typography>
              </ProjectDetails>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledImage
                src={image || defaultImage}
                alt={project.name || "Project Image"}
              />
            </Grid>
          </Grid>

          <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
            <DialogTitle>Add Project</DialogTitle>
            <DialogContent>
              <TextField
                label="Name"
                variant="standard"
                fullWidth
                margin="normal"
                value={newProjectData.name}
                onChange={(e) =>
                  setNewProjectData({ ...newProjectData, name: e.target.value })
                }
              />
              <TextField
                label="Description"
                variant="standard"
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
                type="number"
                fullWidth
                margin="normal"
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
                    color="primary"
                  />
                }
                label="Done"
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
        </>
      ) : view === "tasks" ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView("projectDetails")}
            startIcon={<ArrowBackIosIcon />}
            sx={{ marginBottom: 2 }}
          >
            Return
          </Button>
          <Tasks projectId={id} />
        </>
      ) : view === "materials" ? ( // Updated to render Materials component
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView("projectDetails")}
            startIcon={<ArrowBackIosIcon />}
            sx={{ marginBottom: 2 }}
          >
            Return
          </Button>
          <Materials projectId={id} /> {/* Render Materials component */}
        </>
      ) : view === "employers" ? ( // Updated to render employers component
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView("projectDetails")}
            startIcon={<ArrowBackIosIcon />}
            sx={{ marginBottom: 2 }}
          >
            Return
          </Button>
          <Employers projectId={id} /> {/* Render Employers component */}
        </>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView("projectDetails")}
            startIcon={<ArrowBackIosIcon />}
            sx={{ marginBottom: 2 }}
          >
            Return
          </Button>
          {tableLoading ? (
            <BorderLinearProgress />
          ) : (
            <Table
              limit="10"
              headData={tableHeaders[view]}
              renderHead={renderHead}
              bodyData={tableData}
              renderBody={renderBody}
            />
          )}
        </>
      )}
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
