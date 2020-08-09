import React from 'react';
import PropTypes from 'prop-types';

class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            atTop: true,
            options: 'fixed-top',
        };
    }

    componentDidMount() {
        window.onscroll = () => {
            if (window.scrollY > 50) {
                this.setState({ atTop: false, options: 'fixed-top' });
            }
            else {
                this.setState({ atTop: true, options: 'fixed-top' });
            }
        }
    }

    render() {
        const { user } = this.props;
        const { options } = this.state;

        const opacity = this.state.atTop ? 1 : 0.5;

        return (
            <div className="container" style={{opacity}}>
                <nav className={`navbar navbar-expand-lg navbar-dark header ${options}`}>
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
                        { user.id &&
                            <React.Fragment>
                                <li className="nav-item">
                                    <a className="nav-link" href="/user">Profile</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/auth/logout">Logout</a>
                                </li>
                            </React.Fragment>
                        }
                        { !user.id &&
                            <li className="nav-item">
                                <a className="nav-link" href="/login">Login</a>
                            </li>
                        }
                        </ul>
                    </div>
                    <ul class="nav navbar-nav navbar-right">
                    <img src={`/resources/img/RPILogo.png`} alt="Calendar Image"></img>
                    </ul>
                </nav>
            </div>
        );
    }
}

Header.propTypes = {
    user: PropTypes.object.isRequired,
};

export default Header;
