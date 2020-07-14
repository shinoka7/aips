import React from 'react';
import PropTypes from 'prop-types';

import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

/* This component manages and renders the category
filter dropdown on the groups 'show' page. */
class FilterPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reset: false, 
            isOpen: false,
            category: "Category",
        };

        this.setCategory = this.setCategory.bind(this);
        this.generateCategories = this.generateCategories.bind(this);
    };

    /* If a new category is selected, the groups shown will be 
    filtered by this category using the init function in 
    the groups show page. */
    setCategory(id) {
        this.props.filter(id, "");
    }

    /* This function generates a dropdown item for each category. */
    generateCategories(categories) {
        return categories.map((category) => {
            return (
                <DropdownItem
                    key={category.id}
                    onClick={() => {this.setCategory(category.id); this.setState({ category: category.name});}}
                    value={category.id}
                >
                    {category.name}
                </DropdownItem>
            );
        });
    }

    /* If the reset button has been pressed,
    the dropdown is reset to its initial state. */
    static getDerivedStateFromProps(props, state) {
        if (props.reset !== state.reset) {
            return {isOpen: false, 
                category: "Category",
                reset: props.reset};
        }
        return null;
    }

    render() {
        const { isOpen, category } = this.state;
        const { categories } = this.props;

        const generatedItems = this.generateCategories(categories);

        return (
                <Dropdown isOpen={isOpen} toggle={() => this.setState({ isOpen: !isOpen })}>
                    <DropdownToggle caret color="primary">
                        {category}
                    </DropdownToggle>
                    <DropdownMenu
                        modifiers={{
                        setMaxHeight: {
                            enabled: true,
                            order: 890,
                            fn: (data) => {
                            return {
                                ...data,
                                styles: {
                                ...data.styles,
                                overflow: 'auto',
                                maxHeight: '600px',
                                },
                            };
                            },
                        },
                        }}>
                        <DropdownItem
                            key={0}
                            onClick={() => {this.setCategory(0); this.setState({ category: "All"});}}
                            value={0}
                        >
                            All
                        </DropdownItem>
                        {generatedItems}
                    </DropdownMenu>
                </Dropdown>
        );
    }

};

FilterPanel.propTypes = {
    reset: PropTypes.bool.isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    filter: PropTypes.func.isRequired,
};

export default FilterPanel;