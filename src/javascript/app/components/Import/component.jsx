import React from 'react';
import PropTypes from 'prop-types';

class Import extends React.Component {

  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
    this.state = {
      text: '',
    };
  }

  componentDidMount() {
    import(/* webpackChunkName: "dmy" */ './dummy')
      .then(({ default: dummyContent }) => {
        this.setState({
          text: dummyContent.join('\n'),
        });
      });
  }

  render() {
    return (
      <div className="import">
        <div className="import__inputgroup">
          <label htmlFor="import-file" className="import__label">
            Select file for import
          </label>
          <input
            id="import-file"
            className="import__input"
            type="file"
            onChange={({ target }) => {
              if (target.files && target.files.length === 1) {
                this.props.importFile(target);
              }
            }}
            ref={this.fileInputRef}
          />
          <label
            htmlFor="import-file"
            className="import__button import__button--label"
          >
            Select
          </label>
        </div>
        <div className="import__inputgroup import__inputgroup--column">
          <label htmlFor="import-plaintext" className="import__label">
            Paste your plaintext
          </label>
          <textarea
            id="import-plaintext"
            className="import__data"
            value={this.state.text}
            onChange={({ target }) => {
              this.setState({
                text: target.value,
              });
            }}
          />
          <button
            className="import__button"
            type="button"
            onClick={() => {
              this.props.importPlainText(this.state.text);
            }}
          >
            Import
          </button>
        </div>
      </div>
    );
  }
}

Import.propTypes = {
  importPlainText: PropTypes.func.isRequired,
  importFile: PropTypes.func.isRequired,
};

Import.defaultProps = {};

export default Import;
