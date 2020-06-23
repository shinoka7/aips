import React from 'react';
import PropTypes from 'prop-types';

import { Jumbotron, Button, ButtonGroup, Tooltip, Row, Col } from 'reactstrap';

import UserProfile from '../../src/client/components/user/UserProfile';
import GroupList from '../../src/client/components/group/GroupList';
import CalendarPanel from '../../src/client/components/CalendarPanel.jsx';

/* This component renders the user profile page of the AIPS web application,
which includes a profile panel containing user information such as username, 
first name, and last name, buttons to toggle a user's calendars, and a
panel containing a list of groups and notification settings. */
class UserDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            calendarIsOpen: false,
            calendarToolTipOpen: false,
        }

        this.isGoogleCalendarAvailable = this.isGoogleCalendarAvailable.bind(this);
		this.toggleCalendar = this.toggleCalendar.bind(this);
    }
    
    static async getInitialProps(context) {
        return context.query || {};
    }

    isGoogleCalendarAvailable() {
        return true;
        // MAKE THIS SO THAT IT SHOWS A CALENDAR INSTEAD
        // return !!this.props.googleCalendar.events
	}

    toggleCalendar() {
        this.setState({ calendarIsOpen: !this.state.calendarIsOpen });
    }

    render() {
        const { user, notifications, csrfToken, events, groups, images } = this.props;
        const { calendarIsOpen, calendarToolTipOpen } = this.state;

        return (
            <div>
                <Jumbotron>
                    <UserProfile user={user} csrfToken={csrfToken} />
                    {/* <Button onClick={this.toggleUserProfile}> */}
                        {/* <i fa fab-arrowup></i>Show Profile */}
                        {/* Show Profile */}
                        {/* TODO make cool arrow button && transition Dropdown? */}
                    {/* </Button> */}
                    <Row>
                        <Col xs="6" sm="6" md="6">
                            <Button onClick={this.toggleCalendar} className="dark_blue_button btn btn-info" id="calendarToolTip" block>
                                <i className="fas fa-calendar-alt"> Events</i>
                            </Button>
                        </Col>
                        <Col xs="6" sm="6" md="6">
                            {/* <form action="/auth/google" method="GET"> */}
                                <Button disabled={this.isGoogleCalendarAvailable()} block className="btn btn-primary"><i className="fab fa-google"></i> Connect Google Calendars</Button>
                            {/* </form> */}
                        </Col>
                    </Row>
                    <hr />
                    <Tooltip placement="auto" isOpen={calendarToolTipOpen} target="calendarToolTip" toggle={() => {this.setState({ calendarToolTipOpen: !calendarToolTipOpen })}}>
                        Individual Calendar
                    </Tooltip>
                    <CalendarPanel toggleCalendar={this.toggleCalendar} events={events} groups={groups} csrfToken={csrfToken} user={user}  modal={calendarIsOpen} images={images} />
                    <GroupList notifications={notifications} csrfToken={csrfToken} />
                </Jumbotron>
            </div>
        );
    }
}

UserDetail.propTypes = {
    user: PropTypes.object.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UserDetail;