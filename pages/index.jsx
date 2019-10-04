import React from 'react';
import PropTypes from 'prop-types';

import RecentActivity  from '../src/client/components/RecentActivity.jsx';
import Preview from '../src/client/components/Preview.jsx';

class MainPage extends React.Component {

    static async getInitialProps(context) {
        return context.query || {}; // retrieve props from router
    }

    render() {
        return (
            <div>
                <Preview />
                <hr />
                <RecentActivity />
            </div>
        );
    }

}

MainPage.propTypes = {
};

export default MainPage;