import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { user } = this.props;

        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="/">AIPS</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/about">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/group/groups">Groups</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/user">Profile</a>
                        </li>
                        { user.id &&
                            <li className="nav-item">
                                <a className="nav-link" href="/auth/logout">Logout</a>
                            </li>
                        }
                        { !user.id &&
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                        }
                        {/* <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Login
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <a className="dropdown-item" href="#">Action</a>
                            <a className="dropdown-item" href="#">Another action</a>
                            <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li> */}
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

Header.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Header;