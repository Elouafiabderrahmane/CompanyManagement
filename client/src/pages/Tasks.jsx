import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "../components/Axios"; // Adjust import according to your setup

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  Box,
  TextField,
  Snackbar,
  Select,
  Typography,
  Card,
  CardContent,
  MenuItem,
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

  useEffect(() => {
    fetchTasks();
  }, [projectId, employerId]);

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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
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
                    {tasks.length} tasks
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Table
            headData={tasksTableHead}
            renderHead={renderHead}
            bodyData={tasks}
            renderBody={renderBody}
          />
          {/* Add Task Modal */}
          <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogContent>
              {/* Add Task Form */}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Task Type"
                value={newTaskData.tasktype}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, tasktype: e.target.value })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={newTaskData.done}
                    onChange={(e) =>
                      setNewTaskData({ ...newTaskData, done: e.target.checked })
                    }
                  />
                }
                label="Done"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Title"
                value={newTaskData.title}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, title: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Description"
                value={newTaskData.description}
                onChange={(e) =>
                  setNewTaskData({
                    ...newTaskData,
                    description: e.target.value,
                  })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Starting Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newTaskData.startingDate}
                onChange={(e) =>
                  setNewTaskData({
                    ...newTaskData,
                    startingDate: e.target.value,
                  })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Ending Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newTaskData.endingDate}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, endingDate: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Project"
                value={newTaskData.project}
                onChange={(e) =>
                  setNewTaskData({ ...newTaskData, project: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Employer"
                value={newTaskData.employer.join(", ")}
                onChange={(e) =>
                  setNewTaskData({
                    ...newTaskData,
                    employer: e.target.value
                      .split(", ")
                      .map((item) => item.trim()),
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddModalOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={addTask} color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>
          {/* Update Task Modal */}
          <Dialog
            open={updateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
          >
            <DialogTitle>Update Task</DialogTitle>
            <DialogContent>
              {/* Update Task Form */}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Task Type"
                value={updateData.tasktype}
                onChange={(e) =>
                  setUpdateData({ ...updateData, tasktype: e.target.value })
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={updateData.done}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, done: e.target.checked })
                    }
                  />
                }
                label="Done"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Title"
                value={updateData.title}
                onChange={(e) =>
                  setUpdateData({ ...updateData, title: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Description"
                value={updateData.description}
                onChange={(e) =>
                  setUpdateData({ ...updateData, description: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
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
                margin="normal"
                required
                fullWidth
                label="Ending Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={updateData.endingDate}
                onChange={(e) =>
                  setUpdateData({ ...updateData, endingDate: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Project"
                value={updateData.project}
                onChange={(e) =>
                  setUpdateData({ ...updateData, project: e.target.value })
                }
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Employer"
                value={updateData.employer.join(", ")}
                onChange={(e) =>
                  setUpdateData({
                    ...updateData,
                    employer: e.target.value
                      .split(", ")
                      .map((item) => item.trim()),
                  })
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setUpdateModalOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={updateTask} color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>
          {/* Delete Confirmation Dialog */}
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
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                color="primary"
              >
                Cancel
              </Button>
              <Button onClick={confirmDelete} color="primary">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          {/* Snackbar */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            message={snackbar.message}
            severity={snackbar.severity}
          />
        </>
      )}
    </div>
  );
};

export default Tasks;
