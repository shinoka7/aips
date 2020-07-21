import React from 'react';
import PropTypes from 'prop-types';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Label, Input, Form } from 'reactstrap';

import { AvForm, AvField } from 'availity-reactstrap-validation';

import axios from 'axios';

class PostForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            unmountOnClose: false,
            errors: [],
            groupId: undefined,
            title: '',
            content: '',
        }

        this.generateGroupOptions = this.generateGroupOptions.bind(this);
        this.validate = this.validate.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.setContent = this.setContent.bind(this);
        this.setGroupId = this.setGroupId.bind(this);
        this.createHandler = this.createHandler.bind(this);
    }

    componentDidUpdate(prevProps){
        if(prevProps.modal !== this.props.modal){
            this.setState({ modal: this.props.modal });
        }
    }

    toggle() {
        this.props.togglePostForm();
    }

    generateGroupOptions(groups) {
        const groupOptions = groups.map((group) => {
            return (
                <option key={group.id} value={group.id}>{group.name}</option>
            );
        });
        
        return groupOptions;
    }

    validate() {
        const { title, content, groupId } = this.state;
        return title !== '' && content !== '' && groupId;
    }

    setTitle(e) {
        this.setState({ title: e.target.value.trim() });
    }

    setContent(e) {
        this.setState({ content: e.target.value.trim() });
    }

    setGroupId(e) {
        this.setState({ groupId: e.target.value });
    }

    async createHandler() {
        const { groupId, title, content } = this.state;

        const res = await axios.post('/post', {
            groupId,
            title,
            content,
            _csrf: this.props.csrfToken,
        });
        window.location.reload();
    }

    render() {
        const { togglePostForm } = this.props;
        const groups = this.props.groups || [];
        const groupOptions = this.generateGroupOptions(groups);

        return (
            <div>
                <Modal isOpen={this.state.modal} toggle={togglePostForm} unmountOnClose={this.state.unmountOnClose}>
                    <ModalHeader toggle={togglePostForm}>Create Post</ModalHeader>
                    <ModalBody>
                        <AvForm>
                            <AvField
                                type="select"
                                name="group"
                                label="Group"
                                helpMessage="Choose the group you will post as"
                                onChange={this.setGroupId}
                                value={'default'}
                            >
                                <option value="default" disabled>--Select the Group--</option>
                                {groupOptions}
                            </AvField>
                            <AvField name="title" label="Title" onChange={this.setTitle} required />
                        </AvForm>
                        <Label for="content">Content</Label>
                        <Input type="textarea" id="content" placeholder="What's going on?" onChange={this.setContent} rows={5} required />
                        <ModalFooter>
                            <Button onClick={this.createHandler} className="dark_blue_button" disabled={!this.validate()}>Post</Button>
                            <Button onClick={togglePostForm} color="secondary">Cancel</Button>
                        </ModalFooter>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

PostForm.propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
    modal: PropTypes.bool.isRequired,
    togglePostForm: PropTypes.func.isRequired,
};

export default PostForm;