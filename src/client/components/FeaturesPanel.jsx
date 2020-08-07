import React from 'react';
import PropTypes from 'prop-types';

import { Jumbotron, Media, Row, Col, Container } from 'reactstrap';

class FeaturesPanel extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            gifIsOn: true
        };

        this.timer = 3700;
    }

    componentDidMount() 
    {
        setTimeout(this.toggleGif.bind(this), this.timer);
    }

    toggleGif()
    {
        this.setState({gifIsOn: !this.state.gifIsOn});
    }

    render() {
        let gifIsOn = this.state.gifIsOn;
        return (
            <Jumbotron>
                <div className="text-black text-center py-5 px-4">
                        <h1><strong>Main Features</strong></h1>
                        <Jumbotron>
                            <Row>
                                {gifIsOn === true &&
                                <Col md="12" lg="6">                                  
                                    <img src={`/resources/img/examples/calendar.gif`} className="features_preview" alt="Calendar GIF"></img>
                                </Col>}
                                {gifIsOn === false &&
                                    <Col md="12" lg="6">                                  
                                    <img src={`/resources/img/examples/calendar.png`} className="features_preview" alt="Calendar Image"></img>
                                </Col>}
                                <Col md="12" lg="6">
                                    <br />
                                    <Container className="features_preview_container">
                                        <Media>
                                            <Media left bottom className="pt-4">
                                                <span className="dot">
                                                    <i className="far fa-calendar-check"></i>
                                                </span>
                                            </Media>
                                            <Media body>
                                                <Media heading>
                                                    <strong>Events</strong>
                                                </Media>
                                                Create and share events. Currently supporting 2 types of calendars (main and individual group calendars), groups can easily publicize events.
                                                Find out about events hosted by a specific group by accessing the calendar from the group's page.
                                                Or check out the main calendar to see all events that are going on (from the menu button).
                                            </Media>
                                        </Media>
                                    </Container>
                                    <br /><br />
                                    <br /><br />
                                    <Container className="features_preview_container">
                                        <Media>
                                            <Media left bottom className="pt-4">
                                                <span className="dot">
                                                    <i className="far fa-edit"></i>
                                                </span>
                                            </Media>
                                            <Media body>
                                                <Media heading>
                                                    <strong>Posts</strong>
                                                </Media>
                                                Post to make announcements (or even just to reach out) to all users. Users can configure their settings
                                                to receive email notifications when a specific group creates a post (or a event).
                                            </Media>
                                        </Media>
                                    </Container>
                                </Col>
                            </Row>
                        </Jumbotron>
                </div>
            </Jumbotron>
        );
    }
}

FeaturesPanel.propTypes = {

};

export default FeaturesPanel;