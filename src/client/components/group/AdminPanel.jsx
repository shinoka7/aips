import React from 'react';
import PropTypes from 'prop-types';

import { Button, Card, CardBody, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';

class AdminPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSettingsForm: false,
            groupEmail: props.group.groupEmail,
            description: props.group.description,
            website: props.group.website,
            statement: props.group.statement,
            meetingDay: props.group.meetingDay,
            meetingTime: props.group.meetingTime,
            meetingPlace: props.group.meetingPlace,
        };

        // this.addUser = this.addUser.bind(this);
        this.toggleSettingsForm = this.toggleSettingsForm.bind(this);
        this.updateHandler = this.updateHandler.bind(this);
    }

    // addUser() {

    // }

    toggleSettingsForm() {
        this.setState({ showSettingsForm: !this.state.showSettingsForm });
    }

    async updateHandler() {
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
                    return await axios.put('/group/update', {
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
                    text: 'The Group has been updated!',
                    type: 'success',
                    onAfterClose: () => {
                        window.location.reload();
                    }
                })
            }
        });
    }


    render() {
        const { group } = this.props;
        const { groupEmail, description, website, statement, meetingDay, meetingTime, meetingPlace, showSettingsForm } = this.state;

        return (
            <Card>
                <CardBody>
                    <Row>    
                        <Col xs="6" sm="6" md="6">
                            <b>Pending</b>
                            <Card>
                                <CardBody>
                                    {/* Pending users */}
                                    {/* <a onClick={this.addUser}><i class="fas fa-plus-circle"></i></a> */}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="6" sm="6" md="6">
                            <b>Settings</b>
                            <hr />
                            { !showSettingsForm &&
                                <Button onClick={this.toggleSettingsForm} color="warning">Update Info</Button>
                            }
                            { showSettingsForm &&
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
                                    <Button onClick={this.updateHandler} color="primary">Confirm</Button>
                                    {'\t'}
                                    <Button onClick={this.toggleSettingsForm} color="secondary">Cancel</Button>
                                </Form>
                            }
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

AdminPanel.propTypes = {
    group: PropTypes.object.isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default AdminPanel;