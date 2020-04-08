import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Media, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from 'reactstrap';

class FileUpload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            modal: false,
            unmountOnClose: false,
            fileUploaded: false
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
        this.setState({file: e.target.files[0]});
    }

    toggleModal()
    {
        this.setState({modal: !this.state.modal});
    }

    removeFile()
    {
        this.setState({file: null, fileUploaded: false});
    }

    render() 
    {
        const {modal, unmountOnClose, file, fileUploaded} = this.state;
        const {accept, currentImage, hasModal, groupID, csrfToken} = this.props;
        const imgStyle = {
            maxHeight: 256,
            maxWidth: 512
          }
        return (
            <div>
                {hasModal &&
                    <Media left onClick={this.toggleModal}>
                        <Media object rounded fluid src={currentImage} style={imgStyle} alt="Group placeholder image" className="border rounded border-dark"></Media>
                    </Media>
                }
                {hasModal &&
                    <Modal isOpen={modal} toggle={this.toggleModal} unmountOnClose={unmountOnClose}>
                        <Form action="/group/setImage" encType="multipart/form-data" method="POST">
                            <ModalHeader toggle={this.toggle}>Upload File</ModalHeader>
                            <ModalBody>
                                <Input type="hidden" name="_csrf" value={csrfToken}/>
                                <Input type="hidden" name="groupId" value={groupID} />
                                <Input type="file" accept={accept} onChange={this.onChange} name="myFile" id="myFile"/>
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" color="primary" disabled={!file} onClick={this.toggleModal}> Upload </Button>
                                <Button onClick={this.toggleModal}> Cancel </Button>
                            </ModalFooter>
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