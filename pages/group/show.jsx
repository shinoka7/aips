import React from 'react';
import PropTypes from 'prop-types';

import { Button, Badge, Jumbotron, Spinner, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';

class GroupDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isVerified: false,
            activeTab: '1',
        };

        // this.toggleVerifyPanel = this.toggleVerifyPanel.bind(this);
        this.joinGroupHandler = this.joinGroupHandler.bind(this);
    }

    static async getInitialProps(context) {
        return context.query || {};
    }

    // toggleVerifyPanel() {
        
    // }

    async joinGroupHandler() {
        const { user, group, csrfToken } = this.props;
        const res = await axios.post('/group/addUser', {
            user,
            group,
            _csrf: csrfToken,
        });
    }

    render() {
        const { group, user, isUserInGroup } = this.props;
        const { isVerified, activeTab } = this.state;

        return (
            <div>
                <Jumbotron>
                    <h2 className="display-3">{group.name}</h2>
                    { isVerified &&
                        <Badge /**onClick={this.toggleVerifyPanel}*/ color="success" pill>Verified</Badge>
                    }
                    { !isVerified &&
                            <Badge /**onClick={this.toggleVerifyPanel}*/ color="warning" pill>Pending</Badge>
                    }
                    <hr />
                    <Button onClick={this.joinGroupHandler} color="success" disabled={isUserInGroup}>
                        <i className="fas fa-user-plus"> Join</i>
                    </Button>

                </Jumbotron>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '1'})}
                        >
                            
                        </NavLink>
                    </NavItem>
                </Nav>
                {/* INNER FRAME KILLS SESSION? https://www.webdeveloper.com/d/187843-iframe-is-killing-my-session-data */}
                {/* https://stackoverflow.com/questions/917500/how-can-i-persist-a-session-in-an-iframe */}
                {/* <iframe width="100%" height="500" src="http://localhost:3010/" frameborder="0"></iframe> */}
            </div>
        )
    }
}

GroupDetail.propTypes = {
    user: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    isUserInGroup: PropTypes.bool.isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default GroupDetail;