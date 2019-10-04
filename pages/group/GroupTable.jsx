import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import axios from 'axios';

class GroupTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userGroups: [],
        }
    }

    componentWillMount() {
        init();
    }

    async init() {
        const userGroups = await axios.get(`/group/${this.props.user.id}`);
        if (!userGroups) {
            this.setState({ userGroups });
        }
    }

    generateUserGroups() {
        return userGroups.map(group => {
            <div>
                <Button className="btn btn-primary" data-toggle="dropdown">
                    
                </Button>
            </div>
        });
    }

    render() {
        const user = this.props.user;
        const username = user.username;
        const groups = generateUserGroups();

        return(
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Users</th>
                        <th width="160px">Created</th>
                        <th width="70px"></th>
                    </tr>
                </thead>
                <tbody>

                </tbody>
            </table>
        );
    }
}

GroupTable.Proptypes = {
    user: PropTypes.object,
}

export default GroupTable;