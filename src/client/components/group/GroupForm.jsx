import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';

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
            categoryId: 0,
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
        this.setCategory = this.setCategory.bind(this);
        this.generateCategories = this.generateCategories.bind(this);
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
        const { groupName, groupEmail, description, categoryId, error } = this.state;
        if (!error) {
            await axios.post('/group/create', {
                name: groupName,
                groupEmail: groupEmail,
                description: description,
                categoryId: categoryId,
                _csrf: this.props.csrfToken,
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

    setCategory(e) {
        this.setState({ categoryId: e.target.value });
    }

    generateCategories(categories) {
        return categories.map((category) => {
            return (
                <option key={category.id} value={category.id}>{category.name}</option>
            );
        });
    }

    render() {
        const { categoryId } = this.state;
        const { categories } = this.props;

        const generatedCategories = this.generateCategories(categories);
    
        return (
            <div >
                <Button onClick={this.toggle} size="lg" className="btn btn-danger"><i className="fas fa-plus-circle"></i> Create</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} unmountOnClose={this.state.unmountOnClose}>
                    <ModalHeader toggle={this.toggle}>Create Group</ModalHeader>
                    <ModalBody>
                        <AvForm>
                            <AvField name="groupname" label="Group Name" type="text" onChange={this.setGroupName} required />
                        </AvForm>
                        <AvForm onInvalidSubmit={this.handleEmailInvalidSubmit}>
                            <AvField name="groupemail" label="Group Email" type="email" placeholder="example420@example.com" onChange={this.setGroupEmail} required />
                        </AvForm>
                        <FormGroup>
                            <Label for="category">Category :</Label>
                            <Input type="select" name="category" id="category" value={categoryId === 0 ? 'default' : categoryId} onChange={this.setCategory}>
                                <option value="default" disabled>--Select a Category--</option>
                                {generatedCategories}
                            </Input>
                        </FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" id="description" placeholder="This is very important" onChange={this.setDescription} rows={3} />
                        <ModalFooter>
                            <Button onClick={this.createHandler} color="primary" disabled={!this.validate()}>Create</Button>
                            <Button onClick={this.toggle} color="secondary">Cancel</Button>
                        </ModalFooter>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

GroupForm.propTypes = {
    groupNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    categories: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
};

export default GroupForm;