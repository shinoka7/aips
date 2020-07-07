import React from 'react';
import PropTypes from 'prop-types';

import { Alert, Form, CustomInput, Table} from 'reactstrap';
import Switch from "react-switch";
import axios from 'axios';

/* This component manages and renders the list of groups 
displayed on the user 'show' page as well as the options
for toggling group event and post notifications. */
class GroupList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            showSuccessAlert: false,
            showFailureAlert: false,
        };

        this.togglePostSwitch = this.togglePostSwitch.bind(this);
        this.toggleEventSwitch = this.toggleEventSwitch.bind(this);
    };

    /* This function sends a request to update
    the current user's post notification settings 
    based on the state of the switch. */
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

    /* This function sends a request to update
    the current user's event notification settings 
    based on the state of the switch. */
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
        const { visible } = this.state;
        
        /* The list of groups to be displayed is generated as a list
        of table rows containing group information and switches
        to toggle notification settings for posts and events. */
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
                            aria-label = "Toggle post notifications"
                            checked={notification.notifyPosts}
                            onChange={this.togglePostSwitch}
                            id={notification.id.toString()}
                        />
                    </td>
                    <td>
                        <Switch
                            aria-label = "Toggle event notifications"
                            checked={notification.notifyEvents}
                            onChange={this.toggleEventSwitch}
                            id={notification.id.toString()}
                        />
                    </td>
                </tr>
            );
        });
        
        /* The table of groups generated above is rendered,
        along with a header and success/failure messages
        when toggling notifications. */
        return (
            <div>
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
                <Table striped dark>
                    <thead>
                        <tr>
                            <th>Groups</th>
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