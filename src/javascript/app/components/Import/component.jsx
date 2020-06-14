import React from 'react';
import PropTypes from 'prop-types';
import PrinterReport from '../PrinterReport';

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
        <div className="import__inputgroup import__buttongroup">
          <button
            type="button"
            className="import__button import__button"
            onClick={this.props.checkPrinter}
          >
            Check Printer
          </button>
          <button
            type="button"
            className="import__button import__button"
            disabled={this.props.dumpCount === 0}
            onClick={this.props.downloadPrinter}
          >
            {`Download ${this.props.dumpCount ? this.props.dumpCount : ''} Dumps`}
          </button>
          <button
            type="button"
            className="import__button import__button"
            disabled={this.props.dumpCount === 0}
            onClick={this.props.clearPrinter}
          >
            Clear Printer
          </button>
        </div>
        <PrinterReport />
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
  dumpCount: PropTypes.number.isRequired,
  importPlainText: PropTypes.func.isRequired,
  importFile: PropTypes.func.isRequired,
  checkPrinter: PropTypes.func.isRequired,
  downloadPrinter: PropTypes.func.isRequired,
  clearPrinter: PropTypes.func.isRequired,
};

Import.defaultProps = {};

export default Import;
