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
  TextField,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const salariesTableHead = [
  "ID",
  "Amount",
  "Frequency",
  "Paid",
  "Starting Date",
  "Ending Date",
  "Employer",
  "Material",
  "Update",
  "Delete",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Salaries = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updateData, setUpdateData] = useState({
    id: "",
    amount: "",
    frequency: "",
    paid: false,
    startingDate: "",
    endingDate: null,
    employers: "",
    material: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = () => {
    setLoading(true);
    fetch("http://localhost:8085/api/salaries")
      .then((response) => response.json())
      .then((data) => {
        setSalaries(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching salaries:", error);
        setLoading(false);
        showSnackbar("Failed to fetch salaries", "error");
      });
  };

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setDeleteId(id);
    // Optimistically remove the item from the list
    setSalaries(salaries.filter((salary) => salary.id !== id));
  };

  const confirmDelete = () => {
    fetch(`http://localhost:8085/api/salaries/${deleteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Delete failed");
        }
        showSnackbar("Salary deleted successfully", "success");
      })
      .catch((error) => {
        console.error("Error deleting salary:", error);
        // Revert the optimistic update
        fetchSalaries();
        showSnackbar("Failed to delete salary", "error");
      })
      .finally(() => {
        setDeleteDialogOpen(false);
      });
  };

  const handleUpdate = (id) => {
    setUpdateId(id);
    fetch(`http://localhost:8085/api/salaries/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdateData({
          id: data.id,
          amount: data.amount,
          frequency: data.frequency,
          paid: data.paid,
          startingDate: data.startingDate,
          endingDate: data.endingDate,
          employers: data.employers,
          material: data.material,
        });
        setUpdateModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching salary for update:", error);
        showSnackbar("Failed to fetch salary details", "error");
      });
  };

  const updateSalary = () => {
    fetch(`http://localhost:8085/api/salaries/${updateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        if (response.ok) {
          fetchSalaries();
          setUpdateModalOpen(false);
          showSnackbar("Salary updated successfully", "success");
        } else {
          throw new Error("Update failed");
        }
      })
      .catch((error) => {
        console.error("Error updating salary:", error);
        showSnackbar("Failed to update salary", "error");
      });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.amount}</td>
      <td>{item.frequency}</td>
      <td>{item.paid ? "Yes" : "No"}</td>
      <td>{item.startingDate}</td>
      <td>{item.endingDate ? item.endingDate : "⊘"}</td>
      <td>{item.employers}</td>
      <td>{item.material ? item.material : "⊘"}</td>
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
      <h2 className="page-header">Salaries</h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {loading ? (
                <BorderLinearProgress />
              ) : (
                <Table
                  limit="10"
                  headData={salariesTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={salaries}
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
          Are you sure you want to delete this salary?
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
        <DialogTitle>Update Salary</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            variant="standard"
            label="Amount"
            type="number"
            value={updateData.amount}
            onChange={(e) =>
              setUpdateData({ ...updateData, amount: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <FormControl
            fullWidth
            margin="normal"
            id="standard-basic"
            variant="standard"
          >
            <InputLabel>Frequency</InputLabel>
            <Select
              value={updateData.frequency}
              onChange={(e) =>
                setUpdateData({ ...updateData, frequency: e.target.value })
              }
            >
              <MenuItem value="MONTHLY">Monthly</MenuItem>
              <MenuItem value="ANNUAL">Annual</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" variant="standard">
            <InputLabel>Paid</InputLabel>
            <Select
              value={updateData.paid}
              onChange={(e) =>
                setUpdateData({ ...updateData, paid: e.target.value })
              }
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </Select>
          </FormControl>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={updateSalary} color="primary">
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

export default Salaries;
