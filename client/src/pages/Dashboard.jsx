import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import StatusCard from '../components/status-card/StatusCard';
import Table from '../components/table/Table';
import Badge from '../components/badge/Badge';
import axios from 'axios';

import LinearProgress, { linearProgressClasses } from "@mui/material/LinearProgress";
import { styled } from "@mui/material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, TextField, Snackbar, Box, Card, CardContent, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";


// Chart options
const chartOptions = {
    options: {
        chart: {
            background: 'transparent'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: [] // Placeholder for x-axis categories
        },
        legend: {
            position: 'top'
        },
        grid: {
            show: false
        }
    }
};

const Dashboard = () => {
    const renderHead = (item, index) => <th key={index}>{item}</th>;
    const renderBody = (item, index) => (
        <tr key={index} >
          <td>{item.name}</td>
          <td>{item.phone}</td>
       
          <td>{item.email}</td>
          
        </tr>
      );
      const renderHeadd = (item, index) => <th key={index}>{item}</th>;
      const renderBodyy = (item, index) => (
          <tr key={index} >
            <td>{item.name}</td>
            <td>{item.budget}</td>
         
            <td>{item.startDate}</td>
            <td>{item.endDate}</td>
            
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
    const [projectsCount, setProjectsCount] = useState(0);
    const [employersCount, setEmployersCount] = useState(0);
    const [materialsCount, setMaterialsCount] = useState(0);
    const [salariesCount, setSalariesCount] = useState(0);

    const [projectData, setProjectData] = useState({ categories: [], series: [] });
    const [topEmployers, setTopEmployers] = useState([]);
    const [latestProjects, setLatestProjects] = useState([]);

    const themeReducer = useSelector(state => state.ThemeReducer.mode);

    useEffect(() => {
        // Fetch counts for cards
        axios.get('http://localhost:8085/api/projects/count').then(response => setProjectsCount(response.data));
        axios.get('http://localhost:8085/api/employers/count').then(response => setEmployersCount(response.data));
        axios.get('http://localhost:8085/api/materials/count').then(response => setMaterialsCount(response.data));
        axios.get('http://localhost:8085/api/salaries/count').then(response => setSalariesCount(response.data));
        
        // Fetch data for chart
        axios.get('http://localhost:8085/api/projects/stats').then(response => {
            setProjectData({
                categories: response.data.categories,
                series: [{
                    name: 'Projects',
                    data: response.data.data
                }]
            });
        });

        // Fetch top employers
        axios.get('http://localhost:8085/api/employers')
        .then(response => {
            setTopEmployers(response.data);
            console.log("Top Employers:", response.data);
        })
        .catch(error => {
            console.error("Error fetching top employers:", error);
        });

    // Fetch latest projects
    axios.get('http://localhost:8085/api/projects')
        .then(response => {
            setLatestProjects(response.data);
            console.log("Latest Projects:", response.data);
        })
        .catch(error => {
            console.error("Error fetching latest projects:", error);
        });
    }, []);

    return (
        <div>
            <Box mb={"20px"}>
        <Card sx={{ width: "200px", height: "60px", backgroundColor: "#1976d2" }}>
          <CardContent sx={{ height: "100%" }}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography variant="h6" style={{ color: "white", fontWeight: "bold", textAlign: "center" }}>
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
                        <StatusCard
     icon="bx bxs-briefcase"
    count={projectsCount}
    title="Projects"
/>
                        </div>
                        <div className="col-6">
                        <StatusCard
   icon="bx bxs-user-detail"
    count={employersCount}
    title="Employers"
/>
                        </div>
                        <div className="col-6">
                        <StatusCard
   icon="bx bxs-package"
    count={materialsCount}
    title="Materials"
/>
                        </div>
                        <div className="col-6">
                        <StatusCard
   icon="bx bxs-dock-left"
    count={salariesCount}
    title="Salaries"
/>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card full-height">
                        {/* Chart */}
                        <Chart
                            options={{
                                ...chartOptions.options,
                                theme: { mode: themeReducer === 'theme-mode-dark' ? 'dark' : 'light' },
                                xaxis: {
                                    categories: projectData.categories
                                }
                            }}
                            series={projectData.series}
                            type='line'
                            height='100%'
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
              limit="5"
              headData={['Name', 'Phone', 'Email']}
              renderHead={renderHead}
              bodyData={topEmployers}
              renderBody={renderBody}
            />
                        </div>
                        <div className="card__footer">
                            <Link to='/employers'>view all</Link>
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
              limit="6"
              headData={['Name', 'Budget', 'Start Date', 'End Date']}
              renderHead={renderHeadd}
              bodyData={latestProjects}
              renderBody={renderBodyy}
            />

                        </div>
                        <div className="card__footer">
                            <Link to='/projects'>view all</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
