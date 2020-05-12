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
  </div>
);

Home.propTypes = {};

Home.defaultProps = {};

export default Home;
