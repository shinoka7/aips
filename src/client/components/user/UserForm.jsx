import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input } from 'reactstrap';

import { AvForm, AvField } from 'availity-reactstrap-validation';

import axios from 'axios';

import Swal from 'sweetalert2';

class UserForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            unmountOnClose: false,
            errors: [],
            firstName: '',
            lastName: '',
            username: '',
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

    /**
     * handles username change confirmation
     */
    async confirmHandler() {
        const { user, csrfToken } = this.props;
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
            preConfirm: async() => {
                try {
                    return await axios.put(`/user/${user.id}/update`, params);
                }
                catch(err) {
                    console.log(err);
                }
            }
        });

        if (!res.dismiss) {
            window.location.reload();
        }

        this.toggle();
    }

    validate() {
        const { username, firstName, lastName } = this.state;
        return username !== '' && firstName !== '' && lastName !== '';
    }

    render() {
        const { user, csrfToken } = this.props;

        return (
            <div className="pl-3">
                <Button onClick={this.toggle} className="btn btn-outline-primary"><i className="fas fa-edit"></i>Edit Profile</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} unmountOnClose={this.state.unmountOnClose}>
                    <ModalHeader toggle={this.toggle}>Edit Profile</ModalHeader>
                    <ModalBody>
                        <AvForm>
                            <AvField name="username" label="Username" onChange={this.setUsername} required />
                            <AvField name="firstname" label="First Name" onChange={this.setFirstName} required />
                            <AvField name="lastname" label="Last Name" onChange={this.setLastName} required />
                        </AvForm>
                        <ModalFooter>
                            <Button onClick={this.confirmHandler} color="primary" disabled={!this.validate()}>Confirm</Button>
                            <Button onClick={this.toggle} color="secondary">Cancel</Button>
                        </ModalFooter>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

UserForm.propTypes = {
    user: PropTypes.object.isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default UserForm;