import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "../components/Axios";

import {
  Button,
  Dialog,
  DialogActions,
  Card,
  CardContent,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  MenuItem,
  Switch,
  Box,
  TextField,
  Snackbar,
  Typography,
} from "@mui/material";

const tasksTableHead = [
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
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Tasks = ({ projectId, employerId }) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updateData, setUpdateData] = useState({
    id: "",
    tasktype: "",
    done: false,
    title: "",
    description: "",
    startingDate: "",
    endingDate: "",
    project: "",
    employer: [],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [newTaskData, setNewTaskData] = useState({
    tasktype: "",
    done: false,
    title: "",
    description: "",
    startingDate: "",
    endingDate: "",
    project: "",
    employer: [],
  });
  const [projects, setProjects] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchTasks();
    fetchDropdownData();
  }, [projectId, employerId]);

    const fetchDropdownData = async () => {
      try {
        const [projectsResponse, employersResponse, materialsResponse] =
          await Promise.all([
            axios.get("http://localhost:8085/api/projects"),
            axios.get("http://localhost:8085/api/employers"),
            axios.get("http://localhost:8085/api/materials"),
          ]);

        setProjects(projectsResponse.data);
        setEmployers(employersResponse.data);
        setMaterials(materialsResponse.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        showSnackbar("Failed to fetch dropdown data", "error");
      }
    };
  const fetchTasks = async () => {
    setLoading(true);
    let url;
    if (projectId) {
      url = `http://localhost:8085/api/tasks/projects/${projectId}`;
    } else if (employerId) {
      url = `http://localhost:8085/api/tasks/employers/${employerId}`;
    } else {
      url = "http://localhost:8085/api/tasks";
    }

    
    try {
      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showSnackbar("Failed to fetch tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      fetchTasks();
    } else {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8085/api/tasks/keyword/${searchQuery}`
        );
        setTasks([response.data]);
      } catch (error) {
        console.error("Error searching tasks by name:", error);
        showSnackbar("Failed to search tasks", "error");
      } finally {
        setLoading(false);
      }
    }
  };
const TaskTypes = [
  { value: "BUILDING", label: "BUILDING" },
  { value: "PAINTING", label: "PAINTING" },
];
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
 const handleTaskTypeChange = (event) => {
   setNewTaskData({ ...newTaskData, tasktype: event.target.value });
   setUpdateData({ ...updateData, tasktype: event.target.value });
 };
  const handleAddTask = () => {
    setAddModalOpen(true);
  };

  const addTask = async () => {
    try {
      await axios.post("http://localhost:8085/api/tasks", newTaskData);
      fetchTasks();
      setAddModalOpen(false);
      showSnackbar("Task added successfully", "success");
    } catch (error) {
      console.error("Error adding task:", error);
      showSnackbar("Failed to add task", "error");
    }
  };

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8085/api/tasks/${deleteId}`);
      fetchTasks(); // Refetch the tasks to reflect the deletion
      showSnackbar("Task deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting task:", error);
      showSnackbar("Failed to delete task", "error");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleUpdate = async (id) => {
    setUpdateId(id);
    try {
      const response = await axios.get(`http://localhost:8085/api/tasks/${id}`);
      setUpdateData({
        id: response.data.id,
        tasktype: response.data.tasktype,
        done: response.data.done,
        title: response.data.title,
        description: response.data.description,
        startingDate: response.data.startingDate,
        endingDate: response.data.endingDate,
        project: response.data.project,
        employer: response.data.employer,
      });
      setUpdateModalOpen(true);
    } catch (error) {
      console.error("Error fetching task for update:", error);
      showSnackbar("Failed to fetch task details", "error");
    }
  };

  const updateTask = async () => {
    try {
      await axios.put(
        `http://localhost:8085/api/tasks/${updateId}`,
        updateData
      );
      fetchTasks();
      setUpdateModalOpen(false);
      showSnackbar("Task updated successfully", "success");
    } catch (error) {
      console.error("Error updating task:", error);
      showSnackbar("Failed to update task", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleProjectChange = (event) => {
    setNewTaskData({ ...newTaskData, project: event.target.value });
    setUpdateData({ ...updateData, project: event.target.value });
  };

  const handleEmployerChange = (event) => {
    setNewTaskData({
      ...newTaskData,
      employer: event.target.value,
    });
    setUpdateData({ ...updateData, employer: event.target.value });
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.tasktype}</td>
      <td>{item.done ? "Yes" : "No"}</td>
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{item.startingDate}</td>
      <td>{item.endingDate}</td>
      <td>{item.project}</td>
      <td>
        {Array.isArray(item.employer)
          ? item.employer.join(", ")
          : item.employer}
      </td>
      <td>
        <Button variant="contained" onClick={() => handleUpdate(item.id)}>
          Update
        </Button>
      </td>
      <td>
        <Button
          variant="contained"
          onClick={() => handleDelete(item.id)}
          style={{ backgroundColor: "red" }}
        >
          Delete
        </Button>
      </td>
    </tr>
  );

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

  return (
    <div>
      {loading ? (
        <>
          <div></div>
        </>
      ) : (
        <>
          <Box
            mb={3}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <TextField
                id="outlined-basic"
                label="Search by Name"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ width: "1000px", marginRight: 10 }}
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
                onClick={handleAddTask}
                startIcon={<AddIcon style={{ fontSize: "2rem" }} />}
              >
                Add task
              </Button>
            </Box>
          </Box>
          <Box mb={"20px"}>
            <Card
              sx={{
                width: "200px",
                height: "60px",
                backgroundColor: "#1976d2",
              }}
            >
              <CardContent sx={{ height: "100%" }}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography
                    variant="h6"
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Tasks {materials.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <div className="card">
            <div className="card__body">
              {loading ? (
                <BorderLinearProgress />
              ) : (
                <Table
                  limit="10"
                  headData={tasksTableHead}
                  renderHead={renderHead}
                  bodyData={tasks}
                  renderBody={renderBody}
                />
              )}
            </div>
          </div>

          {/* Add Modal */}
          <Dialog
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            fullWidth
          >
            <DialogTitle>Add Task</DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Task Type</InputLabel>
                  <Select
                    value={newTaskData.tasktype}
                    onChange={handleTaskTypeChange}
                  >
                    {TaskTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newTaskData.done}
                      onChange={(e) =>
                        setNewTaskData({
                          ...newTaskData,
                          done: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Done"
                />
                <TextField
                  fullWidth
                  label="Title"
                  variant="standard"
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, title: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Description"
                  variant="standard"
                  onChange={(e) =>
                    setNewTaskData({
                      ...newTaskData,
                      description: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Starting Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setNewTaskData({
                      ...newTaskData,
                      startingDate: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Ending Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) =>
                    setNewTaskData({
                      ...newTaskData,
                      endingDate: e.target.value,
                    })
                  }
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Project</InputLabel>
                  <Select
                    value={newTaskData.project}
                    onChange={handleProjectChange}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Employer</InputLabel>
                  <Select
                    multiple
                    value={newTaskData.employer}
                    onChange={handleEmployerChange}
                  >
                    {employers.map((employer) => (
                      <MenuItem key={employer.id} value={employer.id}>
                        {employer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Material</InputLabel>
                  <Select
                    multiple
                    value={newTaskData.employer}
                    onChange={handleEmployerChange}
                  >
                    {materials.map((material) => (
                      <MenuItem key={material.id} value={material.id}>
                        {material.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
              <Button onClick={addTask}>Add Task</Button>
            </DialogActions>
          </Dialog>
          {/* Update Modal */}
          <Dialog
            open={updateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            fullWidth
          >
            <DialogTitle>Update Task</DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Task Type</InputLabel>
                  <Select
                    value={newTaskData.tasktype}
                    onChange={handleTaskTypeChange}
                  >
                    {TaskTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={updateData.done}
                      onChange={(e) =>
                        setUpdateData({
                          ...updateData,
                          done: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Done"
                />
                <TextField
                  fullWidth
                  label="Title"
                  variant="standard"
                  value={updateData.title}
                  onChange={(e) =>
                    setUpdateData({ ...updateData, title: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Description"
                  variant="standard"
                  value={updateData.description}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      description: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Starting Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={updateData.startingDate}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      startingDate: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="Ending Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={updateData.endingDate}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      endingDate: e.target.value,
                    })
                  }
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Project</InputLabel>
                  <Select
                    value={newTaskData.project}
                    onChange={handleProjectChange}
                  >
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Employer</InputLabel>
                  <Select
                    multiple
                    value={newTaskData.employer}
                    onChange={handleEmployerChange}
                  >
                    {employers.map((employer) => (
                      <MenuItem key={employer.id} value={employer.id}>
                        {employer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Material</InputLabel>
                  <Select
                    multiple
                    value={newTaskData.employer}
                    onChange={handleEmployerChange}
                  >
                    {materials.map((material) => (
                      <MenuItem key={material.id} value={material.id}>
                        {material.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUpdateModalOpen(false)}>Cancel</Button>
              <Button onClick={updateTask}>Update Task</Button>
            </DialogActions>
          </Dialog>
          {/* Delete Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this task?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmDelete}>Confirm</Button>
            </DialogActions>
          </Dialog>
          {/* Snackbar */}
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
            severity={snackbar.severity}
          />
        </>
      )}
    </div>
  );
};

export default Tasks;
