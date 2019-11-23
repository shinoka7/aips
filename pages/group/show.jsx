import React from 'react';
import PropTypes from 'prop-types';

import { Button, Badge, Jumbotron, Spinner, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import Swal from 'sweetalert2';

import CalendarPanel from '../../src/client/components/CalendarPanel.jsx';
import PostForm from '../../src/client/components/PostForm.jsx';

class GroupDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isVerified: false,
            activeTab: '1',
            calendarIsOpen: false,
            postIsOpen: false,
        };

        // this.toggleVerifyPanel = this.toggleVerifyPanel.bind(this);
        this.joinGroupHandler = this.joinGroupHandler.bind(this);
        this.leaveGroupHandler = this.leaveGroupHandler.bind(this);
        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.togglePostForm = this.togglePostForm.bind(this);
    }

    static async getInitialProps(context) {
        return context.query || {};
    }

    // toggleVerifyPanel() {
        
    // }

    async joinGroupHandler() {
        const { user, group, csrfToken } = this.props;
        await axios.post('/group/addUser', {
            user,
            group,
            _csrf: csrfToken,
        })
        .then((res) => {
            window.location.reload();
        })
        .catch((err) => {
            window.location = '/login';
        });
    }

    async leaveGroupHandler() {
        const { user, group, csrfToken } = this.props;
        const params = {
            user,
            group,
            _csrf: csrfToken,
        };

        const res = await Swal.fire({
            title: 'Leave the Group',
            type: 'warning',
            text: 'Are you sure?',
            showCancelButton: true,
            confirmButtonText: 'Leave',
            confirmButtonColor: '#d33',
            preConfirm: async() => {
                try {
                    return await axios.post('/group/deleteUser', params);
                }
                catch(err) {
                    console.log(err);
                }
            }
        });

        if (!res.dismiss) {
            window.location.reload()
        }
    }

    toggleCalendar() {
        this.setState({ calendarIsOpen: !this.state.calendarIsOpen });
    }

    togglePostForm() {
        this.setState({ postIsOpen: !this.state.postIsOpen });
    }

    render() {
        const { group, user, isUserInGroup, events, csrfToken } = this.props;
        const { isVerified, activeTab, calendarIsOpen, postIsOpen } = this.state;

        return (
            <div>
                <Jumbotron>
                    <h2 className="display-3">{group.name}</h2>
                    { isVerified &&
                        <Badge /**onClick={this.toggleVerifyPanel}*/ color="success" pill>Verified</Badge>
                    }
                    { !isVerified &&
                            <Badge /**onClick={this.toggleVerifyPanel}*/ color="warning" pill>Pending</Badge>
                    }
                    <hr />
                    <Button onClick={this.joinGroupHandler} color="success" disabled={isUserInGroup}>
                        <i className="fas fa-user-plus"> Join</i>
                    </Button>
                    {'\t'}
                    <Button onClick={this.leaveGroupHandler} color="danger" disabled={!isUserInGroup}>
                        <i className="fas fa-sign-out-alt"> Leave</i>
                    </Button>
                    {'\t'}
                    <Button onClick={this.toggleCalendar} className="btn btn-info">
                        <i className="fas fa-calendar-alt"> Events</i>
                    </Button>
                    <CalendarPanel toggleCalendar={this.toggleCalendar} events={events} groups={[group]} csrfToken={csrfToken} modal={calendarIsOpen} />
                    {'\t'}
                    <Button onClick={this.togglePostForm} className="btn btn-secondary">
                        <i className="fas fa-edit"> Post</i>
                    </Button>
                    <PostForm togglePostForm={this.togglePostForm} groups={[group]} csrfToken={csrfToken} modal={postIsOpen} />
                </Jumbotron>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === '1'})}
                        >
                            
                        </NavLink>
                    </NavItem>
                </Nav>
                {/* INNER FRAME KILLS SESSION? https://www.webdeveloper.com/d/187843-iframe-is-killing-my-session-data */}
                {/* https://stackoverflow.com/questions/917500/how-can-i-persist-a-session-in-an-iframe */}
                {/* <iframe width="100%" height="500" src="http://localhost:3010/" frameborder="0"></iframe> */}
            </div>
        )
    }
}

GroupDetail.propTypes = {
    user: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    isUserInGroup: PropTypes.bool.isRequired,
    csrfToken: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GroupDetail;