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
      There are some ui rendering/blocking issues in the gallery, especially if there are a lot of images present already.
    </p>
    <a href="https://github.com/HerrZatacke/gb-printer-web">
      This project on GitHub
    </a>
    <h3>ToDo:</h3>
    <ul>
      <li>
        Edit images
      </li>
      <li>
        Edit palettes
      </li>
      <li>
        Export data/single images
      </li>
      <li>
        Save images in different resolutions / imagetypes
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
