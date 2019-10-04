import React from 'react';
import PropTypes from 'prop-types';

import { Button } from 'reactstrap';

class GroupDetail extends React.Component {
    constructor(props) {
        super(props);
    }

    static async getInitialProps(context) {
        return context.query || {};
    }

    render() {
        return (
            <div>
                Group Page
            </div>
        )
    }
}

GroupDetail.propTypes = {
    user: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
};

export default GroupDetail;