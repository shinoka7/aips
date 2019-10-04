import React from 'react';
import PropTypes from 'prop-types';

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    static async getInitialProps(context) {
        return context.query || {};
    }

    render() {
        return (
            <div>
                <p>AIPS is meant to create clubs and manage activities, while keeping with other members</p>
            </div>
        );
    }
}

About.propTypes = {
    user: PropTypes.object.isRequired,
}

export default About;