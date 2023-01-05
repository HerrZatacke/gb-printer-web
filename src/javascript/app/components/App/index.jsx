import React from 'react';
import { useSelector } from 'react-redux';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Navigation from '../Navigation';
import Home from '../Home';
import Gallery from '../Gallery';
import Import from '../Import';
import Palettes from '../Palettes';
import Frames from '../Frames';
import Settings from '../Settings';
import Overlays from '../Overlays';
import WebUSBGreeting from '../WebUSBGreeting';
import GalleryIntroText from './galleryIntroText';
import getValidPageIndex from '../../../tools/getValidPageIndex';
import { getEnv } from '../../../tools/getEnv';
import getFilteredImagesCount from '../../../tools/getFilteredImages/count';
import './index.scss';

const App = () => {
  const env = getEnv();

  const {
    imageCount,
    selectedCount,
    filteredCount,
    pageSize,
  } = useSelector((state) => ({
    imageCount: state.images.length,
    pageSize: state.pageSize,
    selectedCount: state.imageSelection.length,
    filteredCount: getFilteredImagesCount(state),
  }));

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
                pageSize,
                imageCount: filteredCount,
              });

              return valid ? (
                <>
                  <GalleryIntroText
                    imageCount={imageCount}
                    selectedCount={selectedCount}
                    filteredCount={filteredCount}
                  />
                  <Gallery page={page} />
                </>
              ) : (
                <Redirect to={`/gallery/page/${page + 1}`} />
              );
            }}
          />
          <Route path="/frames">
            <h1 className="app__content-headline">Frames</h1>
            <Frames />
          </Route>
          <Route path="/palettes">
            <h1 className="app__content-headline">Palettes</h1>
            <Palettes />
          </Route>
          <Route exact path="/settings">
            <Redirect to="/settings/generic" />
          </Route>
          <Route
            path="/settings/:tabName"
            render={({ match: { params: { tabName } } }) => (
              <>
                <h1 className="app__content-headline">Settings</h1>
                <Settings tabName={tabName} />
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
              </>
            )}
          />
          <Route path="/import">
            <h1 className="app__content-headline">Import</h1>
            <Import />
          </Route>
          <Route path="/webusb">
            <WebUSBGreeting />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/">
            <Redirect to="/gallery/page/1" />
          </Route>
        </Switch>
      </div>
      <Overlays />
    </Router>
  );
};

export default App;
