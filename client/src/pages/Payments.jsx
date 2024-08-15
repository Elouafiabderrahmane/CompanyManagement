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
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "../components/Axios";

const paymentsTableHead = [
  "ID",
  "Time",
  "Type",
  "Amount",
  "Project",
  "Material",
  "Employer",
  "Update",
  "Delete",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updateData, setUpdateData] = useState({
    id: "",
    time: "",
    type: "",
    amount: "",
    project: "",
    material: "",
    employer: "",
  });
  const [fieldsDisabled, setFieldsDisabled] = useState({
    project: false,
    material: false,
    employer: false,
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newPaymentData, setNewPaymentData] = useState({
    time: "",
    type: "",
    amount: "",
    project: "",
    material: "",
    employer: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const [employers, setEmployers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [projects, setProjects] = useState([]);

  // Fetch data when the component mounts
  useEffect(() => {
    fetchPayments();
    fetchProjects();
    fetchMaterials();
    fetchEmployers();
  }, []);

  const fetchProjects = async () => {
    const response = await fetch("http://localhost:8085/api/projects");
    const data = await response.json();
    setProjects(data); // Update the state with the fetched data
  };

  const fetchMaterials = async () => {
    const response = await fetch("http://localhost:8085/api/materials");
    const data = await response.json();
    setMaterials(data); // Update the state with the fetched data
  };

  const fetchEmployers = async () => {
    const response = await fetch("http://localhost:8085/api/employers");
    const data = await response.json();
    setEmployers(data); // Update the state with the fetched data
  };

  const fetchPayments = () => {
    setLoading(true);
    axios
      .get("http://localhost:8085/api/payments")
      .then((response) => {
        setPayments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payments:", error);
        setLoading(false);
        showSnackbar("Failed to fetch payments", "error");
      });
  };

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:8085/api/payments/${deleteId}`)
      .then(() => {
        setPayments(payments.filter((payment) => payment.id !== deleteId));
        showSnackbar("Payment deleted successfully", "success");
      })
      .catch((error) => {
        console.error("Error deleting payment:", error);
        showSnackbar("Failed to delete payment", "error");
      })
      .finally(() => {
        setDeleteDialogOpen(false);
      });
  };

  const handleUpdate = (id) => {
    setUpdateId(id);
    axios
      .get(`http://localhost:8085/api/payments/${id}`)
      .then((response) => {
        setUpdateData({
          id: response.data.id,
          time: response.data.time,
          type: response.data.type,
          amount: response.data.amount,
          project: response.data.project,
          material: response.data.material,
          employer: response.data.employer,
        });
        setUpdateModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching payment for update:", error);
        showSnackbar("Failed to fetch payment details", "error");
      });
  };

  const updatePayment = () => {
    axios
      .put(`http://localhost:8085/api/payments/${updateId}`, updateData)
      .then(() => {
        fetchPayments();
        setUpdateModalOpen(false);
        showSnackbar("Payment updated successfully", "success");
      })
      .catch((error) => {
        console.error("Error updating payment:", error);
        showSnackbar("Failed to update payment", "error");
      });
  };

  const handleAddPayment = () => {
    setAddModalOpen(true);
  };

  const addPayment = async () => {
    const formData = new FormData();
    formData.append("time", newPaymentData.time);
    formData.append("type", newPaymentData.type);
    formData.append("amount", newPaymentData.amount);
    formData.append("project", newPaymentData.project);
    formData.append("material", newPaymentData.material);
    formData.append("employer", newPaymentData.employer);

    try {
      const response = await fetch("http://localhost:8085/api/payments", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setAddModalOpen(false);
        fetchPayments(); // Refresh your payment list
        showSnackbar("Payment added successfully", "success");
      } else {
        throw new Error("Failed to add payment");
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      showSnackbar("Failed to add payment", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.time}</td>
      <td>{item.type}</td>
      <td>{item.amount}</td>
      <td>{item.project !== null ? item.project : "⊘"}</td>
      <td>{item.material !== null ? item.material : "⊘"}</td>
      <td>{item.employer !== null ? item.employer : "⊘"}</td>
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

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      fetchPayments();
    } else {
      setLoading(true);
      axios
        .get(`http://localhost:8085/api/payments/${searchQuery}`)
        .then((response) => {
          setPayments([response.data]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error searching payments by ID:", error);
          setLoading(false);
          showSnackbar("Failed to search payments", "error");
        });
    }
  };

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
            label="Search by ID"
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
            onClick={handleAddPayment}
            startIcon={<AddIcon style={{ fontSize: "2rem" }} />}
          >
            Add Payment
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
                Payments {payments.length}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {loading ? (
                <BorderLinearProgress />
              ) : (
                <Table
                  limit="10"
                  headData={paymentsTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={payments}
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
          Are you sure you want to delete this payment?
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
        <DialogTitle>Update Payment</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            variant="standard"
            label="Time"
            type="date"
            value={updateData.time}
            onChange={(e) =>
              setUpdateData({ ...updateData, time: e.target.value })
            }
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal" variant="standard">
            <InputLabel>Type</InputLabel>
            <Select
              value={updateData.type}
              onChange={(e) =>
                setUpdateData({ ...updateData, type: e.target.value })
              }
            >
              <MenuItem value="EMPLOYER">EMPLOYER</MenuItem>
              <MenuItem value="PROJECT">PROJECT</MenuItem>
              <MenuItem value="MATERIAL">MATERIAL</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="standard-basic"
            variant="standard"
            label="Amount"
            value={updateData.amount}
            onChange={(e) =>
              setUpdateData({ ...updateData, amount: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={updatePayment} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Add Payment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="date"
            margin="dense"
            value={newPaymentData.time}
            onChange={(e) =>
              setNewPaymentData({ ...newPaymentData, time: e.target.value })
            }
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={newPaymentData.type}
              onChange={(e) => {
                setNewPaymentData({
                  ...newPaymentData,
                  type: e.target.value,
                  material: "",
                  employer: "",
                  project: "",
                });
                setFieldsDisabled({
                  project: e.target.value !== "PROJECT",
                  material: e.target.value !== "MATERIAL",
                  employer: e.target.value !== "EMPLOYER",
                });
              }}
            >
              <MenuItem value="MATERIALl">Material</MenuItem>
              <MenuItem value="EMPLOYER">Employer</MenuItem>
              <MenuItem value="PROJECT">Project</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            fullWidth
            margin="dense"
            value={newPaymentData.amount}
            onChange={(e) =>
              setNewPaymentData({ ...newPaymentData, amount: e.target.value })
            }
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              value={newPaymentData.project}
              onChange={(e) =>
                setNewPaymentData({
                  ...newPaymentData,
                  project: e.target.value,
                })
              }
              disabled={fieldsDisabled.project}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Material</InputLabel>
            <Select
              value={newPaymentData.material}
              onChange={(e) =>
                setNewPaymentData({
                  ...newPaymentData,
                  material: e.target.value,
                })
              }
              disabled={fieldsDisabled.material}
            >
              {materials.map((material) => (
                <MenuItem key={material.id} value={material.id}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Employer</InputLabel>
            <Select
              value={newPaymentData.employer}
              onChange={(e) =>
                setNewPaymentData({
                  ...newPaymentData,
                  employer: e.target.value,
                })
              }
              disabled={fieldsDisabled.employer}
            >
              {employers.map((employer) => (
                <MenuItem key={employer.id} value={employer.id}>
                  {employer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button onClick={addPayment} color="primary">
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

export default Payments;
