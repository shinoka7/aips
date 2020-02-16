import React from 'react';
import PropTypes from 'prop-types';

import { Jumbotron, Button } from 'reactstrap';

import UserProfile from '../../src/client/components/user/UserProfile';
import GroupList from '../../src/client/components/group/GroupList';

class UserDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.isGoogleCalendarAvailable = this.isGoogleCalendarAvailable.bind(this);
    }
    
    static async getInitialProps(context) {
        return context.query || {};
    }

    isGoogleCalendarAvailable() {
        return !!this.props.googleCalendar.events
    }

    render() {
        const { user, notifications, csrfToken, googleCalendar } = this.props;

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
};

export default UserDetail;