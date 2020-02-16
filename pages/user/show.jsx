import React from 'react';
import PropTypes from 'prop-types';

import { Jumbotron, Button, ButtonGroup, Tooltip } from 'reactstrap';

import UserProfile from '../../src/client/components/user/UserProfile';
import GroupList from '../../src/client/components/group/GroupList';
import CalendarPanel from '../../src/client/components/CalendarPanel.jsx';

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
        return !!this.props.googleCalendar.events
	}

    toggleCalendar() {
        this.setState({ calendarIsOpen: !this.state.calendarIsOpen });
    }

    render() {
        const { user, notifications, csrfToken, events, groups, images, googleCalendar } = this.props;
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
                    <form action="/auth/google" method="GET">
                        <Button disabled={this.isGoogleCalendarAvailable()} block className="btn btn-primary"><i className="fab fa-google"></i> Connect Google Calendars</Button>
                    </form>
                    <hr />
                    <ButtonGroup className="text-right">
                        <Button onClick={this.toggleCalendar} className="btn btn-info" id="calendarToolTip">
                            <i className="fas fa-calendar-alt"> Events</i>
                        </Button>
                    </ButtonGroup>
                    <Tooltip placement="auto" isOpen={calendarToolTipOpen} target="calendarToolTip" toggle={() => {this.setState({ calendarToolTipOpen: !calendarToolTipOpen })}}>
                        Individual Calendar
                    </Tooltip>
                    <CalendarPanel toggleCalendar={this.toggleCalendar} events={events} isUserInGroup={true} groups={groups} csrfToken={csrfToken} user={user} googleCalendar={googleCalendar}  modal={calendarIsOpen} images={images} />
                    <GroupList notifications={notifications} csrfToken={csrfToken} />
                </Jumbotron>
            </div>
        );
    }
}

UserDetail.propTypes = {
    user: PropTypes.object.isRequired,
    notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
    googleCalendar: PropTypes.object.isRequired,
    csrfToken: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UserDetail;