import React from 'react';
import PropTypes from 'prop-types';

import UserForm from './UserForm';

/* This component manages and renders the user profile
panel in the user 'show' page, containing the UserForm,
which displays a user's username, first name, and last name,
and has a form for changing user details. */
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