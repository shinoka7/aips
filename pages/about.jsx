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
            <div className="about col-sm-12 col-md-6 offset-md-3">
                <h2>An Intuitive Platform for Societies, or AIPS for short</h2>
                <br/>
                <p> 
                    AIPS is a central location for posting, advertising, and tracking club events and updates.
                    We designed the app to solve the problem of how complicated it is for RPI societies to advertise public events.
                    With so many social media apps, it's hard for an interested student to keep on top of every different RPI event throughout the week.
                    AIPS simplifies the event-making functionality of Facebook, personalized for RPI students.
                </p>
                <br/>
                <p>
                    Once you add your society to AIPS, you can create public events on the calendar.
                    Click on the Groups tab to get started.
                </p>
                <br/>
                <p>Check out our <a href="https://github.com/shinoka7/aips">Github</a> to learn about contributing, create issues, or contact us.</p>
            </div>
        );
    }
}

About.propTypes = {
    user: PropTypes.object.isRequired,
}

export default About;
