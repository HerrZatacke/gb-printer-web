import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Navigation from '../Navigation';
import GameBoyImage from '../GameBoyImage';
import Settings from '../Settings';

const App = (/* props */) => (
  <Router>
    <GameBoyImage />
    <Navigation />
    <div className="app__content">
      <Switch>
        <Route path="/gallery">
          <h1 className="app__content-headline">Gallery</h1>
        </Route>
        <Route path="/palettes">
          <h1 className="app__content-headline">Palettes</h1>
        </Route>
        <Route path="/settings">
          <h1 className="app__content-headline">Settings</h1>
          <Settings />
        </Route>
        <Route path="/">
          <h1 className="app__content-headline">Home</h1>
        </Route>
      </Switch>
    </div>
  </Router>
);

App.propTypes = {
};

App.defaultProps = {
};

export default App;
