import React from 'react';
import PropTypes from 'prop-types';

import { Button, Card, CardBody, CardText, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from 'reactstrap';

import { AvForm, AvField } from 'availity-reactstrap-validation';

import axios from 'axios';

import Swal from 'sweetalert2';

/* This component manages and renders the user form
panel in the user 'show' page, which displays a user's username, 
first name, and last name, and has a form for changing user 
details. */
class UserForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            unmountOnClose: false,
            errors: [],
            firstName: props.user.firstName,
            lastName: props.user.lastName,
            username: props.user.username,
        }

        this.toggle = this.toggle.bind(this);
        this.setUsername = this.setUsername.bind(this);
        this.setFirstName = this.setFirstName.bind(this);
        this.setLastName = this.setLastName.bind(this);
        this.confirmHandler = this.confirmHandler.bind(this);
        this.validate = this.validate.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    setUsername(e) {
        this.setState({ username: e.target.value.trim() });
    }

    setFirstName(e) {
        this.setState({ firstName: e.target.value.trim() });
    }

    setLastName(e) {
        this.setState({ lastName: e.target.value.trim() });
    }

    /* This function displays a pop-up to confirm the user's choice to update their
    profile, and then sends a request to update the fields based on the form input. 
    If the server request is successful, the user's profile will be updated and the 
    page will be reloaded. */
    async confirmHandler() {
        const { csrfToken } = this.props;
        const { username, firstName, lastName } = this.state;
        const params = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            _csrf: csrfToken,
        };

        const res = await Swal.fire({
            title: 'Updating User Info',
            type: 'warning',
            text: 'Are you sure?',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: '#0066FF',
            cancelButtonColor: '#696969',
            preConfirm: async() => {
                try {
                    return await axios.put(`/user/update`, params);
                }
                catch(err) {
                    console.log(err);
                }
            }
        }).then((res) => {

        });

        // if (res.value) {
            this.setState({ username: username, firstName, lastName });
        // }

        this.toggle();
    }

    validate() {
        const { username, firstName, lastName } = this.state;
        return username !== '' && firstName !== '' && lastName !== '';
    }

    render() {
        const { username, firstName, lastName } = this.state;

        return (
            <Card>
                {/* Display a user's information */}
                <CardBody>
                <CardText>
                    Username : {username}<br />
                    First name : {firstName}<br />
                    Last name : {lastName}<br />
                </CardText>
                <CardText className="text-right">
                    {/* If the button has been pressed, toggle the form below */}
                    <Button onClick={this.toggle} className="button_text btn btn-outline-primary"><i className="fas fa-edit"></i>Edit Profile</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} unmountOnClose={this.state.unmountOnClose}>
                        <ModalHeader toggle={this.toggle}>Edit Profile</ModalHeader>
                        <ModalBody>
                            <AvForm>
                                <AvField name="username" label="Username" onChange={this.setUsername} required />
                                <AvField name="firstname" label="First Name" onChange={this.setFirstName} required />
                                <AvField name="lastname" label="Last Name" onChange={this.setLastName} required />
                            </AvForm>
                            <ModalFooter>
                                <Button onClick={this.confirmHandler} id="dark_blue_button" disabled={!this.validate()}>Confirm</Button>
                                <Button onClick={this.toggle} color="secondary">Cancel</Button>
                            </ModalFooter>
                        </ModalBody>
                    </Modal>
                </CardText>
                </CardBody>
            </Card>
        );
    }
}

UserForm.propTypes = {
    user: PropTypes.object.isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default UserForm;