import React from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Row} from 'reactstrap';

/* Reset button component on 'groups' page
allows user to reset the page to its 
default state, showing all groups. */
class ResetButton extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
           active: false
        };

        this.resetPage = this.resetPage.bind(this);
    };

    /* The reset button is active only if the category
    or search bar string have been modified. */
    static getDerivedStateFromProps(props) {
        if (props.categoryID !== 0 || 
            (props.searchString !== "" 
            && props.searchString)) {
                return {active: true};
        }
        return {active: false};
    }

    /* Calls a function in show.jsx to reset
    the FilterPanel and GroupSearch components. */
    resetPage()
    {
        this.props.reset();
    }

    render() {
        const {active} = this.state;
        return (
            <Row>
                <Col>
                    {  active &&
                        <Button 
                            type="button"
                            color="danger"
                            onClick={this.resetPage}>
                            <i className="fas fa-undo-alt"></i> Reset
                        </Button>
                    }
                </Col>
            </Row>
        );
    }     
};

ResetButton.propTypes = {
    categoryID: PropTypes.number.isRequired,
    searchString: PropTypes.string,
    reset: PropTypes.func.isRequired
};

export default ResetButton;
