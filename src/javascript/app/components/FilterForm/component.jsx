import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import uniqe from '../../../tools/unique';
import SVG from '../SVG';
import Lightbox from '../Lightbox';

class FilterForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTags: props.activeTags,
      availableTags: props.availableTags,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (JSON.stringify(state.availableTags) === JSON.stringify(props.availableTags)) {
      return state;
    }

    return {
      activeTags: props.activeTags,
      availableTags: props.availableTags,
    };
  }

  updateActiveTags(tag, mode) {
    this.setState((prevState) => ({
      activeTags: mode === 'add' ?
        uniqe([...prevState.activeTags, tag]) :
        prevState.activeTags.filter((t) => t !== tag),
    }));
  }

  render() {
    if (!this.props.visible) {
      return null;
    }

    return (
      <Lightbox
        className="filter-form"
        confirm={() => this.props.setActiveTags(this.state.activeTags)}
        deny={() => this.props.hideFilters()}
        header="Select Filters"
      >
        <ul
          className="filter-form__tag-list"
        >
          {this.props.availableTags.map((tag) => {
            const tagActive = this.state.activeTags.includes(tag);
            return (
              <li
                key={tag}
                title={tag}
                className={
                  classnames('filter-form__tag', {
                    'filter-form__tag--active': tagActive,
                  })
                }
              >
                <button
                  className="filter-form__tag-button"
                  type="button"
                  onClick={() => this.updateActiveTags(tag, tagActive ? 'remove' : 'add')}
                >
                  <SVG name="checkmark" />
                  <span className="filter-form__tag-text">{tag}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Lightbox>
    );
  }
}

FilterForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  availableTags: PropTypes.array.isRequired,
  activeTags: PropTypes.array.isRequired,
  setActiveTags: PropTypes.func.isRequired,
  hideFilters: PropTypes.func.isRequired,
};

FilterForm.defaultProps = {};

export default FilterForm;
