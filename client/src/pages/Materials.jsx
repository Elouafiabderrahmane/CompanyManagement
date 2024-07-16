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
} from "@mui/material";

const materialsTableHead = [
  "",
  "name",
  "owned",
  "reference",
  "tasks",
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

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
    // Optimistically remove the item from the list
    setMaterials(materials.filter((material) => material.id !== id));
  };

  const confirmDelete = () => {
    fetch(`http://localhost:8085/api/materials/${deleteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Delete failed");
        }
        showSnackbar("Material deleted successfully", "success");
      })
      .catch((error) => {
        console.error("Error deleting material:", error);
        // Revert the optimistic update
        fetchMaterials();
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
      <h2 className="page-header">Materials</h2>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card__body">
              {loading ? (
                <BorderLinearProgress />
              ) : (
                <Table
                  limit="10"
                  headData={materialsTableHead}
                  renderHead={(item, index) => renderHead(item, index)}
                  bodyData={materials}
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
            label="Reference"
            value={updateData.reference}
            onChange={(e) =>
              setUpdateData({ ...updateData, reference: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tasks"
            value={updateData.tasks.join(", ")}
            onChange={(e) =>
              setUpdateData({
                ...updateData,
                tasks: e.target.value.split(", "),
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
