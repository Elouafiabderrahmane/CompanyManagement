import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Customers from "../pages/Customers";
import Materials from "../pages/Materials";
import Tasks from "../pages/Tasks";
import Payments from "../pages/Payments";
import Salaries from "../pages/Salaries";
import Employers from '../pages/Employers';

const Routes = () => {
    return (
      <Switch>
        <Route path="/" exact component={Dashboard} />
        <Route path="/customers" component={Customers} />
        <Route path="/Materials" component={Materials} />
        <Route path="/Tasks" component={Tasks} />
        <Route path="/Payments" component={Payments} />
        <Route path="/Salaries" component={Salaries} />
        <Route path="/Employers" component={Employers}/>
      </Switch>
    );
}

export default Routes
