import React from 'react';
import PropTypes from 'prop-types';

import UserForm from './UserForm';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { csrfToken, user } = this.props;
        
        return (
            <UserForm user={user} csrfToken={csrfToken}/>
        );
    }
}

UserProfile.propTypes = {
    user: PropTypes.object.isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default UserProfile;