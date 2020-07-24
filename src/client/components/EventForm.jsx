import React from 'react';
import PropTypes from 'prop-types';

import { Col, Row, Card, CardBody, CustomInput, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import axios from 'axios';

/* This component manages and renders the event
creation form accessible through the calendar panel
on the main page menu and individual group pages. */
class EventForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formModal: false,
            unmountOnClose: false,
            newEvent: {
                groupId: undefined,
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                name: '',
                description: '',
                imageName: '',
                repeats: 'Never',
            },
            showCustomDates: false,
            repeatDropdownOpen: false,
        };

        this.convertISOToCalendarFormat = this.convertISOToCalendarFormat.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
        this.setGroupId = this.setGroupId.bind(this);
        this.generateGroupOptions = this.generateGroupOptions.bind(this);
        this.generateImages = this.generateImages.bind(this);
        this.setName = this.setName.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setStartTime = this.setStartTime.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.setEndTime = this.setEndTime.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.setImage = this.setImage.bind(this);
        this.validate = this.validate.bind(this);
        this.setRepeats = this.setRepeats.bind(this);
        this.toggleAllDay = this.toggleAllDay.bind(this);
        this.createHandler = this.createHandler.bind(this);
    }

    componentDidUpdate(prevProps){
        if(prevProps.formModal !== this.props.formModal){
            const { e } = this.props;
            if (e.start && e.end) {
                const startDate = this.convertISOToCalendarFormat(e.start);
                const endDate = this.convertISOToCalendarFormat(e.end);
                this.setState((prevState) => ({
                    newEvent: {
                        ...prevState.newEvent,
                        startDate: startDate,
                        startTime: '00:00',
                        endDate: endDate,
                        endTime: '23:59',
                    }
                }));
            }
            this.setState({ formModal: this.props.formModal });
        }
    }

    /* Returns ISO format to mm/dd/yyyy format */
    convertISOToCalendarFormat(ISOdate) {
        const isoArray = ISOdate.toString().split(' ');
        let day = isoArray[2];
        const monthStr = isoArray[1];
        const year = isoArray[3];

        const month = convertMonthStringtoNumber(monthStr);

        day = day.length === 2 ? day : '0' + day;

        return year + '-' + month + '-' + day;
    }

    /* This function initializes date and time values 
    for the event to be created and calls a function to toggle
    the form. */
    toggleForm() {
        const { e } = this.props;
        if (e.start && e.end) {
            const startDate = this.convertISOToCalendarFormat(e.start);
            const endDate = this.convertISOToCalendarFormat(e.end);
            this.setState((prevState) => ({
                newEvent: {
                    ...prevState.newEvent,
                    startDate: startDate,
                    startTime: '00:00',
                    endDate: endDate,
                    endTime: '23:59',
                }
            }));
        }
        this.props.toggleEventForm(e);
    }

    generateGroupOptions(groups) {
        const groupOptions = groups.map((group) => {
            return (
                <option key={group.id} value={group.id}>{group.name}</option>
            );
        });
        
        return groupOptions;
    }

    generateImages(images) {
        return images.map((image) => {
            const words = image.split('_');
            const imageName = words.map((word) => {
                const temp = word[0].toUpperCase()
                return temp + word.slice(1);
            });
            return (
                <option key={image} value={image}>{imageName.join(' ').slice(0,-4)}</option>
            );
        });
    }

    /* The following set of functions sets attributes for
    the new event when the form is changed. */
    setGroupId(e) {
        const groupId = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                groupId: groupId,
            }
        }));
    }

    setName(e) {
        const name = e.target.value.trim();
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                name: name,
            }
        }));
    }

    setStartDate(e) {
        const date = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                startDate: date,
            }
        }));
    }

    setStartTime(e) {
        const startTime = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                startTime: startTime,
            }
        }));
    }

    setEndDate(e) {
        const date = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                endDate: date,
            }
        }));
    }

    setEndTime(e) {
        const endTime = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                endTime: endTime,
            }
        }));
    }

    setDescription(e) {
        const description = e.target.value.trim();
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                description: description,
            }
        }));
    }

    setImage(e) {
        const imageName = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                imageName: imageName,
            }
        }));
    }

    setRepeats(e) {
        const repeats = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                repeats: repeats,
            }
        }));
    }

    toggleAllDay() {
        const { showCustomDates } = this.state;
        if (showCustomDates) {
            this.setState((prevState) => ({
                newEvent: {
                    ...prevState.newEvent,
                    startTime: '00:00',
                    endTime: '23:59',
                }
            }));
        }
        this.setState({ showCustomDates: !showCustomDates });
    }

    /* This function is used to determine when the
    event to be created is valid and disables the submit
    button if invalid. */
    validate() {
        const { startDate, startTime, endDate, endTime, name, groupId } = this.state.newEvent;
        return startDate && startTime && endDate && endTime && name !== '' && groupId;
    }

    /* This function calls a server request to create the event specified
    by the form fields and subsequently reloads the page. */
    async createHandler() {
        const { groupId, startDate, startTime, endDate, endTime, name, description, imageName, repeats } = this.state.newEvent;
        const res = await axios.post('/event', {
            groupId,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            name,
            description,
            image: imageName,
            repeats: repeats,
            _csrf: this.props.csrfToken
        });
        window.location.reload();
    }

    render() {
        const { showCustomDates, newEvent, repeatDropdownOpen } = this.state;
        const { images } = this.props;

        const groups = this.props.groups || [];
        const groupOptions = this.generateGroupOptions(groups);
        const generatedImages = this.generateImages(images);

        return (
            <Modal isOpen={this.state.formModal} toggle={this.toggleForm} unmountOnClose={this.state.unmountOnClose}>
                <ModalHeader toggle={this.toggleForm}>New Event</ModalHeader>
                <ModalBody>
                    <AvForm>
                        <AvField
                            type="select"
                            name="group"
                            helpMessage="Choose the group you will create as"
                            onChange={this.setGroupId}
                            value={'default'}
                        >
                            <option value="default" disabled>Select a Group</option>
                            {groupOptions}
                        </AvField>
                    </AvForm>
                    <Form>
                        <FormGroup>
                            <Input type="text" id="name" onChange={this.setName} placeholder="Title" />
                        </FormGroup>
                        <FormGroup>
                            <CustomInput type="checkbox" id="customCheckbox" label="All-day" checked={!showCustomDates} onChange={this.toggleAllDay} />
                        </FormGroup>
                        
                            <FormGroup>
                                <Row>
                                    <Col xs="2" sm="2" md="2">Starts</Col>
                                    { !showCustomDates &&
                                        <Col xs="10" sm="10" md="10">
                                            <Input type="date" id="startDate" value={newEvent.startDate} onChange={this.setStartDate} />
                                        </Col>
                                    }
                                    { showCustomDates &&
                                        <React.Fragment>
                                            <Col xs="5" sm="5" md="5">
                                                <Input type="date" id="startDate" value={newEvent.startDate} onChange={this.setStartDate} />
                                            </Col>
                                            <Col xs="5" sm="5" md="5">
                                                <Input type="time" id="startTime" value={newEvent.startTime} onChange={this.setStartTime} />
                                            </Col>
                                        </React.Fragment>
                                    }
                                </Row>
                                <Row>
                                    <Col xs="2" sm="2" md="2">Ends</Col>
                                    { !showCustomDates &&
                                        <Col xs="10" sm="10" md="10">
                                            <Input type="date" id="endDate" value={newEvent.endDate} onChange={this.setEndDate} />
                                        </Col>
                                    }
                                    { showCustomDates &&
                                        <React.Fragment>
                                            <Col xs="5" sm="5" md="5">
                                                <Input type="date" id="endDate" value={newEvent.endDate} onChange={this.setEndDate} />
                                            </Col>
                                            <Col xs="5" sm="5" md="5">
                                                <Input type="time" id="endTime" value={newEvent.endTime} onChange={this.setEndTime} />
                                            </Col>
                                        </React.Fragment>
                                    }
                                </Row>
                            </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col xs="2" sm="2" md="2">Repeat</Col>
                                <Col xs="10" sm="10" md="10">
                                    <Dropdown group isOpen={repeatDropdownOpen} size="sm" toggle={() => {this.setState({repeatDropdownOpen: !repeatDropdownOpen})}}>
                                        <DropdownToggle caret outline color="primary">
                                            {this.state.newEvent.repeats}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={this.setRepeats} value="Never">Never</DropdownItem>
                                            {/* Need to redesign event model, so that the same repeating event can be tracked from one of the scheduled events */}
                                            <DropdownItem onClick={this.setRepeats} value="Weekly" disabled>Weekly</DropdownItem>
                                            <DropdownItem onClick={this.setRepeats} value="Monthly" disabled>Monthly</DropdownItem>
                                            <DropdownItem onClick={this.setRepeats} value="Yearly" disabled>Yearly</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Input type="textarea" name="description" id="description" placeholder="Description" onChange={this.setDescription} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="image">Event Image :</Label>
                            <Input type="select" name="image" id="image" value={newEvent.imageName === '' ? "" : newEvent.imageName} onChange={this.setImage} >
                                <option value="">No Image</option>
                                {generatedImages}
                            </Input>
                            {/* <CustomInput type="file" id="exampleCustomFileBrowser" name="customFile" /> */}
                        </FormGroup>
                        { newEvent.imageName !== '' &&
                            <Card>
                                <CardBody>
                                    <img src={`/resources/img/buildings/${newEvent.imageName}`} className="image_preview" alt="Event Image"></img>
                                </CardBody>
                            </Card>
                        }
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.createHandler} color="primary" disabled={!this.validate()}>Post</Button>
                    <Button onClick={this.toggleForm} color="secondary">Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }

}

// returns e.g 'Dec' ==> 12 
function convertMonthStringtoNumber(string) {
    switch(string){
        case 'Jan':
            return '01';
        case 'Feb':
            return '02';
        case 'Mar':
            return '03';
        case 'Apr':
            return '04';
        case 'May':
            return '05';
        case 'Jun':
            return '06';
        case 'Jul':
            return '07';
        case 'Aug':
            return '08';
        case 'Sep':
            return '09';
        case 'Oct':
            return '10';
        case 'Nov':
            return '11';
        case 'Dec':
            return '12';
    }
}

EventForm.propTypes = {
    toggleEventForm: PropTypes.func.isRequired,
    formModal: PropTypes.bool.isRequired,
    e: PropTypes.object.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default EventForm;