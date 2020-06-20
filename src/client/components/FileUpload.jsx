import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Media, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label } from 'reactstrap';

class FileUpload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            modal: false,
            unmountOnClose: false,
            fileUploaded: false,
            valid: true
        }

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.removeFile = this.removeFile.bind(this);
    }

    onFormSubmit(e)
    {
        e.preventDefault();
        this.props.uploadFile(this.state.file);
        this.setState({modal: false, fileUploaded: true});
    }

    onChange(e)
    {
        if (e.target.files[0].size < 2000000)
        {
            this.setState({file: e.target.files[0],
                           valid: true});
        }
        else 
        {
            this.setState({valid: false});
        }
    }

    toggleModal()
    {
        const {isUserInGroup} = this.props;
        if (isUserInGroup)
            this.setState({modal: !this.state.modal});
    }

    removeFile()
    {
        this.setState({file: null, fileUploaded: false});
    }

    render() 
    {
        const {modal, unmountOnClose, file, fileUploaded, valid} = this.state;
        const {accept, currentImage, hasModal, groupID, csrfToken} = this.props;
        const imgStyle = {
            maxHeight: 256,
            maxWidth: 512
          }
        return (
            <div>
                {hasModal &&
                    <Media left onClick={this.toggleModal}>
                        <Media object rounded="true" fluid="true" src={currentImage} style={imgStyle} alt="Group placeholder image" className="border rounded border-dark"></Media>
                    </Media>
                }
                {hasModal &&
                    <Modal isOpen={modal} toggle={this.toggleModal} unmountOnClose={unmountOnClose}>
                        <Form action="/group/setImage" encType="multipart/form-data" method="POST">
                            <ModalHeader toggle={this.toggle}>Upload File</ModalHeader>
                            <ModalBody>
                                <Input type="hidden" name="_csrf" value={csrfToken}/>
                                <Input type="hidden" name="groupId" value={groupID} />
                                <Label for="myFile" hidden> Upload File </Label>
                                <Input type="file" accept={accept} onChange={this.onChange} name="myFile" id="myFile"/>
                            </ModalBody>
                                <Row>
                                    <Col md="1">
                                    </Col>
                                    {!valid &&
                                        <Col md="6">
                                            <p class="text-danger">File size exceeds 10MB.</p>
                                        </Col>
                                    }
                                    {valid &&
                                        <Col md="6">
                                        </Col>
                                    }
                                    <Col md="2">
                                        <Button type="submit" color="primary" disabled={!file || !valid} onClick={this.toggleModal}> Upload </Button>
                                    </Col>
                                    <Col md="2">
                                        <Button onClick={this.toggleModal}> Cancel </Button>
                                    </Col>
                                    <Col md="1">
                                    </Col>
                                </Row>
                                
                        </Form>  
                    </Modal>
                }
                
                {!hasModal &&
                    <Form onSubmit={this.onFormSubmit} encType="multipart/form-data">
                        <Row>
                            <Col md="6">
                                <Input type="file" accept={accept} onChange={this.onChange} name="file" id="file"/>
                            </Col>
                            <Col md="2">
                                <Button type="submit" color="primary" disabled={!file}> Upload </Button>
                            </Col>
                            <Col md="2">
                                <Button type="reset" onClick={this.removeFile}> Cancel </Button>
                            </Col>
                            {fileUploaded && 
                                <Col md="2"> File uploaded!</Col>
                            }
                        </Row>
                    </Form> 
                }

            </div>
        );
    }
}

FileUpload.propTypes = {
    accept: PropTypes.string.isRequired,
    hasModal: PropTypes.bool.isRequired
};

export default FileUpload;