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
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const employersTableHead = [
  
  "Name",
  "Phone",
  "Cin",
  "Adress",
  "Hire Date",
  "Birth Date",
  "Update",
  "Delete",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Employers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updateData, setUpdateData] = useState({
    id: "",
    name: "",
    phone: "",
    cin: "",
    adress: "",
    hireDate: "",
    birthDate: "",
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEmployerData, setNewEmployerData] = useState({
    name: "",
    phone: "",
    cin: "",
    adress: "",
    hireDate: "",
    birthDate: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = () => {
    setLoading(true);
    fetch("http://localhost:8085/api/employers")
      .then((response) => response.json())
      .then((data) => {
        setEmployers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employers:", error);
        setLoading(false);
        showSnackbar("Failed to fetch employers", "error");
      });
  };

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setDeleteId(id);
    setEmployers(employers.filter((employer) => employer.id !== id));
  };

  const confirmDelete = () => {
    fetch(`http://localhost:8085/api/employers/${deleteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Delete failed");
        }
        showSnackbar("Employer deleted successfully", "success");
      })
      .catch((error) => {
        console.error("Error deleting employer:", error);
        fetchEmployers();
        showSnackbar("Failed to delete employer", "error");
      })
      .finally(() => {
        setDeleteDialogOpen(false);
      });
  };

  const handleUpdate = (id) => {
    setUpdateId(id);
    fetch(`http://localhost:8085/api/employers/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdateData({
          id: data.id,
          name: data.name,
          phone: data.phone,
          cin: data.cin,
          adress: data.adress,
          hireDate: data.hireDate,
          birthDate: data.birthDate,
        });
        setUpdateModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching employer for update:", error);
        showSnackbar("Failed to fetch employer details", "error");
      });
  };

  const updateEmployer = () => {
    fetch(`http://localhost:8085/api/employers/${updateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        if (response.ok) {
          fetchEmployers();
          setUpdateModalOpen(false);
          showSnackbar("Employer updated successfully", "success");
        } else {
          throw new Error("Update failed");
        }
      })
      .catch((error) => {
        console.error("Error updating employer:", error);
        showSnackbar("Failed to update employer", "error");
      });
  };

  const handleAddEmployer = () => {
    setAddModalOpen(true);
  };

  const addEmployer = () => {
    fetch("http://localhost:8085/api/employers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployerData),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchEmployers();
        setAddModalOpen(false);
        showSnackbar("Employer added successfully", "success");
      })
      .catch((error) => {
        console.error("Error adding employer:", error);
        showSnackbar("Failed to add employer", "error");
      });
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      fetchEmployers();
    } else {
      setLoading(true);
      fetch(`http://localhost:8085/api/employers/name/${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          setEmployers([data]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error searching employers by name:", error);
          setLoading(false);
          showSnackbar("Failed to search employers", "error");
        });
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.name}</td>
      <td>{item.phone}</td>
      <td>{item.cin}</td>
      <td>{item.adress}</td>
      <td>{item.hireDate}</td>
      <td>{item.birthDate}</td>
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
            onClick={handleAddEmployer}
            startIcon={<AddIcon style={{ fontSize: "2rem" }} />}
          >
            Add Employer
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
                Employers {employers.length}
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
              headData={employersTableHead}
              renderHead={(item, index) => renderHead(item, index)}
              bodyData={employers}
              renderBody={(item, index) => renderBody(item, index)}
            />
          )}
        </div>
      </div>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employer?
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
        <DialogTitle>Update Employer</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            variant="standard"
            label="Name"
            value={updateData.name}
            onChange={(e) =>
              setUpdateData({ ...updateData, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Phone"
            value={updateData.phone}
            onChange={(e) =>
              setUpdateData({ ...updateData, phone: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Cin"
            value={updateData.cin}
            onChange={(e) =>
              setUpdateData({ ...updateData, cin: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Adress"
            value={updateData.adress}
            onChange={(e) =>
              setUpdateData({ ...updateData, adress: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Hire Date"
            value={updateData.hireDate}
            onChange={(e) =>
              setUpdateData({ ...updateData, hireDate: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Birth Date"
            value={updateData.birthDate}
            onChange={(e) =>
              setUpdateData({ ...updateData, birthDate: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={updateEmployer} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Add New Employer</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            variant="standard"
            label="Name"
            value={newEmployerData.name}
            onChange={(e) =>
              setNewEmployerData({ ...newEmployerData, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Phone"
            value={newEmployerData.phone}
            onChange={(e) =>
              setNewEmployerData({ ...newEmployerData, phone: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Cin"
            value={newEmployerData.cin}
            onChange={(e) =>
              setNewEmployerData({ ...newEmployerData, cin: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Adress"
            value={newEmployerData.adress}
            onChange={(e) =>
              setNewEmployerData({ ...newEmployerData, adress: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Hire Date"
            value={newEmployerData.hireDate}
            onChange={(e) =>
              setNewEmployerData({
                ...newEmployerData,
                hireDate: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Birth Date"
            value={newEmployerData.birthDate}
            onChange={(e) =>
              setNewEmployerData({
                ...newEmployerData,
                birthDate: e.target.value,
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
          <Button onClick={addEmployer} color="primary">
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

export default Employers;
