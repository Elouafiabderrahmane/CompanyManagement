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
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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
const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updateData, setUpdateData] = useState({
    id: "",
    name: "",
    owned: false,
    reference: "",
    tasks: [],
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newMaterialData, setNewMaterialData] = useState({
    name: "",
    owned: false,
    reference: "",
    tasks: [],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = () => {
    setLoading(true);
    fetch("http://localhost:8085/api/materials")
      .then((response) => response.json())
      .then((data) => {
        setMaterials(data);
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
    fetch(`http://localhost:8085/api/materials/${deleteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Delete failed");
        }
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
    fetch(`http://localhost:8085/api/materials/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUpdateData({
          id: data.id,
          name: data.name,
          owned: data.owned,
          reference: data.reference,
          tasks: data.tasks,
        });
        setUpdateModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching material for update:", error);
        showSnackbar("Failed to fetch material details", "error");
      });
  };

  const updateMaterial = () => {
    fetch(`http://localhost:8085/api/materials/${updateId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => {
        if (response.ok) {
          fetchMaterials();
          setUpdateModalOpen(false);
          showSnackbar("Material updated successfully", "success");
        } else {
          throw new Error("Update failed");
        }
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
    fetch("http://localhost:8085/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMaterialData),
    })
      .then((response) => response.json())
      .then((data) => {
        fetchMaterials();
        setAddModalOpen(false);
        showSnackbar("Material added successfully", "success");
      })
      .catch((error) => {
        console.error("Error adding material:", error);
        showSnackbar("Failed to add material", "error");
      });
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      fetchMaterials();
    } else {
      setLoading(true);
      fetch(`http://localhost:8085/api/materials/name/${searchQuery}`)
        .then((response) => response.json())
        .then((data) => {
          setMaterials(data.length ? data : []);
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
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={updateData.owned}
                onChange={(e) =>
                  setUpdateData({ ...updateData, owned: e.target.checked })
                }
                color="primary"
              />
            }
            label="Owned"
            style={{ marginBottom: 0 }}
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
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Tasks"
            value={updateData.tasks.join(", ")}
            onChange={(e) =>
              setUpdateData({
                ...updateData,
                tasks: e.target.value.split(",").map((task) => task.trim()),
              })
            }
            fullWidth
            margin="normal"
          />
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
        <DialogTitle>Add New Material</DialogTitle>
        <DialogContent>
          <TextField
            id="standard-basic"
            variant="standard"
            label="Name"
            value={newMaterialData.name}
            onChange={(e) =>
              setNewMaterialData({ ...newMaterialData, name: e.target.value })
            }
            fullWidth
            margin="normal"
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
                color="primary"
              />
            }
            label="Owned"
            style={{ marginBottom: 0 }}
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Reference"
            value={newMaterialData.reference}
            onChange={(e) =>
              setNewMaterialData({
                ...newMaterialData,
                reference: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            id="standard-basic"
            variant="standard"
            label="Tasks (comma-separated)"
            value={newMaterialData.tasks.join(", ")}
            onChange={(e) =>
              setNewMaterialData({
                ...newMaterialData,
                tasks: e.target.value.split(",").map((task) => task.trim()),
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
