import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import UserProfile from './components/UserProfile/UserProfile';
import SignUp from './components/SignUp/SignUp';
import { UserProvider, UserContext } from './context/UserContext';
import NavBar from './navBar/NavBar';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          
          <NavBar />
          <Switch>
            <Route exact  path="/" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            <Route path="/profiles" component={UserProfile} />
          </Switch>
        </div>
      </Router>
    </UserProvider>
  );
};



export default App;