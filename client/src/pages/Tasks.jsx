import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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


const Tasks = ({ projectId }) => {
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
  }, [projectId]);

  const fetchTasks = () => {
    setLoading(true);
    const url = projectId
      ? `http://localhost:8085/api/tasks/projects/${projectId}`
      : "http://localhost:8085/api/tasks";
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setLoading(false);
        showSnackbar("Failed to fetch tasks", "error");
      });
  };
  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      fetchTasks();
    } else {
      setLoading(true);
      fetch(`http://localhost:8085/api/tasks/keyword/${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          setTasks([data]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error searching tasks by name:", error);
          setLoading(false);
          showSnackbar("Failed to search employers", "error");
        });
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

  const addTask = () => {
    fetch("http://localhost:8085/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTaskData),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchTasks();
        setAddModalOpen(false);
        showSnackbar("task added successfully", "success");
      })
      .catch((error) => {
        console.error("Error adding task:", error);
        showSnackbar("Failed to add task", "error");
      });
  };

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setDeleteId(id);
    // Optimistically remove the item from the list
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const confirmDelete = () => {
    fetch(`http://localhost:8085/api/tasks/${deleteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Delete failed");
        }
        showSnackbar("Task deleted successfully", "success");
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        // Revert the optimistic update
        fetchTasks();
        showSnackbar("Failed to delete task", "error");
      })
      .finally(() => {
        setDeleteDialogOpen(false);
      });
  };

  const handleUpdate = (id) => {
    setUpdateId(id);
    fetch(`http://localhost:8085/api/tasks/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdateData({
          id: data.id,
          tasktype: data.tasktype,
          done: data.done,
          title: data.title,
          description: data.description,
          startingDate: data.startingDate,
          endingDate: data.endingDate,
          project: data.project,
          employer: data.employer,
        });
        setUpdateModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching task for update:", error);
        showSnackbar("Failed to fetch task details", "error");
      });
  };

  const updateTask = () => {
    fetch(`http://localhost:8085/api/tasks/${updateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        if (response.ok) {
          fetchTasks();
          setUpdateModalOpen(false);
          showSnackbar("Task updated successfully", "success");
        } else {
          throw new Error("Update failed");
        }
      })
      .catch((error) => {
        console.error("Error updating task:", error);
        showSnackbar("Failed to update task", "error");
      });
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
          sx={{ width: "200px", height: "60px", backgroundColor: "#1976d2" }}
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
               tasks {tasks.length}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      </>
      
      
      )}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {loading ? (
                <BorderLinearProgress />
              ) : (
                <Box sx={{ marginTop: "20px" }}>
                  <Table
                    limit="10"
                    headData={tasksTableHead}
                    renderHead={(item, index) => renderHead(item, index)}
                    bodyData={tasks}
                    renderBody={(item, index) => renderBody(item, index)}
                  />
                </Box>
              )}
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} style={{ color: "red" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateModalOpen} onClose={() => setUpdateModalOpen(false)}>
        <DialogTitle>Update Task</DialogTitle>
        <DialogContent>
          <Select
            value={updateData.tasktype}
            onChange={(e) =>
              setUpdateData({ ...updateData, tasktype: e.target.value })
            }
            fullWidth
            margin="normal"
          >
            <MenuItem value="BUILDING">BUILDING</MenuItem>
            {/* Add other task types as needed */}
          </Select>
          <FormControlLabel
            control={
              <Switch
                checked={updateData.done}
                onChange={(e) =>
                  setUpdateData({ ...updateData, done: e.target.checked })
                }
                color="primary"
              />
            }
            label="Done"
            style={{ marginBottom: 0 }}
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Title"
            value={updateData.title}
            onChange={(e) =>
              setUpdateData({ ...updateData, title: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Description"
            value={updateData.description}
            onChange={(e) =>
              setUpdateData({ ...updateData, description: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Starting Date"
            type="date"
            value={updateData.startingDate}
            onChange={(e) =>
              setUpdateData({ ...updateData, startingDate: e.target.value })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Ending Date"
            type="date"
            value={updateData.endingDate}
            onChange={(e) =>
              setUpdateData({ ...updateData, endingDate: e.target.value })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Project"
            type="number"
            value={updateData.project}
            onChange={(e) =>
              setUpdateData({ ...updateData, project: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Employer"
            value={updateData.employer}
            onChange={(e) =>
              setUpdateData({ ...updateData, employer: e.target.value })
            }
            fullWidth
            margin="normal"
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
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <TextField
          id="standard-basic"
          variant="standard"
          label="Task Type"
          value={newTaskData.tasktype}
          onChange={(e) =>
            setNewTaskData({ ...newTaskData, tasktype: e.target.value })
          }
          fullWidth
          margin="normal"
        />
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
              color="primary"
            />
          }
          label="Done"
          style={{ marginBottom: 0 }}
        />
        <TextField
          id="standard-basic"
          variant="standard"
          label="Title"
          value={newTaskData.title}
          onChange={(e) =>
            setNewTaskData({
              ...newTaskData,
              title: e.target.value,
            })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          id="standard-basic"
          variant="standard"
          label="Description"
          value={newTaskData.description}
          onChange={(e) =>
            setNewTaskData({
              ...newTaskData,
              description: e.target.value,
            })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          id="standard-basic"
          variant="standard"
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
          fullWidth
          margin="normal"
        />
        <TextField
          id="standard-basic"
          variant="standard"
          label="Ending Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={newTaskData.endingDate}
          onChange={(e) =>
            setNewTaskData({
              ...newTaskData,
              endingDate: e.target.value,
            })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          id="standard-basic"
          variant="standard"
          label="Project"
          value={newTaskData.project}
          onChange={(e) =>
            setNewTaskData({
              ...newTaskData,
              project: e.target.value,
            })
          }
          fullWidth
          margin="normal"
        />
        <TextField
          id="standard-basic"
          variant="standard"
          label="Employers (comma-separated)"
          value={newTaskData.employer.join(", ")}
          onChange={(e) =>
            setNewTaskData({
              ...newTaskData,
              employer: e.target.value.split(",").map((emp) => emp.trim()),
            })
          }
          fullWidth
          margin="normal"
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </div>
  );
};

export default Tasks;
