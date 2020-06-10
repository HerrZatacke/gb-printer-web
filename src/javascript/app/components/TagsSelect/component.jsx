import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import SVG from '../SVG';
import uniqe from '../../../tools/unique';

class TagsSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newTag: '',
    };
  }

  addNewTag(tag) {
    if (!tag) {
      return;
    }

    this.props.updateTags('add', tag);
    this.setState({
      newTag: '',
    });
  }

  render() {

    const tags = uniqe([...this.props.tags.initial, ...this.props.tags.add]);

    return (
      <ul className="tags-select">
        {
          tags.map((tag) => (
            <li
              className={
                classnames('tags-select__tag', {
                  'tags-select__tag--add': this.props.tags.add.includes(tag),
                  'tags-select__tag--remove': this.props.tags.remove.includes(tag),
                })
              }
              key={tag}
            >
              <button
                type="button"
                className="tags-select__button tags-select__button--add"
                onClick={() => this.props.updateTags('add', tag)}
              >
                <SVG name="add" />
              </button>
              <button
                type="button"
                className="tags-select__button tags-select__button--remove"
                onClick={() => this.props.updateTags('remove', tag)}
              >
                <SVG name="remove" />
              </button>
              <span
                className="tags-select__tag-name"
              >
                {tag}
              </span>
            </li>
          ))
        }
        <li
          className="tags-select__tag tags-select__tag--input"
        >
          <input
            type="text"
            className="tags-select__tag-name"
            onChange={({ target }) => {
              this.setState({
                newTag: target.value,
              });
            }}
            onBlur={({ target }) => {
              this.addNewTag(target.value);
            }}
            onKeyUp={(ev) => {
              switch (ev.key) {
                case 'Enter':
                  this.addNewTag(ev.target.value);
                  break;
                default:
                  break;
              }
            }}
            value={this.state.newTag}
          />
        </li>
      </ul>
    );
  }
}

TagsSelect.propTypes = {
  tags: PropTypes.shape({
    initial: PropTypes.array.isRequired,
    add: PropTypes.array.isRequired,
    remove: PropTypes.array.isRequired,
  }).isRequired,
  updateTags: PropTypes.func.isRequired,
};

TagsSelect.defaultProps = {};

export default TagsSelect;
