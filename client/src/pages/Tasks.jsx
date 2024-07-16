import React, { useState, useEffect } from "react";
import Table from "../components/table/Table";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  TextField,
  Snackbar,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

const tasksTableHead = [
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
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Tasks = () => {
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setLoading(true);
    fetch("http://localhost:8085/api/tasks")
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
      <td>{item.id}</td>
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
      <h2 className="page-header">Tasks</h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {loading ? (
                <BorderLinearProgress />
              ) : (
                <Table
                  limit="10"
                  headData={tasksTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={tasks}
                  renderBody={(item, index) => renderBody(item, index)}
                />
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
            label="Title"
            value={updateData.title}
            onChange={(e) =>
              setUpdateData({ ...updateData, title: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={updateData.description}
            onChange={(e) =>
              setUpdateData({ ...updateData, description: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
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
