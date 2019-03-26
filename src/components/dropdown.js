import React, { Component } from 'react';
import './app.scss';
import PropTypes from 'prop-types';

/**
 * @name buttonize
 * @description Buttonizes a non-interactive element
 * @param {*} action
 * @returns element properties
 */
function buttonize(action) {
  return {
    role: 'button',
    onClick: action,
    onKeyDown: (event) => {
      // handle on enter
      if (event.keycode === 13) {
        action(event);
      }
    },
  };
}

class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false,
      list: props.list,
      renderList: [],
      selected: [],
      display: props.display,
      searchValue: '',
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleSelectAll = this.toggleSelectAll.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.areAllSelected = this.areAllSelected.bind(this);
    this.clearSelection = this.clearSelection.bind(this);
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillReceiveProps(nextProps) {
    const { list, selected, display } = nextProps;

    this.setState({ list, selected, display });
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
  }

  handleInput(e) {
    try {
      const { list } = this.state;
      const { value } = e.target;
      const key = e.target.name;

      const renderList = list.filter(
        curr => new RegExp(value.toLowerCase()).test(curr.display.toLowerCase()),
      );

      this.setState({ [key]: value, renderList, selected: [] });
    } catch (err) {
      // Do nothing
    }
  }

  handleClick(e) {
    if (typeof this === 'undefined' && this.dropdown.contains(e.target)) {
      return null;
    }

    if (!this.dropdown.contains(e.target)) {
      this.setState({ showDropdown: false });
    }
    return null;
  }

  selectItem(value) {
    const { selected } = this.state;
    const index = selected.indexOf(value);

    if (index === -1) {
      selected.push(value);
    } else {
      selected.splice(index, 1);
    }

    this.setState({ selected });
  }

  areAllSelected() {
    const {
      searchValue, renderList, list, selected,
    } = this.state;

    return selected.length === (searchValue.length > 0 ? renderList.length : list.length);
  }

  clearSelection() {
    this.setState({ selected: [], searchValue: '' });
  }

  toggleSelectAll() {
    const { renderList, list } = this.state;
    let { selected } = this.state;

    if (selected.length === (renderList.length > 0 ? renderList.length : list.length)) {
      selected = [];
    } else {
      selected = (renderList.length > 0 ? renderList : list).map(curr => curr.value);
    }

    this.setState({ selected });
  }

  toggleDropdown() {
    const { showDropdown } = this.state;
    this.setState({ showDropdown: !showDropdown });
  }

  renderDisplay() {
    const { selected, list, display } = this.state;

    if (selected.length === 0) {
      return `Select ${display}`;
    }

    if (selected.length === list.length) {
      return 'All selected';
    }
    return `${selected.length} ${display} selected`;
  }

  renderList() {
    const {
      list, selected, searchValue,
    } = this.state;

    let { renderList } = this.state;

    if (searchValue.length > 0) {
      renderList = list.filter(
        curr => new RegExp(searchValue.toLowerCase()).test(curr.display.toLowerCase()),
      );
    } else {
      renderList = list;
    }

    return renderList.map((item, index) => (
      <li
        key={`#${(`00${index}`).slice(-3)}-${Math.ceil(Math.random() * 99999)}`}
      >
        <input
          type="checkbox"
          onChange={() => this.selectItem(item.value)}
          checked={selected.indexOf(item.value) !== -1}
        />
        <span>{ item.display || item.value }</span>
      </li>
    ));
  }

  renderDropdown() {
    const {
      showDropdown, searchValue,
    } = this.state;

    if (showDropdown) {
      return (
        <div className="rsd-dropdown">
          <input
            type="text"
            value={searchValue}
            onChange={this.handleInput}
            name="searchValue"
          />
          <p className="rsd-clear" {...buttonize(this.clearSelection)}>Clear</p>
          <ul className="list">
            <li {...buttonize(this.toggleSelectAll)}>
              <input
                type="checkbox"
                onChange={this.toggleSelectAll}
                checked={this.areAllSelected()}
              />
              <span>Select all</span>
            </li>
            { this.renderList() }
          </ul>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="rsd-container" ref={(dropdown) => { this.dropdown = dropdown; }}>
        <div className="rsd-display" {...buttonize(this.toggleDropdown)}>
          <span className="rsd-value">{ this.renderDisplay() }</span>
          <div className="rsd-icon">V</div>
        </div>
        { this.renderDropdown() }
      </div>
    );
  }
}

Dropdown.propTypes = {
  showDropdown: PropTypes.bool,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.arrayOf(PropTypes.number),
  display: PropTypes.string.isRequired,
};

Dropdown.defaultProps = {
  showDropdown: false,
  selected: [],
};

export default Dropdown;
