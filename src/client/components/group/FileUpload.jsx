import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Media, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class FileUpload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: null,
            modal: false,
            unmountOnClose: false
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
        this.setState({modal: false});
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
        this.setState({file: null});
    }

    render() 
    {
        const {modal, unmountOnClose, file} = this.state;
        const {accept, currentImage, hasModal} = this.props;
        return (
            <div>
                {hasModal &&
                    <Media left onClick={this.toggleModal}>
                        <Media object src={currentImage} alt="Group placeholder image" className="border rounded border-dark"></Media>
                    </Media>
                }
                {hasModal &&
                    <Modal isOpen={modal} toggle={this.toggleModal} unmountOnClose={unmountOnClose}>
                        <Form onSubmit={this.onFormSubmit}>
                            <ModalHeader toggle={this.toggle}>Upload File</ModalHeader>
                            <ModalBody> 
                                <Input type="file" accept={accept} onChange={this.onChange} />
                            </ModalBody>
                            <ModalFooter>
                                <Button type="submit" color="primary" disabled={!file}> Upload </Button>
                                <Button onClick={this.toggleModal}> Cancel </Button>
                            </ModalFooter>
                        </Form>  
                    </Modal>
                }
                
                {!hasModal &&
                    <Form onSubmit={this.onFormSubmit}>
                        <Input type="file" accept={accept} onChange={this.onChange} />
                        <Button type="submit" color="primary" disabled={!file}> Upload </Button>
                        <Button type="reset" onClick={this.removeFile}> Cancel </Button>
                    </Form> 
                }

            </div>
        );
    }
}

FileUpload.propTypes = {
    uploadFile: PropTypes.func.isRequired,
    accept: PropTypes.string.isRequired
};

export default FileUpload;