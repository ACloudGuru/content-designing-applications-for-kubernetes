import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import {
  CssBaseline,
  withStyles,
} from '@material-ui/core';

import AppHeader from './components/AppHeader';
import ListManager from './pages/ListManager';

const styles = theme => ({
  main: {
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
});

const App = ({ classes }) => (
  <Fragment>
    <CssBaseline />
    <AppHeader />
    <main className={classes.main}>
      <Route exact path="/">
        <Redirect to="/list" />
      </Route>
      <Route path="/list" component={ListManager} />
    </main>
  </Fragment>
);

export default withStyles(styles)(App);
