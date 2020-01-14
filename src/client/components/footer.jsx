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
                <div className="text-center">
                    An <a href="https://rcos.io">RCOS Project</a> ♥ | <i className="far fa-envelope"></i> <a href="#">rpiaips@gmail.com</a> | <a href="https://github.com/shinoka7/aips"><i className="fab fa-github"></i></a>
                </div>
            </nav>
        );
    }

}

Footer.propTypes = {

};

export default Footer;
