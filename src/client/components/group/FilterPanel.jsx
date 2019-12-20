import React from 'react';
import PropTypes from 'prop-types';

import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class FilterPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
        };

        this.generateCategories = this.generateCategories.bind(this);
    };

    generateCategories(categories) {
        return categories.map((category) => {
            return (
                <DropdownItem onClick={this.props.filter(category.id)}>{category.name}</DropdownItem>
            );
        });
    }

    render() {
        const { isOpen } = this.state;
        const { categories } = this.props;

        const generatedItems = this.generateCategories(categories);

        return (
            <ButtonDropdown isOpen={isOpen} toggle={() => this.setState({ isOpen: !isOpen })}>
            <DropdownToggle caret color="primary">
                Category
            </DropdownToggle>
            <DropdownMenu>
                {generatedItems}
            </DropdownMenu>
            </ButtonDropdown>
        );
    }

};

FilterPanel.PropTypes = {
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    filter: PropTypes.func.isRequired,
};

export default FilterPanel;