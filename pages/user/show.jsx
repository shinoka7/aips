import React from 'react';
import PropTypes from 'prop-types';

import UserProfile from '../../src/client/components/user/UserProfile';
import GroupList from '../../src/client/components/group/GroupList';

class UserDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showUserProfile: false,
        }

        this.toggleUserProfile = this.toggleUserProfile.bind(this);
    }
    
    static async getInitialProps(context) {
        return context.query || {};
    }

    toggleUserProfile() {
        this.setState({ showUserProfile: !this.state.showUserProfile });
    }

    render() {
        const { user, groups, csrfToken } = this.props;
        const { showUserProfile } = this.state;

        return (
            <div>
                <UserProfile user={user} csrfToken={csrfToken} />
                {/* <Button onClick={this.toggleUserProfile}> */}
                    {/* <i fa fab-arrowup></i>Show Profile */}
                    {/* Show Profile */}
                    {/* TODO make cool arrow button && transition Dropdown? */}
                {/* </Button> */}
                <GroupList groups={groups} />
            </div>
        );
    }
}

UserDetail.propTypes = {
    user: PropTypes.object.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default UserDetail;