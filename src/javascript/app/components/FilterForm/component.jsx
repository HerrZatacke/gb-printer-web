import React from 'react';
import PropTypes from 'prop-types';
import uniqe from '../../../tools/unique';
import Lightbox from '../Lightbox';
import FilterFormTag from './filterFormTag';
import { FILTER_NEW, FILTER_UNTAGGED, FILTER_MONOCHROME, FILTER_RGB } from '../../../consts/specialTags';

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
          <FilterFormTag
            title="Untagged"
            tagActive={this.state.activeTags.includes(FILTER_UNTAGGED)}
            toggleTag={(active) => this.updateActiveTags(FILTER_UNTAGGED, active)}
          />
          <FilterFormTag
            title="New"
            tagActive={this.state.activeTags.includes(FILTER_NEW)}
            toggleTag={(active) => this.updateActiveTags(FILTER_NEW, active)}
          />
          <FilterFormTag
            title="Monochrome"
            tagActive={this.state.activeTags.includes(FILTER_MONOCHROME)}
            toggleTag={(active) => this.updateActiveTags(FILTER_MONOCHROME, active)}
          />
          <FilterFormTag
            title="RGB"
            tagActive={this.state.activeTags.includes(FILTER_RGB)}
            toggleTag={(active) => this.updateActiveTags(FILTER_RGB, active)}
          />
        </ul>
        <ul
          className="filter-form__tag-list"
        >
          {this.props.availableTags.map((tag) => (
            <FilterFormTag
              key={tag}
              title={tag}
              tagActive={this.state.activeTags.includes(tag)}
              toggleTag={(active) => this.updateActiveTags(tag, active)}
            />
          ))}
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
