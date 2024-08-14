import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../components/Axios"; // Import axios from your custom module
import Table from "../components/table/Table";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material";
import { Snackbar, Box, Card, CardContent, Typography } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const employersTableHead = [
  "Name",
  "Phone",
  "Cin",
  "Address",
  "Hire Date",
  "Birth Date",
  "Email",
  "Update",
  "Delete",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Employers = ({ projectId }) => {
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
    email: "",
    hireDate: "",
    birthDate: "",
    image: null,
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEmployerData, setNewEmployerData] = useState({
    name: "",
    phone: "",
    cin: "",
    email: "",
    adress: "",
    hireDate: "",
    birthDate: "",
    projects: [],
    tasks: [],
    materials: [],
    salaries: [],
    payments: [],
    user: "",
    image: null,
  });

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          projectsRes,
          tasksRes,
          materialsRes,
          salariesRes,
          paymentsRes,
          usersRes,
        ] = await Promise.all([
          axios.get("http://localhost:8085/api/projects"),
          axios.get("http://localhost:8085/api/tasks"),
          axios.get("http://localhost:8085/api/materials"),
          axios.get("http://localhost:8085/api/salaries"),
          axios.get("http://localhost:8085/api/payments"),
          axios.get("http://localhost:8085/api/users"),
        ]);

        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
        setMaterials(materialsRes.data);
        setSalaries(salariesRes.data);
        setPayments(paymentsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchEmployers();
    fetchData();
  }, [projectId]);

  const fetchEmployers = () => {
    setLoading(true);
    const url = projectId
      ? `http://localhost:8085/api/employers/projects/${projectId}`
      : "http://localhost:8085/api/employers";

    axios
      .get(url)
      .then((response) => {
        setEmployers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employers:", error);
        setLoading(false);
        showSnackbar("Failed to fetch employers", "error");
      });
  };
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setNewEmployerData({
      ...newEmployerData,
      [field]: Array.isArray(value) ? value : event.target.value,
    });
  };

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:8085/api/employers/${deleteId}`)
      .then((response) => {
        fetchEmployers();
        showSnackbar("Employer deleted successfully", "success");
      })
      .catch((error) => {
        console.error("Error deleting employer:", error);
        showSnackbar("Failed to delete employer", "error");
      })
      .finally(() => {
        setDeleteDialogOpen(false);
      });
  };

  const handleUpdate = (id) => {
    setUpdateId(id);
    axios
      .get(`http://localhost:8085/api/employers/${id}`)
      .then((response) => {
        setUpdateData({
          id: response.data.id,
          name: response.data.name,
          phone: response.data.phone,
          cin: response.data.cin,
          adress: response.data.adress,
          email: response.data.email,
          hireDate: response.data.hireDate,
          birthDate: response.data.birthDate,
          image: response.data.image,
        });
        setUpdateModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching employer for update:", error);
        showSnackbar("Failed to fetch employer details", "error");
      });
  };

  const updateEmployer = () => {
    const formData = new FormData();
    Object.keys(updateData).forEach((key) => {
      formData.append(key, updateData[key]);
    });

    axios
      .put(`http://localhost:8085/api/employers/${updateId}`, formData)
      .then((response) => {
        fetchEmployers();
        setUpdateModalOpen(false);
        showSnackbar("Employer updated successfully", "success");
      })
      .catch((error) => {
        console.error("Error updating employer:", error);
        showSnackbar("Failed to update employer", "error");
      });
  };

  const handleAddEmployer = () => {
    setAddModalOpen(true);
  };

  const addEmployer = async () => {
    const formData = new FormData();
    Object.keys(newEmployerData).forEach((key) => {
      if (key === "image" && newEmployerData[key]) {
        formData.append(key, newEmployerData[key]);
      } else if (key !== "image") {
        formData.append(key, newEmployerData[key]);
      }
    });

    try {
      await axios.post("http://localhost:8085/api/employers", formData);
      setAddModalOpen(false);
      fetchEmployers(); // Refresh employer list or perform necessary updates
    } catch (error) {
      console.error("Error adding employer:", error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      fetchEmployers();
    } else {
      setLoading(true);
      axios
        .get(`http://localhost:8085/api/employers/name/${searchQuery}`)
        .then((response) => {
          setEmployers([response.data]);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error searching employers by name:", error);
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

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderBody = (item, index) => (
    <tr key={index} onClick={() => navigate(`/employers/${item.id}`)}>
      <td>{item.name}</td>
      <td>{item.phone}</td>
      <td>{item.cin}</td>
      <td>{item.adress}</td>
      <td>{item.hireDate}</td>
      <td>{item.birthDate}</td>
      <td>{item.email}</td>
      <td>
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleUpdate(item.id);
          }}
        >
          Update
        </Button>
      </td>
      <td>
        <Button
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(item.id);
          }}
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
            onClick={handleAddEmployer}
            startIcon={<AddIcon style={{ fontSize: "2rem" }} />}
          >
            Add Employer
          </Button>
        </Box>
      </Box>
      <Box mb={"20px"}></Box>
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
              renderHead={renderHead}
              bodyData={employers}
              renderBody={renderBody}
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this employer?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Employer Modal */}
      <Dialog open={updateModalOpen} onClose={() => setUpdateModalOpen(false)}>
        <DialogTitle>Update Employer</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={updateData.name}
            onChange={(e) =>
              setUpdateData({ ...updateData, name: e.target.value })
            }
          />
          <TextField
            label="Phone"
            fullWidth
            margin="dense"
            value={updateData.phone}
            onChange={(e) =>
              setUpdateData({ ...updateData, phone: e.target.value })
            }
          />
          <TextField
            label="CIN"
            fullWidth
            margin="dense"
            value={updateData.cin}
            onChange={(e) =>
              setUpdateData({ ...updateData, cin: e.target.value })
            }
          />
          <TextField
            label="Address"
            fullWidth
            margin="dense"
            value={updateData.adress}
            onChange={(e) =>
              setUpdateData({ ...updateData, adress: e.target.value })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={updateData.email}
            onChange={(e) =>
              setUpdateData({ ...updateData, email: e.target.value })
            }
          />
          <TextField
            label="Hire Date"
            fullWidth
            margin="dense"
            value={updateData.hireDate}
            onChange={(e) =>
              setUpdateData({ ...updateData, hireDate: e.target.value })
            }
          />
          <TextField
            label="Birth Date"
            fullWidth
            margin="dense"
            value={updateData.birthDate}
            onChange={(e) =>
              setUpdateData({ ...updateData, birthDate: e.target.value })
            }
          />
          <input
            type="file"
            onChange={(e) =>
              setUpdateData({ ...updateData, image: e.target.files[0] })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateModalOpen(false)}>Cancel</Button>
          <Button onClick={updateEmployer} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Employer Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Add Employer</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={newEmployerData.name}
            onChange={handleChange("name")}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="dense"
            value={newEmployerData.phone}
            onChange={handleChange("phone")}
          />
          <TextField
            label="CIN"
            fullWidth
            margin="dense"
            value={newEmployerData.cin}
            onChange={handleChange("cin")}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newEmployerData.email}
            onChange={handleChange("email")}
          />
          <TextField
            label="Address"
            fullWidth
            margin="dense"
            value={newEmployerData.adress}
            onChange={handleChange("adress")}
          />
          <TextField
            label="Hire Date"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newEmployerData.hireDate}
            onChange={handleChange("hireDate")}
          />
          <TextField
            label="Birth Date"
            fullWidth
            margin="dense"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newEmployerData.birthDate}
            onChange={handleChange("birthDate")}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Projects</InputLabel>
            <Select
              multiple
              value={newEmployerData.projects}
              onChange={handleChange("projects")}
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Tasks</InputLabel>
            <Select
              multiple
              value={newEmployerData.tasks}
              onChange={handleChange("tasks")}
            >
              {tasks.map((task) => (
                <MenuItem key={task.id} value={task.id}>
                  {task.tasktype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Materials</InputLabel>
            <Select
              multiple
              value={newEmployerData.materials}
              onChange={handleChange("materials")}
            >
              {materials.map((material) => (
                <MenuItem key={material.id} value={material.id}>
                  {material.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Salaries</InputLabel>
            <Select
              multiple
              value={newEmployerData.salaries}
              onChange={handleChange("salaries")}
            >
              {salaries.map((salary) => (
                <MenuItem key={salary.id} value={salary.id}>
                  {salary.amount}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Payments</InputLabel>
            <Select
              multiple
              value={newEmployerData.payments}
              onChange={handleChange("payments")}
            >
              {payments.map((payment) => (
                <MenuItem key={payment.id} value={payment.id}>
                  {payment.amount}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>User</InputLabel>
            <Select
              value={newEmployerData.user}
              onChange={handleChange("user")}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <input
            type="file"
            onChange={(e) =>
              setNewEmployerData({
                ...newEmployerData,
                image: e.target.files[0],
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          <Button onClick={addEmployer} color="primary">
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
    </div>
  );
};

export default Employers;
