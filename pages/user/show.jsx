import React from 'react';
import PropTypes from 'prop-types';

import { Jumbotron } from 'reactstrap';

import UserProfile from '../../src/client/components/user/UserProfile';
import GroupList from '../../src/client/components/group/GroupList';

class UserDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        }
    }
    
    static async getInitialProps(context) {
        return context.query || {};
    }

    render() {
        const { user, notifications, csrfToken } = this.props;

        return (
            <div>
                <Jumbotron>
                    <UserProfile user={user} csrfToken={csrfToken} />
                    {/* <Button onClick={this.toggleUserProfile}> */}
                        {/* <i fa fab-arrowup></i>Show Profile */}
                        {/* Show Profile */}
                        {/* TODO make cool arrow button && transition Dropdown? */}
                    {/* </Button> */}
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
    csrfToken: PropTypes.string.isRequired,
};

export default UserDetail;