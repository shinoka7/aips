import React from 'react';
import PropTypes from 'prop-types';

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * TODO: Credits, License, Inquiry, User Agreemeents, Page Navigation
     */

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-bottom">
                <div className="text-left">
                    An RCOS Project ♥ - <i className="far fa-envelope"></i> <a href="#">rpiaips@gmail.com</a>
                </div>
            </nav>
        );
    }

}

Footer.propTypes = {

};

export default Footer;
