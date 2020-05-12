import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import LiveImage from '../LiveImage';
import Settings from '../Settings';
import Palettes from '../Palettes';
import Dump from '../Dump';
import Gallery from '../Gallery';

const App = (/* props */) => (
  <Router>
    <LiveImage />
    <Navigation />
    <div className="app__content">
      <Switch>
        <Route path="/gallery">
          <h1 className="app__content-headline">Gallery</h1>
          <Gallery />
        </Route>
        <Route path="/palettes">
          <h1 className="app__content-headline">Palettes</h1>
          <Palettes />
        </Route>
        <Route path="/settings">
          <h1 className="app__content-headline">Settings</h1>
          <Settings />
        </Route>
        <Route path="/dump">
          <h1 className="app__content-headline">Paste your plaintext</h1>
          <Dump />
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
