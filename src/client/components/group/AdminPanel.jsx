import React from 'react';
import PropTypes from 'prop-types';

import { Button, Badge, Card, CardBody, Row, Col, Form, FormGroup, FormFeedback, Label, Input,
NavItem, NavLink, Nav, TabContent, TabPane, Table } from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';
import Swal from 'sweetalert2';

class AdminPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSettingsForm: false,
            showDisbandForm: false,
            showPendingPanel: false,
            activeTab: '1',
            groupEmail: props.group.groupEmail,
            description: props.group.description,
            website: props.group.website,
            statement: props.group.statement,
            meetingDay: props.group.meetingDay,
            meetingTime: props.group.meetingTime,
            meetingPlace: props.group.meetingPlace,
            pendingUsers: props.pendingUsers,
            mailingList: props.group.mailingList || '',
        };

        // this.addUser = this.addUser.bind(this);
        this.toggleSettingsForm = this.toggleSettingsForm.bind(this);
        this.updateInfoHandler = this.updateInfoHandler.bind(this);
        this.disbandHandler = this.disbandHandler.bind(this);
        this.togglePendingPanel = this.togglePendingPanel.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.acceptHandler = this.acceptHandler.bind(this);
        this.rejectHandler = this.rejectHandler.bind(this);
        this.generatePending = this.generatePending.bind(this);
        this.validEmail = this.validEmail.bind(this);
        this.updateSettingsHandler = this.updateSettingsHandler.bind(this);
    }

    toggleSettingsForm() {
        this.setState({ showSettingsForm: !this.state.showSettingsForm });
    }

    async updateInfoHandler() {
        const { groupEmail, description, website, statement, meetingDay, meetingTime, meetingPlace } = this.state;

        const res = await Swal.fire({
            title: 'Update Group Info',
            type: 'warning',
            text: 'Are you sure?',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: 'primary',
            preConfirm: async() => {
                try {
                    return await axios.put('/group/update/info', {
                        groupId: this.props.group.id,
                        groupEmail,
                        description,
                        website,
                        statement,
                        meetingDay,
                        meetingTime,
                        meetingPlace,
                        _csrf: this.props.csrfToken,
                    });
                }
                catch(err) {
                    console.log(err);
                }
            }
        })
        .then((result) => {
            if (result.value) {
                Swal.fire({
                    title: 'Update!',
                    text: 'The group\'s info has been updated!',
                    type: 'success',
                    onAfterClose: () => {
                        window.location.reload();
                    }
                })
            }
        });
    }

    async disbandHandler() {
        const { group } = this.props;

        const res = await Swal.fire({
            title: "Disband Group",
            html: "Security Question:<br/>What is the group email?",
            input: "text",
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Disband',
            showLoaderOnConfirm: true,
            preConfirm: async(email) => {
                try {
                    if (email === group.groupEmail) {
                        return await axios.delete('/group', { data: { groupId: group.id } });
                    }
                    else {
                        await Swal.fire({
                            title: 'Failed',
                            text: 'Group Email is incorrect',
                            type: 'error'
                        });
                    }
                }
                catch (err) {
                    console.log(err);
                }
            },
        });
    }

    togglePendingPanel() {
        this.setState({ showPendingPanel: !this.state.showPendingPanel });
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
        }
    }
    
    async acceptHandler(userId, groupId) {
        await axios.post('/group/acceptUser', {
            userId, groupId,
            _csrf: this.props.csrfToken,
        })
        .then((res) => {
            const { user } = res.data;
            const pendingUsers = this.state.pendingUsers.filter((pender) => {
                return Number(user.id) !== Number(pender.User.id);
            });
            this.setState({ pendingUsers: pendingUsers });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    async rejectHandler(userId, groupId) {
        await axios.post('/group/rejectUser', {
            userId, groupId,
            _csrf: this.props.csrfToken,
        })
        .then((res) => {
            const { user } = res.data;
            const pendingUsers = this.state.pendingUsers.filter((pender) => {
                return Number(user.id) !== Number(pender.User.id);
            });
            this.setState({ pendingUsers: pendingUsers });
        })
        .catch((err) => {
            console.log(err);
        });
    }

    generatePending() {
        const { group } = this.props;
        const { pendingUsers: users } = this.state;
        return users.map((user) => {
            return (
                <tr key={user.User.id}>
                    <td>{user.User.username}</td>
                    <td><Button color="success" size="sm" onClick={() => {this.acceptHandler(user.User.id, group.id)}}><i className="fas fa-check"></i></Button></td>
                    <td><Button size="sm" onClick={() => {this.rejectHandler(user.User.id, group.id)}}><i className="fas fa-times"></i></Button></td>
                </tr>
            );
        });
    }

    validEmail() {
        const { mailingList /**, mode */ } = this.state;
        const isValidEmail = mailingList.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        return mailingList === '' || isValidEmail;
    }

    async updateSettingsHandler() {
        const { mailingList /**, mode */} = this.state;

        await Swal.fire({
            title: 'Update Group Settings',
            type: 'warning',
            text: 'Are you sure?',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: 'primary',
            preConfirm: async() => {
                try {
                    return await axios.put('/group/update/settings', {
                        groupId: this.props.group.id,
                        mailingList: mailingList,
                        _csrf: this.props.csrfToken,
                    });
                }
                catch(err) {
                    console.log(err);
                }
            }
        })
        .then((res) => {
            if (res.value) {
                Swal.fire({
                    title: 'Update!',
                    text: 'The group\'s settings have been updated!',
                    type: 'success',
                })
            }
        });
    }

    render() {
        const { group, isVerified } = this.props;
        const { mailingList, pendingUsers, groupEmail, description, website, statement, meetingDay, meetingTime, meetingPlace, showSettingsForm, activeTab } = this.state;

        const generatedPending = this.generatePending(pendingUsers);

        return (
            <Card>
                <CardBody>
                    <Row>    
                        <Col xs="6" sm="6" md="6">
                            <b>Settings</b>
                            <Card>
                                <CardBody>
                                    <Form>
                                    <FormGroup tag="fieldset" row>
                                        <Col sm={10}>
                                            <b>Group Mode [Work in Progress] :</b>
                                        <FormGroup check>
                                            <Label check>
                                            <Input type="radio" disabled name="radio2" /**checked={group.mode === 'Public'}**/ />{' '}
                                            Public Mode
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Label check>
                                            <Input type="radio" disabled name="radio2" /**checked={group.mode === 'Private'}**/ disabled={!isVerified} />{' '}
                                            Private Mode
                                            </Label>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="mailingList"><b>Mailing List :</b></Label>
                                            <Input invalid={!this.validEmail()} type="email" id="mailingList" onChange={(e) => {this.setState({ mailingList: e.target.value.trim() })}} placeholder={mailingList}></Input>
                                            <FormFeedback>Invalid email address!</FormFeedback>
                                        </FormGroup>
                                        </Col>
                                    </FormGroup>
                                    <Button onClick={this.updateSettingsHandler} color="primary">Update</Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="6" sm="6" md="6">
                            <Nav tabs>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '1' })}
                                        onClick={() => { this.toggleTab('1') }}
                                        href="#"
                                    >
                                        <b>Pending</b> <Badge color="secondary">{pendingUsers.length}</Badge>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '2' })}
                                        onClick={() => { this.toggleTab('2') }}
                                        href="#"
                                    >
                                        <b>Edit Info</b>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink
                                        className={classnames({ active: activeTab === '3' })}
                                        onClick={() => { this.toggleTab('3') }}
                                        href="#"
                                    >
                                        <b>Disband Group</b>
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            <TabContent activeTab={activeTab}>
                                <TabPane tabId="1">
                                    <Card>
                                        <CardBody>
                                            <Table striped>
                                                <thead>
                                                    <tr>
                                                        <th>Username</th>
                                                        <th>Accept</th>
                                                        <th>Reject</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {generatedPending}
                                                </tbody>
                                            </Table>
                                        </CardBody>
                                    </Card>
                                </TabPane>
                                <TabPane tabId="2">
                                    <Form>
                                        <FormGroup>
                                            <Label for="email">Email :</Label>
                                            <Input type="email" name="email" id="email" placeholder={groupEmail} onChange={(e) => {this.setState({ groupEmail: e.target.value.trim() })}} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="description">Description :</Label>
                                            <Input type="textarea" name="description" id="description" placeholder={description} onChange={(e) => {this.setState({ description: e.target.value.trim() })}} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="website">Website :</Label>
                                            <Input type="url" name="website" id="website" placeholder={website} onChange={(e) => {this.setState({ website: e.target.value.trim() })}} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="statement">Statement of Purpose/Mission :</Label>
                                            <Input type="textarea" name="statement" id="statement" placeholder={statement} onChange={(e) => {this.setState({ statement: e.target.value.trim() })}} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="meetingDay">Usual Meeting Day :</Label>
                                            <Input type="select" name="meetingDay" id="meetingDay" value={meetingDay === '' ? 'default' : meetingDay} onChange={(e) => {this.setState({ meetingDay: e.target.value })}}>
                                                <option value="default" disabled>--Select a Day--</option>
                                                <option hidden value={group.meetingDay} disabled>{group.meetingDay}</option>
                                                <option>Sunday</option>
                                                <option>Monday</option>
                                                <option>Tuesday</option>
                                                <option>Wednesday</option>
                                                <option>Thursday</option>
                                                <option>Friday</option>
                                                <option>Saturday</option>
                                            </Input>
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="meetingTime">Usual Meeting Time :</Label>
                                            <Input type="time" name="meetingTime" id="meetingTime" value={meetingTime} onChange={(e) => {this.setState({ meetingTime: e.target.value })}} />
                                        </FormGroup>
                                        <FormGroup>
                                            <Label for="meetingPlace">Usual Meeting Place :</Label>
                                            <Input type="text" name="meetingPlace" id="meetingPlace" placeholder={meetingPlace} onChange={(e) => {this.setState({ meetingPlace: e.target.value.trim() })}} />
                                        </FormGroup>
                                        <Button onClick={this.updateInfoHandler} color="primary">Confirm</Button>
                                        {'\t'}
                                        <Button onClick={this.toggleSettingsForm} color="secondary">Cancel</Button>
                                    </Form>
                                </TabPane>
                                <TabPane tabId="3">
                                    <Card className="text-center">
                                        <CardBody>
                                            <Button onClick={this.disbandHandler} color="danger" disabled>Disband Group [Currently Disabled]</Button>
                                        </CardBody>
                                    </Card>
                                </TabPane>
                            </TabContent>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

AdminPanel.propTypes = {
    group: PropTypes.object.isRequired,
    pendingUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
    isVerified: PropTypes.bool.isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default AdminPanel;