import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label } from 'reactstrap';

import { AvForm, AvField } from 'availity-reactstrap-validation';

import axios from 'axios';

class GroupForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            unmountOnClose: false,
            groupName: '',
            groupEmail: '',
            description: '',
        };

        this.valid = {
            name: false,
            email: false
        }

        this.toggle = this.toggle.bind(this);
        this.createHandler = this.createHandler.bind(this);
        this.validate = this.validate.bind(this);
        this.setGroupName = this.setGroupName.bind(this);
        this.setGroupEmail = this.setGroupEmail.bind(this);
        this.handleEmailInvalidSubmit = this.handleEmailInvalidSubmit.bind(this);
        this.setDescription = this.setDescription.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }

    validate() {
        return this.valid.name && this.valid.email;
    }

    async createHandler() {
        const { groupName, groupEmail, description, error } = this.state;
        if (!error) {
            await axios.post('/group/create', {
                name: groupName,
                groupEmail: groupEmail,
                description: description,
                _csrf: this.props.csrf,
            })
            .then((res) => {
                window.location.reload();
            })
            .catch((err) => {
                window.location = '/login';
            });
        }
    }

    async setGroupName(e) {
        const name = e.target.value.trim();
        this.setState({ groupName: name });
        const isValid = !this.props.groupNames.includes(name);
        if (isValid) {
            this.valid.name = true;
        }
    }

    setGroupEmail(e) {
        this.setState({ groupEmail: e.target.value.trim() });
        this.valid.email = true;
    }

    handleEmailInvalidSubmit(event, errors, values) {
        this.setState({ groupEmail: values.groupemail });
        this.valid.email = false;
    }

    setDescription(e) {
        this.setState({ description: e.target.value.trim() });
    }

    render() {
        return (
            <div className="fixed-bottom mb-5 pb-4">
                <Button onClick={this.toggle} size="sm" className="btn btn-success" block>Create</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} unmountOnClose={this.state.unmountOnClose}>
                    <ModalHeader toggle={this.toggle}>Create Group</ModalHeader>
                    <ModalBody>
                        <AvForm>
                            <AvField name="groupname" label="Group Name" type="text" onChange={this.setGroupName} required />
                        </AvForm>
                        <AvForm onInvalidSubmit={this.handleEmailInvalidSubmit}>
                            <AvField name="groupemail" label="Group Email" type="email" placeholder="example420@example.com" onChange={this.setGroupEmail} required />
                        </AvForm>
                        <Label for="description">Description</Label>
                        <Input type="textarea" id="description" placeholder="This is very important" onChange={this.setDescription} rows={3} />
                        <ModalFooter>
                            <Button onClick={this.createHandler} disabled={!this.validate()}>Create</Button>
                            <Button onClick={this.toggle} className="float-right btn btn-warning">Cancel</Button>
                        </ModalFooter>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

GroupForm.propTypes = {
    groupNames: PropTypes.arrayOf(PropTypes.string),
};

export default GroupForm;