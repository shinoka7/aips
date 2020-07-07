import React from 'react';
import PropTypes from 'prop-types';

import { Alert, Button, ButtonGroup, Badge, Jumbotron, Container, Nav, NavItem, NavLink,
    Media, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import Swal from 'sweetalert2';

import FileUpload from '../../src/client/components/FileUpload.jsx';
import CalendarPanel from '../../src/client/components/CalendarPanel.jsx';
import PostForm from '../../src/client/components/PostForm.jsx';
import AdminPanel from '../../src/client/components/group/AdminPanel.jsx';
import DetailPanel from '../../src/client/components/group/DetailPanel.jsx';

/* This component renders an individual group page of the AIPS web application,
which displays important group information such as name, category,
description, email, meeting time, and members. Additionally,
there are options to join and leave a group, toggle the events calendar,
post to the group, and edit group information as an administrator. */
class GroupDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isVerified: false,
            activeTab: '1',
            calendarIsOpen: false,
            postIsOpen: false,
            showSuccessAlert: false,
        };

        // this.toggleVerifyPanel = this.toggleVerifyPanel.bind(this);
        this.joinGroupHandler = this.joinGroupHandler.bind(this);
        this.leaveGroupHandler = this.leaveGroupHandler.bind(this);
        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.togglePostForm = this.togglePostForm.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
    }

    static async getInitialProps(context) {
        return context.query || {};
    }

    // toggleVerifyPanel() {
        
    // }

    /* This function sends a request to add a user to a group. 
    If a user is logged in, they will become a pending member of the 
    group, and if not logged in, they will be redirected to the login
    page. */
    async joinGroupHandler() {
        const { user, group, csrfToken } = this.props;
        await axios.post('/group/addUser', {
            userId: user.id,
            groupId: group.id,
            _csrf: csrfToken,
        })
        .then((res) => {
            this.setState({ showSuccessAlert: true });
        })
        .catch((err) => {
            window.location = '/login';
        });
    }

    /* This function sends a request to remove the currently
    logged in user from the group. If the user is the
    owner of the group, they will be requested to transfer
    group ownership before leaving. */
    async leaveGroupHandler() {
        const { user, group, csrfToken } = this.props;
        const params = {
            userId: user.id,
            groupId: group.id,
            _csrf: csrfToken,
        };
        if (user.id == group.adminUserId)
        {
            await Swal.fire({
                title: 'You are the Group Owner',
                type: 'warning',
                text: 'Please transfer group ownership before leaving the group.',
            }).then(() =>
                {
                    window.location = "/group/" + group.id;
                });
        }
        else
        {
            const res = await Swal.fire({
                title: 'Leave the Group',
                type: 'warning',
                text: 'Are you sure?',
                showCancelButton: true,
                confirmButtonText: 'Leave',
                confirmButtonColor: '#d33',
                cancelButtonColor: '#696969',
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
    }

    toggleCalendar() {
        this.setState({ calendarIsOpen: !this.state.calendarIsOpen });
    }

    togglePostForm() {
        this.setState({ postIsOpen: !this.state.postIsOpen });
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
        }
    }

    render() {
        const { group, user, category, isUserInGroup, isUserOwner, events, csrfToken, images, pendingUsers, googleCalendar, members } = this.props;
        const { isVerified, activeTab, calendarIsOpen, postIsOpen, showSuccessAlert} = this.state;
       
        return (
            <div>
                <Jumbotron fluid>
                    <Container  fluid>
                        { showSuccessAlert &&
                            <Alert color="success">You have successfully sent out a request to join this group!</Alert>
                        }
                        {/* Render the group image upload component, name
                        category, description, and verification status. */}
                        <Media>
                            <FileUpload 
                                isUserInGroup={isUserInGroup}
                                accept="image/*"
                                currentImage={group.groupImage}
                                hasModal={true}
                                groupID={group.id}
                                csrfToken={csrfToken}>
                            </FileUpload>
                            <Media body className="text-center">
                                <Media heading>
                                    <p className="display-4">{group.name}</p>
                                </Media>
                                <Badge color="info" pill>{category.name}</Badge>
                                { isVerified &&
                                    <Badge /**onClick={this.toggleVerifyPanel}*/ color="success" pill>Verified</Badge>
                                }
                                { !isVerified &&
                                    <Badge /**onClick={this.toggleVerifyPanel}*/ color="warning" pill>Pending</Badge>
                                }
                                <br /><br />
                                {group.description}
                            </Media>
                        </Media>
                        <hr /> 
                        {/* Render buttons for joining and leaving a group,
                        opening the events calender, and posting, which are
                        activated based on user membership in the group. */}
                        <ButtonGroup>
                            <Button onClick={this.joinGroupHandler} color="success" disabled={isUserInGroup}>
                                <i className="fas fa-user-plus"> Join</i>
                            </Button>
                            <Button onClick={this.leaveGroupHandler} color="danger" disabled={!isUserInGroup}>
                                <i className="fas fa-sign-out-alt"> Leave</i>
                            </Button>
                        </ButtonGroup>
                        {'\t'}
                        <ButtonGroup className="text-right">
                            <Button onClick={this.toggleCalendar} className="dark_blue_button btn btn-info">
                                <i className="fas fa-calendar-alt"> Events</i>
                            </Button>
                        </ButtonGroup>
                        {'\t'}
                        <ButtonGroup>
                            <Button onClick={this.togglePostForm} className="btn btn-secondary" disabled={!isUserInGroup}>
                                <i className="fas fa-edit"> Post</i>
                            </Button>
                        </ButtonGroup>
                        <PostForm togglePostForm={this.togglePostForm} groups={[group]} csrfToken={csrfToken} modal={postIsOpen} />
                        <CalendarPanel toggleCalendar={this.toggleCalendar} events={events} isUserInGroup={isUserInGroup}  groups={isUserInGroup ? [group] : []} csrfToken={csrfToken} user={user} modal={calendarIsOpen} images={images} />
                        <br />
                         {/* Render 'general' and 'admin' tabs, which contain
                         a DetailPanel and AdminPanel respectively.*/}
                        <Nav tabs>
                            <NavItem>
                                <NavLink
                                    id = "dark_blue_tab"
                                    className={classnames({ active: activeTab === '1'})}
                                    onClick={() => { this.toggleTab('1'); }}
                                    href="#"
                                >
                                    General <i className="fas fa-info-circle"></i>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    disabled={!isUserInGroup}
                                    id = "dark_blue_tab"
                                    className={classnames({ active: activeTab === '2'})}
                                    onClick={() => { this.toggleTab('2'); }}
                                    href="#"
                                >
                                    Admin <i className="fas fa-user-lock"></i>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId="1">
                                <DetailPanel group={group} members={members}/>
                            </TabPane>
                            <TabPane tabId="2">
                                <AdminPanel group={group} members={members} pendingUsers={pendingUsers} 
                                    isUserOwner={isUserOwner} isVerified={isVerified} csrfToken={csrfToken} />
                            </TabPane>
                        </TabContent>
                    </Container>
                </Jumbotron>
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
    category: PropTypes.object.isRequired,
    isUserInGroup: PropTypes.bool.isRequired,
    csrfToken: PropTypes.string.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    pendingUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default GroupDetail;