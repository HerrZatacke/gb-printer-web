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
        <strike>Add lightbox to gallery. (Fullscreen mode?)</strike>
        <br />
        Arrows/Enter/Esc work... Mouse navigation not yet implemented
      </li>
      <li>
        Add some sort of pagination to increase performance
      </li>
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
