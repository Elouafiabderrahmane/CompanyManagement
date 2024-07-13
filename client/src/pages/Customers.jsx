import React from 'react'

import Table from '../components/table/Table'

import customerList from '../assets/JsonData/customers-list.json'
import LinearProgress, {linearProgressClasses} from "@mui/material/LinearProgress";
import {styled} from "@mui/material";

const customerTableHead = [
    '',
    'name',
    'email',
    'phone',
    'total orders',
    'total spend',
    'location'
]

const renderHead = (item, index) => <th key={index}>{item}</th>

const renderBody = (item, index) => (
    <tr key={index}>
        <td>{item.id}</td>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.phone}</td>
        <td>{item.total_orders}</td>
        <td>{item.total_spend}</td>
        <td>{item.location}</td>
    </tr>
)

const Customers = () => {
    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));
    return (
        <div>
            <h2 className="page-header">
                customers
            </h2>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card__body">
                            <Table
                                limit='10'
                                headData={customerTableHead}
                                renderHead={(item, index) => renderHead(item, index)}
                                bodyData={customerList}
                                renderBody={(item, index) => renderBody(item, index)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <BorderLinearProgress variant="determinate" value={50} />
        </div>
    )
}

export default Customers
