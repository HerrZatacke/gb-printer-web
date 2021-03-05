import React from 'react';
import PropTypes from 'prop-types';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navigation from '../Navigation';
import Home from '../Home';
import Gallery from '../Gallery';
import Import from '../Import';
import Palettes from '../Palettes';
import Settings from '../Settings';
import Overlays from '../Overlays';
import GalleryIntroText from './galleryInroText';
import getValidPageIndex from '../../../tools/getValidPageIndex';
import { getEnv } from '../../../tools/getEnv';

const App = (props) => {
  const env = getEnv();

  return (
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
            <ul className="app__version">
              <li>{`Web-App version: ${VERSION}`}</li>
              <li>{`Web-App branch: ${BRANCH}`}</li>
              <li>{`Printer version: ${env.version}`}</li>
              <li>{`Max Images: ${env.maximages}`}</li>
              <li>{`Localforage driver: ${env.localforage}`}</li>
              <li>{`Environment type: ${env.env}`}</li>
              <li>{`Compiled Filesystem: ${env.fstype}`}</li>
              <li>{`Compiled Bootmode: ${env.bootmode}`}</li>
              <li>{`Compiled for OLED: ${env.oled ? 'yes' : 'no'}`}</li>
            </ul>
          </Route>
          <Route path="/import">
            <h1 className="app__content-headline">Import</h1>
            <Import />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>

      <Overlays />
    </Router>
  );
};

App.propTypes = {
  imageCount: PropTypes.number.isRequired,
  selectedCount: PropTypes.number.isRequired,
  filteredCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
};

App.defaultProps = {
};

export default App;
