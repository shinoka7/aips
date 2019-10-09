import React from 'react';
import PropTypes from 'prop-types';

import RecentActivity  from '../src/client/components/RecentActivity.jsx';
import Preview from '../src/client/components/Preview.jsx';
import CalendarPanel from '../src/client/components/CalendarPanel.jsx';

class MainPage extends React.Component {

    static async getInitialProps(context) {
        return context.query || {}; // retrieve props from router
    }

    render() {

        return (
            <div>
                <Preview />
                <CalendarPanel />
                <hr />
                <RecentActivity csrfToken={this.props.csrfToken} />
            </div>
        );
    }

}

MainPage.propTypes = {
    csrfToken: PropTypes.string.isRequired,
};

export default MainPage;