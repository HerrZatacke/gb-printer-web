import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Navigation from '../Navigation';
import GameBoyImage from '../GameBoyImage';

const App = (/* props */) => (
  <Router>
    <GameBoyImage />
    <Navigation />
    <div className="app__content">
      <Switch>
        <Route path="/gallery">
          <div>Gallery</div>
        </Route>
        <Route path="/palettes">
          <div>Palettes</div>
        </Route>
        <Route path="/settings">
          <div>Settings</div>
        </Route>
        <Route path="/">
          <div>Home</div>
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
