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
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom">
                <div className="f text-center text-white">
                    Contact: <a href="#">shinoka7@gmail.com</a>
                </div>
            </nav>
        );
    }

}

Footer.propTypes = {

};

export default Footer;