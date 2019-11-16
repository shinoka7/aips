import React from 'react';
import PropTypes from 'prop-types';

import { Button, Badge, Jumbotron, Spinner, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

class GroupDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isVerified: false,
            activeTab: '1',
        };

        // this.toggleVerifyPanel = this.toggleVerifyPanel.bind(this);
    }

    static async getInitialProps(context) {
        return context.query || {};
    }

    // toggleVerifyPanel() {
        
    // }

    render() {
        const { group, user } = this.props;
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
                    <Spinner style={{ width: '3rem', height: '3rem' }} />

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
};

export default GroupDetail;