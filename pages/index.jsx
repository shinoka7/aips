import React from 'react';
import PropTypes from 'prop-types';

import RecentActivity  from '../src/client/components/RecentActivity.jsx';
import Preview from '../src/client/components/Preview.jsx';
import Menu from '../src/client/components/Menu.jsx';

import axios from 'axios';

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

        return (
            <div>
                <Preview />
                <Menu events={this.props.events} groups={groups} images={this.props.images} csrfToken={this.props.csrfToken} />
                <hr />
                <RecentActivity csrfToken={this.props.csrfToken} groups={groups} />
            </div>
        );
    }

}

MainPage.propTypes = {
    csrfToken: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MainPage;