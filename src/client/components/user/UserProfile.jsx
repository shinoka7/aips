import React from 'react';
import PropTypes from 'prop-types';

import { CardBody, Card, CardText } from 'reactstrap';

import UserForm from './UserForm';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.generateUserInfo = this.generateUserInfo.bind(this);
    }

    generateUserInfo() {
        const { user } = this.props;
        
        return (
            <Card>
                <CardBody>
                <CardText>
                    Username : {user.username}<br />
                    First name : {user.firstName}<br />
                    Last name : {user.lastName}<br />
                </CardText>
                <CardText className="text-right">
                    <UserForm user={user} />
                </CardText>
                </CardBody>

            </Card>
        );
    }

    render() {
        const { user } = this.props;

        const userInfo = this.generateUserInfo();
        
        return (
            <div>
                {userInfo}
            </div>
        );
    }
}

UserProfile.propTypes = {
    user: PropTypes.object.isRequired,
};

export default UserProfile;