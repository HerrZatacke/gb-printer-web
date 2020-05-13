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
        Selection scale factor 1x2x3x4x...
        <br />
        Save images in different resolutions / imagetypes
        <br />
        Multiple scales for download in zip
        <br />
        Download per image or select checkbox for images in a zip
        <br />
        Export without frame / with different frame
        <br />
        Select multiple palettes to download the gallery in.
      </li>
      <li>
        Edit images: color palette (with quick preview ) / title
        <br />
        lightbox zoom option in gallery
      </li>
      <li>
        Upload hex as file
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
      <li>
        Allow rendering rgb images with/without 4th contrast image
      </li>
    </ul>
  </div>
);

Home.propTypes = {};

Home.defaultProps = {};

export default Home;
