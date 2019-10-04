import React from 'react';
import PropTypes from 'prop-types';

import RecentActivity  from '../src/client/components/RecentActivity.jsx';
import Preview from '../src/client/components/Preview.jsx';

class MainPage extends React.Component {

    static async getInitialProps(context) {
        return context.query || {}; // retrieve props from router
    }

    render() {
        const { csrf } = this.props;

        return (
            <div>
                <Preview />
                <hr />
                <RecentActivity csrf={csrf} />
            </div>
        );
    }

}

MainPage.propTypes = {
    csrf: PropTypes.string,
};

export default MainPage;