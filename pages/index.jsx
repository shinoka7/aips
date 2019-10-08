import React from 'react';
import PropTypes from 'prop-types';

import RecentActivity  from '../src/client/components/RecentActivity.jsx';
import Preview from '../src/client/components/Preview.jsx';
import Calendar from '../src/client/components/Calendar.jsx';

class MainPage extends React.Component {

    static async getInitialProps(context) {
        return context.query || {}; // retrieve props from router
    }

    render() {

        return (
            <div>
                <Preview />
                <Calendar />
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