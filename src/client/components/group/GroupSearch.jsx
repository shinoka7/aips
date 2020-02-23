import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup, InputGroupAddon, 
    Input, Button, Col, Row} from 'reactstrap';

/* Search bar component on 'groups' page
allows user to find groups based on a substring. */
class GroupSearch extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
           reset: false,
           value: "",
           categoryID: props.categoryID
        };

        this.handleChange = this.handleChange.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
    };

    /* When the search button is pressed, this function
    filters the groups through the 'show' page. */
    searchHandler()
    {
        const {value, categoryID} = this.state;
        this.props.filter(categoryID, value);
    }

    /* When the category is changed through the
    FilterPanel, or if the reset button has been
    pressed, revert search bar to empty state. */
    static getDerivedStateFromProps(props, state) {
        if (props.categoryID !== state.categoryID || props.reset !== state.reset) {
            document.getElementById("form").reset();
            document.getElementById("searchBar").value = "";
            return {value: "", 
                categoryID: props.categoryID,
                reset: props.reset};
        }
        return null;
    }

    handleChange(e)
    {
        this.setState({value: e.target.value});
    }


    render() {
        return (
            <Form id = "form">
                <InputGroup>
                    <Input
                        id = "searchBar" 
                        onKeyPress={e => {
                            if (e.key === 'Enter') e.preventDefault(); }}
                        placeholder = {"Search for groups!"} 
                        onChange={this.handleChange}
                            />
                    <InputGroupAddon addonType="append">
                        <Button 
                        disabled = {!this.state.value}
                        onClick= {this.searchHandler}
                        color = "default">Search</Button>
                    </InputGroupAddon>
                </InputGroup>
            </Form>
    );
    }     
};

GroupSearch.propTypes = {
    reset: PropTypes.bool.isRequired,
    categoryID: PropTypes.number.isRequired,
    filter: PropTypes.func.isRequired,
};

export default GroupSearch;
