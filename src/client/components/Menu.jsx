import React from 'react';
import PropTypes from 'prop-types';

import { Collapse, Button, ButtonGroup } from 'reactstrap';

import CalendarPanel from './CalendarPanel.jsx';
import PostForm from './PostForm';
// https://github.com/mdbootstrap/React-Bootstrap-with-Material-Design/issues/28
// SSR NOT SUPPORTED

class Menu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            postIsOpen: false,
            calendarIsOpen: false,
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.togglePostForm = this.togglePostForm.bind(this);
        this.toggleCalendar = this.toggleCalendar.bind(this);
    }

    toggleMenu() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    togglePostForm() {
        this.setState({ postIsOpen: !this.state.postIsOpen });
    }
    
    toggleCalendar() {
        this.setState({ calendarIsOpen: !this.state.calendarIsOpen });
    }

    render() {
        const { isOpen, postIsOpen, calendarIsOpen } = this.state;
        const { events, groups, csrfToken, images } = this.props;

        return (
            <div className="d-flex flex-row-reverse pr-2 fixed-bottom pb-5">
                <Button color="primary" className="btn btn-lg btn-outline-danger" onClick={this.toggleMenu}>
                    <i className="fas fa-plus" />
                </Button>
                <Collapse isOpen={isOpen}>
                    <ButtonGroup vertical className="pr-2">
                        <Button onClick={this.togglePostForm} className="btn btn-lg" color="danger" outline>
                            <i className="fas fa-edit"></i>
                        </Button>
                        <Button onClick={this.toggleCalendar} className="btn btn-lg" color="danger" outline>
                            <i className="fas fa-calendar-alt" />
                        </Button>
                    </ButtonGroup>
                </Collapse>
                <CalendarPanel toggleCalendar={this.toggleCalendar} events={events} groups={groups} csrfToken={csrfToken} modal={calendarIsOpen} images={images} />
                <PostForm togglePostForm={this.togglePostForm} groups={groups} csrfToken={this.props.csrfToken} modal={postIsOpen} />
            </div>
        );
    }
}

Menu.propTypes = {
    csrfToken: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Menu;