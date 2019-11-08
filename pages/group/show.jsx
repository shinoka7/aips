import React from 'react';
import PropTypes from 'prop-types';

import { Button, Badge, Jumbotron, Spinner } from 'reactstrap';

class GroupDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isVerified: false,
        };

        // this.toggleVerifyPanel = this.toggleVerifyPanel.bind(this);
    }

    static async getInitialProps(context) {
        return context.query || {};
    }

    toggleVerifyPanel() {
        
    }

    render() {
        const { group } = this.props;
        const { isVerified } = this.state;

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
                    <Spinner style={{ width: '3rem', height: '3rem' }} />{' '}
                </Jumbotron>
            </div>
        )
    }
}

GroupDetail.propTypes = {
    user: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
};

export default GroupDetail;