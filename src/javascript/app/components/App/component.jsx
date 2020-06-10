import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navigation from '../Navigation';
import Confirmation from '../Confirmation';
import EditForm from '../EditForm';
import LiveImage from '../LiveImage';
import LightboxImage from '../LightboxImage';
import RGBNImage from '../RGBNImage';
import Settings from '../Settings';
import Palettes from '../Palettes';
import Dump from '../Dump';
import Gallery from '../Gallery';
import Home from '../Home';
import DragOver from '../DragOver';
import GalleryIntroText from './galleryInroText';
import getValidPageIndex from '../../../tools/getValidPageIndex';
import FilterForm from '../FilterForm';

const App = (props) => (
  <Router>
    <Navigation />
    <div className="app__content">
      <Switch>
        <Route exact path="/gallery">
          <Redirect to="/gallery/page/1" />
        </Route>
        <Route
          path="/gallery/page/:page"
          render={({ match }) => {

            const { valid, page } = getValidPageIndex({
              urlParam: match.params.page,
              pageSize: props.pageSize,
              imageCount: props.filteredCount,
            });

            return valid ? (
              <>
                <GalleryIntroText
                  imageCount={props.imageCount}
                  selectedCount={props.selectedCount}
                  filteredCount={props.filteredCount}
                />
                <Gallery page={page} />
              </>
            ) : (
              <Redirect to={`/gallery/page/${page + 1}`} />
            );
          }}
        />
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
          <Home />
        </Route>
      </Switch>
    </div>
    <Confirmation />
    <EditForm />
    <LiveImage />
    <LightboxImage />
    <RGBNImage />
    <DragOver />
    <FilterForm />
  </Router>
);

App.propTypes = {
  imageCount: PropTypes.number.isRequired,
  selectedCount: PropTypes.number.isRequired,
  filteredCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
};

App.defaultProps = {
};

export default App;
