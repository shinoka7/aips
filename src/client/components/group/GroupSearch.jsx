import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, InputGroupAddon, 
    Input, Button, Col, Row} from 'reactstrap';

/* Search bar component on 'groups' page
allows user to find groups based on a substring. */
class GroupSearch extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
           value: ""
        };

        this.handleChange = this.handleChange.bind(this);
    };
    setString(searchString)
    {
        const {categoryID} = this.props;
        this.props.filter(categoryID, searchString);
    }
    handleChange(e)
    {
        if (e.target.value == "")
            this.setString("");
        this.setState({value: e.target.value});
    }

    render() {
        return (
            <Row>
                <Col>
                    <InputGroup>
                        <Input
                            id = "searchBar" 
                            placeholder = {"Search for groups!"} 
                            onChange={this.handleChange}    
                                />
                        <InputGroupAddon addonType="append">
                            <Button 
                            disabled = {!this.state.value}
                            onClick= {() => 
                                {this.setString(document.getElementById("searchBar").value);}}
                            color = "default">Search</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Col>
            </Row>
        );
    }     
};

GroupSearch.propTypes = {
    categoryID: PropTypes.object.isRequired,
    filter: PropTypes.func.isRequired,
};

export default GroupSearch;
