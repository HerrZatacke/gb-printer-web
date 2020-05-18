import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import Confirmation from '../Confirmation';
import LiveImage from '../LiveImage';
import Settings from '../Settings';
import Palettes from '../Palettes';
import Dump from '../Dump';
import Gallery from '../Gallery';
import Home from '../Home';
import EditImage from '../EditImage';
import RGBNImage from '../RGBNImage';

const App = (/* props */) => (
  <Router>
    <LiveImage />
    <Navigation />
    <div className="app__content">
      <Switch>
        <Route path="/gallery">
          <h1 className="app__content-headline">Gallery</h1>
          <p className="app__content-hint">
            These images are stored in the localStorage of your browser.
            That&apos;s why you (currently) cannot share a link to one of them.
            <br />
            Also if you clear your browser&apos;s cookies, the images will be gone too.
          </p>
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
          <h1 className="app__content-headline">Gameboy Printer Web</h1>
          <Home />
        </Route>
      </Switch>
    </div>
    <Confirmation />
    <EditImage />
    <RGBNImage />
  </Router>
);

App.propTypes = {
};

App.defaultProps = {
};

export default App;
