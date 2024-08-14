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
  MenuItem,
  FormControlLabel,
  Switch,
  TextField,
  Snackbar,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "../components/Axios"; // Adjust import according to your setup

const materialsTableHead = [
  "",
  "Name",
  "Owned",
  "Reference",
  "Tasks",
  "Update",
  "Delete",
];

const renderHead = (item, index) => <th key={index}>{item}</th>;

const Materials = ({ projectId, employerId }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
const [newMaterialData, setNewMaterialData] = useState({
  name: "",
  owned: false,
  reference: "",
  taskIds: [],
  projectIds: [],
  employerIds: [],
  salaryIds: [],
  paymentIds: [],
});

const [updateData, setUpdateData] = useState({
  id: "",
  name: "",
  owned: false,
  reference: "",
  taskIds: [],
  projectIds: [],
  employerIds: [],
  salaryIds: [],
  paymentIds: [],
});


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [searchQuery, setSearchQuery] = useState("");

const [employers, setEmployers] = useState([]);
const [tasks, setTasks] = useState([]);
const [payments, setPayments] = useState([]);
const [salaries, setSalaries] = useState([]);
const [projects, setProjects] = useState([]);

useEffect(() => {
  // Fetch related entities
  fetchEmployers();
  fetchTasks();
  fetchPayments();
  fetchSalaries();
  fetchProjects();
}, []);

const fetchEmployers = () => {
  axios
    .get("http://localhost:8085/api/employers")
    .then((response) => setEmployers(response.data))
    .catch((error) => console.error("Error fetching employers:", error));
};

const fetchTasks = () => {
  axios
    .get("http://localhost:8085/api/tasks")
    .then((response) => setTasks(response.data))
    .catch((error) => console.error("Error fetching tasks:", error));
};

const fetchPayments = () => {
  axios
    .get("http://localhost:8085/api/payments")
    .then((response) => setPayments(response.data))
    .catch((error) => console.error("Error fetching payments:", error));
};

const fetchSalaries = () => {
  axios
    .get("http://localhost:8085/api/salaries")
    .then((response) => setSalaries(response.data))
    .catch((error) => console.error("Error fetching salaries:", error));
};

const fetchProjects = () => {
  axios
    .get("http://localhost:8085/api/projects")
    .then((response) => setProjects(response.data))
    .catch((error) => console.error("Error fetching projects:", error));
};



  useEffect(() => {
    fetchMaterials();
  }, [projectId, employerId]);

  const fetchMaterials = () => {
    setLoading(true);
    let url = "http://localhost:8085/api/materials";
    if (projectId) {
      url += `/projects/${projectId}`;
    } else if (employerId) {
      url += `/employers/${employerId}`;
    }

    axios
      .get(url)
      .then((response) => {
        setMaterials(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching materials:", error);
        setLoading(false);
        showSnackbar("Failed to fetch materials", "error");
      });
  };

  const handleDelete = (id) => {
    setDeleteDialogOpen(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    axios
      .delete(`http://localhost:8085/api/materials/${deleteId}`)
      .then(() => {
        fetchMaterials();
        showSnackbar("Material deleted successfully", "success");
      })
      .catch((error) => {
        console.error("Error deleting material:", error);
        showSnackbar("Failed to delete material", "error");
      })
      .finally(() => {
        setDeleteDialogOpen(false);
      });
  };

  const handleUpdate = (id) => {
    setUpdateId(id);
    axios
      .get(`http://localhost:8085/api/materials/${id}`)
      .then((response) => {
        setUpdateData({
          id: response.data.id,
          name: response.data.name,
          owned: response.data.owned,
          reference: response.data.reference,
          taskIds: response.data.tasks,
          projectIds: response.data.projectIds || [],
          employerIds: response.data.employerIds || [],
          salaryIds: response.data.salaryIds || [],
          paymentIds: response.data.paymentIds || [],
        });
        setUpdateModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching material for update:", error);
        showSnackbar("Failed to fetch material details", "error");
      });
  };

  const updateMaterial = () => {
    axios
      .put(`http://localhost:8085/api/materials/${updateId}`, updateData)
      .then(() => {
        fetchMaterials();
        setUpdateModalOpen(false);
        showSnackbar("Material updated successfully", "success");
      })
      .catch((error) => {
        console.error("Error updating material:", error);
        showSnackbar("Failed to update material", "error");
      });
  };

  const handleAddMaterial = () => {
    setAddModalOpen(true);
  };

 const addMaterial = () => {
   console.log(newMaterialData);

   axios
     .post("http://localhost:8085/api/materials", newMaterialData)
     .then(() => {
       console.log(newMaterialData);
       fetchMaterials();
       setAddModalOpen(false);
       showSnackbar("Material added successfully", "success");
     })
     .catch((error) => {
       console.error("Error adding material:", error);
       setSnackbar({
         open: true,
         message: "Failed to add material",
         severity: "error",
       });
     });
 };


  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      fetchMaterials();
    } else {
      setLoading(true);
      axios
        .get(`http://localhost:8085/api/materials/name/${searchQuery}`)
        .then((response) => {
          setMaterials(response.data.length ? response.data : []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error searching materials by name:", error);
          setLoading(false);
          showSnackbar("Failed to search materials", "error");
        });
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderBody = (item, index) => (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>{item.owned ? "Yes" : "No"}</td>
      <td>{item.reference}</td>
      <td>{item.tasks.join(", ")}</td>
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
        <Box>
          <Button
            sx={{ width: "200px", height: "55px" }}
            variant="contained"
            color="primary"
            onClick={handleAddMaterial}
            startIcon={<AddIcon style={{ fontSize: "2rem" }} />}
          >
            Add Material
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
                Materials {materials.length}
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
              headData={materialsTableHead}
              renderHead={renderHead}
              bodyData={materials}
              renderBody={renderBody}
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
          Are you sure you want to delete this material?
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
        <DialogTitle>Update Material</DialogTitle>
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
          />
          <FormControlLabel
            control={
              <Switch
                checked={updateData.owned}
                onChange={(e) =>
                  setUpdateData({ ...updateData, owned: e.target.checked })
                }
              />
            }
            label="Owned"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Reference"
            value={updateData.reference}
            onChange={(e) =>
              setUpdateData({ ...updateData, reference: e.target.value })
            }
            fullWidth
          />
          <TextField
            id="tasks"
            variant="standard"
            label="Select Tasks"
            select
            SelectProps={{
              multiple: true,
              value: updateData.taskIds,
              onChange: (e) => {
                setUpdateData({
                  ...updateData,
                  taskIds: e.target.value,
                });
              },
            }}
            fullWidth
          >
            {tasks.map((task) => (
              <MenuItem key={task.id} value={task.id}>
                {task.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="employers"
            variant="standard"
            label="Select Employers"
            select
            SelectProps={{
              multiple: true,
              value: updateData.employerIds,
              onChange: (e) => {
                setUpdateData({
                  ...updateData,
                  employerIds: e.target.value,
                });
              },
            }}
            fullWidth
          >
            {employers.map((employer) => (
              <MenuItem key={employer.id} value={employer.id}>
                {employer.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="payments"
            variant="standard"
            label="Select Payments"
            select
            SelectProps={{
              multiple: true,
              value: updateData.paymentIds,
              onChange: (e) => {
                setUpdateData({
                  ...updateData,
                  paymentIds: e.target.value,
                });
              },
            }}
            fullWidth
          >
            {payments.map((payment) => (
              <MenuItem key={payment.id} value={payment.id}>
                {payment.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="salaries"
            variant="standard"
            label="Select Salaries"
            select
            SelectProps={{
              multiple: true,
              value: updateData.salaryIds,
              onChange: (e) => {
                setUpdateData({
                  ...updateData,
                  salaryIds: e.target.value,
                });
              },
            }}
            fullWidth
          >
            {salaries.map((salary) => (
              <MenuItem key={salary.id} value={salary.id}>
                {salary.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="projects"
            variant="standard"
            label="Select Projects"
            select
            SelectProps={{
              multiple: true,
              value: updateData.projectIds,
              onChange: (e) => {
                setUpdateData({
                  ...updateData,
                  projectIds: e.target.value,
                });
              },
            }}
            fullWidth
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={updateMaterial} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <DialogTitle>Add Material</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            variant="standard"
            label="Name"
            required
            value={newMaterialData.name}
            onChange={(e) =>
              setNewMaterialData({ ...newMaterialData, name: e.target.value })
            }
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={newMaterialData.owned}
                onChange={(e) =>
                  setNewMaterialData({
                    ...newMaterialData,
                    owned: e.target.checked,
                  })
                }
              />
            }
            label="Owned"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Reference"
            required
            value={newMaterialData.reference}
            onChange={(e) =>
              setNewMaterialData({
                ...newMaterialData,
                reference: e.target.value,
              })
            }
            fullWidth
          />
          <TextField
            id="tasks"
            variant="standard"
            label="Select Tasks"
            select
            SelectProps={{
              multiple: true,
              value: newMaterialData.taskIds,
              onChange: (e) => {
                setNewMaterialData({
                  ...newMaterialData,
                  taskIds: e.target.value,
                });
              },
            }}
            fullWidth
          >
            {tasks.map((task) => (
              <MenuItem key={task.id} value={task.id}>
                {task.description}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="employers"
            variant="standard"
            label="Select Employers"
            select
            SelectProps={{
              multiple: true,
              value: newMaterialData.employerIds,
              onChange: (e) => {
                setNewMaterialData({
                  ...newMaterialData,
                  employerIds: e.target.value,
                });
              },
            }}
            fullWidth
          >
            {employers.map((employer) => (
              <MenuItem key={employer.id} value={employer.id}>
                {employer.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="payments"
            variant="standard"
            label="Select Payments"
            select
            SelectProps={{
              multiple: true,
              value: newMaterialData.paymentIds,
              onChange: (e) => {
                setNewMaterialData({
                  ...newMaterialData,
                  paymentIds: e.target.value,
                });
              },
            }}
            fullWidth
          >
            {payments.map((payment) => (
              <MenuItem key={payment.id} value={payment.id}>
                {payment.id}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="salaries"
            variant="standard"
            label="Select Salaries"
            select
            SelectProps={{
              multiple: true,
              value: newMaterialData.salaryIds,
              onChange: (e) => {
                setNewMaterialData({
                  ...newMaterialData,
                  salaryIds: e.target.value,
                });
              },
            }}
            fullWidth
          >
            {salaries.map((salary) => (
              <MenuItem key={salary.id} value={salary.id}>
                {salary.id}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="projects"
            variant="standard"
            label="Select Projects"
            select
            SelectProps={{
              multiple: true,
              value: newMaterialData.projectIds,
              onChange: (e) => {
                setNewMaterialData({
                  ...newMaterialData,
                  projectIds: e.target.value,
                });
              },
            }}
            fullWidth
          >
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={addMaterial} color="primary">
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

export default Materials;
