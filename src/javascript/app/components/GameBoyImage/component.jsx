import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Decoder from '../../../tools/Decoder';

class GameBoyImage extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = createRef();
    this.decoder = new Decoder();
  }

  componentDidUpdate() {
    this.decoder.setCanvas(this.canvasRef.current);
    const newestLine = this.props.tiles[this.props.tiles.length - 1];

    if (!newestLine) {
      this.decoder.clear();
      return;
    }

    this.decoder.line(newestLine);
  }

  render() {
    return (
      <div className="gameboy-image">
        <canvas width={160} ref={this.canvasRef} />
      </div>
    );
  }
}

GameBoyImage.propTypes = {
  tiles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

GameBoyImage.defaultProps = {
};

export default GameBoyImage;
