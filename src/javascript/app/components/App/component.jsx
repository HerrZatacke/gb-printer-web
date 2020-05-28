import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import Confirmation from '../Confirmation';
import EditImage from '../EditImage';
import LiveImage from '../LiveImage';
import LightboxImage from '../LightboxImage';
import RGBNImage from '../RGBNImage';
import Settings from '../Settings';
import Palettes from '../Palettes';
import Dump from '../Dump';
import GalleryHeader from '../GalleryHeader';
import Gallery from '../Gallery';
import Home from '../Home';
import DragOver from '../DragOver';

const App = (props) => (
  <Router>
    <Navigation />
    <div className="app__content">
      <Switch>
        <Route path="/gallery">
          <h1 className="app__content-headline">
            {`Gallery (${props.imageCount})`}
          </h1>
          <p className="app__content-hint">
            These images are stored in the localStorage of your browser.
            That&apos;s why you (currently) cannot share a link to one of them.
            <br />
            Also if you clear your browser&apos;s cookies, the images will be gone too.
          </p>
          <GalleryHeader />
          <Gallery />
          <GalleryHeader />
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
    <LiveImage />
    <LightboxImage />
    <RGBNImage />
    <DragOver />
  </Router>
);

App.propTypes = {
  imageCount: PropTypes.number.isRequired,
};

App.defaultProps = {
};

export default App;
