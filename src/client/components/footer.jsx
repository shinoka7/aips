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
                    An <a target="_blank" href="https://rcos.io" className="link">
                    RCOS Project</a> ♥ | <i className="far fa-envelope"></i> 
                    <a href="#" className="link"> rpiaips@gmail.com </a> | 
                    <a target="_blank" href="https://github.com/shinoka7/aips" className="link"> GitHub <i className="fab fa-github"></i></a>
                </div>
            </nav>
        );
    }

}

Footer.propTypes = {

};

export default Footer;
