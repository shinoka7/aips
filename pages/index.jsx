import React from 'react';
import PropTypes from 'prop-types';

import FeaturesPanel from '../src/client/components/FeaturesPanel.jsx';
import RecentActivity  from '../src/client/components/RecentActivity.jsx';
import Preview from '../src/client/components/Preview.jsx';
import Menu from '../src/client/components/Menu.jsx';

import axios from 'axios';

/* This component renders the main page of the AIPS web application,
which includes an event preview panel, a menu for creating posts
and accessing the calendar, a panel describing main features,
and a panel for recent posts. */
class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            groups: [],
        };
    }

    static async getInitialProps(context) {
        return context.query || {}; // retrieve props from router
    }

    async componentDidMount() {
        await axios.get('/group')
            .then((result) => {
                this.setState({ groups: result.data.groups });
            });
    }

    render() {
        const { groups } = this.state;
        const { events, images, csrfToken, shownEvents, user } = this.props;

        return (
            <div>
                <Preview events={shownEvents} />
                <Menu events={events} groups={groups} images={images} user={user} csrfToken={csrfToken} />
                <br />
                <FeaturesPanel />
                <RecentActivity csrfToken={csrfToken} groups={groups} />
            </div>
        );
    }
}

MainPage.propTypes = {
    csrfToken: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    shownEvents: PropTypes.arrayOf(PropTypes.object).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    user: PropTypes.object.isRequired,
};

export default MainPage;
