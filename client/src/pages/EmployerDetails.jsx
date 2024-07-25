import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { styled } from "@mui/system";
import defaultImage from "../assets/images/AxeoFM_Maquette3D_Drone-3.jpg";
import PeopleIcon from "@mui/icons-material/People";
import BuildIcon from "@mui/icons-material/Build";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Table from "../components/table/Table";
import Tasks from "./Tasks";
import Materials from "./Materials"; // Import the Materials component
import Projects from "./Projects"; // Import the Projects component

const StyledImage = styled("img")({
  width: "100%",
  height: "auto",
  borderRadius: "8px",
  marginBottom: "16px",
});

const EmployerDetails = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));

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

const EmployersDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employer, setEmployer] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("employerDetails");
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const tableHeaders = {
    projects: ["", "Project Name", "Description", "Budget", "Start Date", "End Date"],
    tasks: ["", "Task Type", "Title", "Description", "Starting Date", "Ending Date", "Project", "Status"],
    materials: ["", "Material Name", "Quantity", "Price", "Project"],
  };

  useEffect(() => {
    console.log(id);
    fetch(`http://localhost:8085/api/employers/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error("Employer not found");
        return response.json();
      })
      .then((data) => {
        setEmployer(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const fetchData = (dataType) => {
    setTableLoading(true);
    fetch(`http://localhost:8085/api/employers/${id}/${dataType}`)
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
        setView(dataType);
        setTableLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setTableLoading(false);
      });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const renderHead = (item, index) => <th key={index}>{item}</th>;

  const renderBody = (item, index) => (
    <tr key={index}>
      {Object.values(item).map((val, i) => (
        <td key={i}>{val}</td>
      ))}
    </tr>
  );

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Box padding={3}>
      {view === "employerDetails" ? (
        <>
        <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/employers/`)}
            startIcon={<ArrowBackIosIcon />}
            sx={{ marginBottom: 2 }}
          >
            Return
          </Button>
          <Box
            sx={{ marginBottom: "20px" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Button
              sx={{
                width: "150px",
                height: "60px",
                marginRight: "10px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              variant="contained"
              color="primary"
              startIcon={<PeopleIcon />}
              onClick={() => setView("projects")}
            >
              Projects
            </Button>
            <Button
              sx={{
                width: "150px",
                height: "60px",
                marginRight: "10px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              variant="contained"
              color="primary"
              startIcon={<AssignmentIcon />}
              onClick={() => setView("tasks")}
            >
              Tasks
            </Button>
            <Button
              sx={{
                width: "150px",
                height: "60px",
                marginRight: "10px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              variant="contained"
              color="primary"
              startIcon={<BuildIcon />}
              onClick={() => fetchData("materials")}
            >
              Materials
            </Button>
          </Box>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            {employer.name}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <EmployerDetails>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {`Phone: ${employer.phone}`}
                </Typography>
                <Typography variant="body1" paragraph>
                  {`Address: ${employer.address}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {`Hire Date: ${employer.hireDate}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {`Birth Date: ${employer.birthDate}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {`Email: ${employer.email}`}
                </Typography>
              </EmployerDetails>
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledImage
                src={image || defaultImage}
                alt={employer.name || "Employer Image"}
              />
            </Grid>
          </Grid>
        </>
      ) : view === "projects" ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView("employerDetails")}
            startIcon={<ArrowBackIosIcon />}
            sx={{ marginBottom: 2 }}
          >
            Return
          </Button>
          <Projects employerId={id} />
        </>
      ) : view === "tasks" ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView("employerDetails")}
            startIcon={<ArrowBackIosIcon />}
            sx={{ marginBottom: 2 }}
          >
            Return
          </Button>
          <Tasks employerId={id} />
        </>
      ) : view === "materials" ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView("employerDetails")}
            startIcon={<ArrowBackIosIcon />}
            sx={{ marginBottom: 2 }}
          >
            Return
          </Button>
          <Materials employerId={id} />
        </>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setView("employerDetails")}
            startIcon={<ArrowBackIosIcon />}
            sx={{ marginBottom: 2 }}
          >
            Return
          </Button>
          {tableLoading ? (
            <BorderLinearProgress />
          ) : (
            <Table
              limit="10"
              headData={tableHeaders[view]}
              renderHead={renderHead}
              bodyData={tableData}
              renderBody={renderBody}
            />
          )}
        </>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        action={
          <Button
            color="inherit"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
          >
            Close
          </Button>
        }
        C        ContentProps={{
          style: {
            backgroundColor:
              snackbar.severity === "success"
                ? "#4caf50"
                : snackbar.severity === "error"
                ? "#f44336"
                : "#1976d2",
          },
        }}
      />
    </Box>
  );
};

export default EmployersDetails;
