import React from 'react';
import PropTypes from 'prop-types';

import { Alert, Form, CustomInput, Table } from 'reactstrap';
import Switch from "react-switch";
import axios from 'axios';

class GroupList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSuccessAlert: false,
            showFailureAlert: false,
        };

        this.togglePostSwitch = this.togglePostSwitch.bind(this);
        this.toggleEventSwitch = this.toggleEventSwitch.bind(this);
    };

    async togglePostSwitch(checked, _, id) {
        try {
            const res = await axios.put('/user/update/notifications', {
                notifyPosts: checked,
                notificationId: id,
                _csrf: this.props.csrfToken,
            });
            this.setState({ showFailureAlert: false, showSuccessAlert: true });
        }
        catch(err) {
            this.setState({ showSuccessAlert: false, showFailureAlert: true });
        }
    }

    async toggleEventSwitch(checked, _, id) {
        try {
            const res = await axios.put('/user/update/notifications', {
                notifyEvents: checked,
                notificationId: id,
                _csrf: this.props.csrfToken,
            });
            this.setState({ showFailureAlert: false, showSuccessAlert: true });
        }
        catch(err) {
            this.setState({ showSuccessAlert: false, showFailureAlert: true });
        }
    }

    render() {
        const { notifications } = this.props;

        const groupList = notifications.map((notification) => {

            return (
                <tr key={notification.Group.id}>
                    <th scope="row">{notification.Group.id}</th>
                    <td><a href={`/group/${notification.Group.id}`}>{notification.Group.name}</a></td>
                    <td>{notification.Group.groupEmail}</td>
                    <td>
                        {/* onClick, button ui state doesn't change, but internally does */}
                        {/* https://github.com/markusenglund/react-switch/issues/47 */}
                        <Switch
                            checked={notification.notifyPosts}
                            onChange={this.togglePostSwitch}
                            id={notification.id.toString()}
                        />
                    </td>
                    <td>
                        <Switch
                            checked={notification.notifyEvents}
                            onChange={this.toggleEventSwitch}
                            id={notification.id.toString()}
                        />
                    </td>
                </tr>
            );
        });
        
        return (
            <div className="pl-4 pr-4 fixed-bottom pb-5">
                { this.state.showSuccessAlert &&
                    <Alert color="success">
                    User settings updated!
                    </Alert>
                }
                { this.state.showFailureAlert &&
                    <Alert color="danger">
                    User settings update failed :(
                    </Alert>
                }
                <Table striped dark bordered>
                    <thead>
                        <tr>
                            <th>Group (id)</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Post Notifications</th>
                            <th>Event Notifications</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupList}
                    </tbody>
                </Table>
            </div>
        );
    }
}

GroupList.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.object),
    csrfToken: PropTypes.string.isRequired,
};

export default GroupList;