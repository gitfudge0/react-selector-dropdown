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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDropdown: false,
      list: [
        {
          display: 'Option 1',
          value: 1,
        },
        {
          display: 'Option 2',
          value: 2,
        },
      ],
      selected: [],
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleSelectAll = this.toggleSelectAll.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick);
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

    console.log({ selected });

    this.setState({ selected });
  }

  toggleSelectAll() {
    const { list } = this.state;
    let { selected } = this.state;

    if (selected.length === list.length || selected.length > 0) {
      selected = [];
    } else if (selected.length === 0) {
      selected = list.map(curr => curr.value);
    }
    console.log({ selected });

    this.setState({ selected });
  }

  toggleDropdown() {
    const { showDropdown } = this.state;
    this.setState({ showDropdown: !showDropdown });
  }

  renderList() {
    const { list, selected } = this.state;

    return list.map((item, index) => {
      const { value } = item;
      console.log({ value, selected, isS: selected.indexOf(value) !== -1 });
      return (
        <li
          key={`#${(`00${index}`).slice(-3)}-${Math.ceil(Math.random() * 99999)}`}
        >
          <input
            type="checkbox"
            onClick={() => this.selectItem(item.value)}
            checked={selected.indexOf(item.value) !== -1}
          />
          <span>{ item.display || item.value }</span>
        </li>
      );
    });
  }

  renderDropdown() {
    const { showDropdown, selected, list } = this.state;

    if (showDropdown) {
      return (
        <div className="rsd-dropdown">
          <ul className="list">
            <li {...buttonize(this.toggleSelectAll)}>
              <input
                type="checkbox"
                onClick={this.toggleSelectAll}
                selected={selected.length === list.length}
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
        <div className="display" {...buttonize(this.toggleDropdown)}>
          <span className="value">2 Groups</span>
          <div className="icon">V</div>
        </div>
        { this.renderDropdown() }
      </div>
    );
  }
}

App.propTypes = {
  showDropdown: PropTypes.bool,
  list: PropTypes.arrayOf(PropTypes.object),
  selected: PropTypes.arrayOf(PropTypes.number),
};

App.defaultProps = {
  showDropdown: false,
  list: [],
  selected: [],
};

export default App;
