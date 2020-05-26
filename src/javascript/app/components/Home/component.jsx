import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div className="home">
    <ol>
      <li>
        <Link to="/palettes">
          First choose a color palette
        </Link>
      </li>
      <li>
        <Link to="/dump">
          Then paste your exports into a textfield
        </Link>
        {' '}
        (or simply drag and drop your dump(s) into this window)
      </li>
      <li>
        You can also try to drag/drop your cartridge dump into this window.
        <br />
        This should work - if it does not, please
        {' '}
        <a href="https://github.com/HerrZatacke/gb-printer-web/issues">open an issue and attach your file.</a>
      </li>
      <li>
        <Link to="/gallery">
          And check your images in the gallery
        </Link>
      </li>
    </ol>
    <p>
      {/* eslint-disable-next-line max-len */}
      There are some ui rendering/blocking issues in the gallery, especially if there are a lot of images present already.
    </p>
    <a href="https://github.com/HerrZatacke/gb-printer-web">
      This project on GitHub
    </a>
    <h3>ToDo:</h3>
    <ul>
      <li>
        Add filters/tags
      </li>
      <li>
        Export without frame / with different frame
      </li>
      <li>
        Select multiple palettes to download the gallery in.
        (add checkbox to images, maybe allow download from galleries-page)
      </li>
      <li>
        allow some gesture navigation on touch devices
      </li>
      <li>
        Edit palettes
      </li>
      <li>
        Export settings data
      </li>
      <li>
        Allow rendering animated Gifs
      </li>
    </ul>
  </div>
);

Home.propTypes = {};

Home.defaultProps = {};

export default Home;
