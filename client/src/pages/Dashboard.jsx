import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";
import StatusCard from "../components/status-card/StatusCard";
import Table from "../components/table/Table";
import axios from "axios";
import { Box, Card, CardContent, Typography } from "@mui/material";

// Chart options
const chartOptions = {
  options: {
    chart: {
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: [], // Placeholder for x-axis categories
    },
    legend: {
      position: "top",
    },
    grid: {
      show: false,
    },
  },
};

const Dashboard = () => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [employersCount, setEmployersCount] = useState(0);
  const [materialsCount, setMaterialsCount] = useState(0);
  const [salariesCount, setSalariesCount] = useState(0);

  const [combinedData, setCombinedData] = useState({
    categories: [],
    series: [],
  });

  const [topEmployers, setTopEmployers] = useState([]);
  const [latestProjects, setLatestProjects] = useState([]);

  const themeReducer = useSelector((state) => state.ThemeReducer.mode);

  useEffect(() => {
    // Fetch counts for cards
    axios
      .get("http://localhost:8085/api/projects/count")
      .then((response) => setProjectsCount(response.data));
    axios
      .get("http://localhost:8085/api/employers/count")
      .then((response) => setEmployersCount(response.data));
    axios
      .get("http://localhost:8085/api/materials/count")
      .then((response) => setMaterialsCount(response.data));
    axios
      .get("http://localhost:8085/api/salaries/count")
      .then((response) => setSalariesCount(response.data));

    // Fetch data for combined chart
    axios
      .all([
        axios.get("http://localhost:8085/api/projects/stats"),
        axios.get("http://localhost:8085/api/salaries/stats"),
        axios.get("http://localhost:8085/api/employers/stats"),
      ])
      .then(
        axios.spread((projectRes, salaryRes, employerRes) => {
          setCombinedData({
            categories: projectRes.data.categories, // Assuming all have the same categories
            series: [
              {
                name: "Projects",
                data: projectRes.data.data,
                color: "#FF4560",
              },

              {
                name: "Salaries",
                data: salaryRes.data.data,
                color: "#008FFB",
              },
              {
                name: "Employers",
                data: employerRes.data.data,
                color: "#775DD0",
              },
            ],
          });
        })
      )
      .catch((error) => console.error("Error fetching data for chart:", error));

    // Fetch top employers
    axios
      .get("http://localhost:8085/api/employers")
      .then((response) => setTopEmployers(response.data))
      .catch((error) => console.error("Error fetching top employers:", error));

    // Fetch latest projects
    axios
      .get("http://localhost:8085/api/projects")
      .then((response) => setLatestProjects(response.data))
      .catch((error) =>
        console.error("Error fetching latest projects:", error)
      );
  }, []);

  return (
    <div>
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
                Dashboard
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <div className="row">
        <div className="col-6">
          <div className="row">
            <div className="col-6">
              <Link to="/projects">
                <StatusCard
                  icon="bx bxs-briefcase"
                  count={projectsCount}
                  title="Projects"
                />
              </Link>
            </div>
            <div className="col-6">
              <Link to="/employers">
                <StatusCard
                  icon="bx bxs-user-detail"
                  count={employersCount}
                  title="Employers"
                />
              </Link>
            </div>
            <div className="col-6">
              <Link to="/materials">
                <StatusCard
                  icon="bx bxs-package"
                  count={materialsCount}
                  title="Materials"
                />
              </Link>
            </div>
            <div className="col-6">
              <Link to="/salaries">
                <StatusCard
                  icon="bx bxs-dock-left"
                  count={salariesCount}
                  title="Salaries"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card full-height">
            {/* Combined Chart */}
            <Chart
              options={{
                ...chartOptions.options,
                theme: {
                  mode: themeReducer === "theme-mode-dark" ? "dark" : "light",
                },
                xaxis: {
                  categories: combinedData.categories,
                },
              }}
              series={combinedData.series}
              type="line"
              height="100%"
            />
          </div>
        </div>
        <div className="col-4">
          <div className="card">
            <div className="card__header">
              <h3>Top Employers</h3>
            </div>
            <div className="card__body">
              <Table
                key={topEmployers.length}
                limit="4"
                headData={["Name", "Phone", "Email"]}
                renderHead={(item, index) => <th key={index}>{item}</th>}
                bodyData={topEmployers}
                renderBody={(item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.phone}</td>
                    <td>{item.email}</td>
                  </tr>
                )}
              />
            </div>
            <div className="card__footer">
              <Link to="/employers">view all</Link>
            </div>
          </div>
        </div>
        <div className="col-8">
          <div className="card">
            <div className="card__header">
              <h3>Latest Projects</h3>
            </div>
            <div className="card__body">
              <Table
                key={latestProjects.length}
                limit="5"
                headData={["Name", "Budget", "Start Date", "End Date"]}
                renderHead={(item, index) => <th key={index}>{item}</th>}
                bodyData={latestProjects}
                renderBody={(item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.budget}</td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                  </tr>
                )}
              />
            </div>
            <div className="card__footer">
              <Link to="/projects">view all</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
