import React from 'react';
import PropTypes from 'prop-types';

import { Col, Row, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';

const localizer = momentLocalizer(moment);

class CalendarPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formModal: false,
            detailModal: false,
            unmountOnClose: false,
            events: [],
            newEvent: {
                groupId: undefined,
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                name: '',
                description: '',
                imageName: '',
            },
            selectedEvent: {},
        };

        this.convertISOToCalendarFormat = this.convertISOToCalendarFormat.bind(this);
        this.toggleEventForm = this.toggleEventForm.bind(this);
        this.toggleEventDetails = this.toggleEventDetails.bind(this);
        this.generateGroupOptions = this.generateGroupOptions.bind(this);
        this.generateImages = this.generateImages.bind(this);
        this.setGroupId = this.setGroupId.bind(this);
        this.setName = this.setName.bind(this);
        this.setStartDate = this.setStartDate.bind(this);
        this.setStartTime = this.setStartTime.bind(this);
        this.setEndDate = this.setEndDate.bind(this);
        this.setEndTime = this.setEndTime.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.setImage = this.setImage.bind(this);
        this.createHandler = this.createHandler.bind(this);
        this.validate = this.validate.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const events = props.events.map((event) => {

            const start = convertStringsToInsertFormat(event.startDate, event.startTime);
            const end = convertStringsToInsertFormat(event.endDate, event.endTime);

            return (
                {
                    start: start,
                    end: end,
                    title: event.name,
                }
            );
        });
        
        return { events: events };
    }

    // returns ISO format to mm/dd/yyyy format
    convertISOToCalendarFormat(ISOdate) {
        const isoArray = ISOdate.toString().split(' ');
        let day = isoArray[2];
        const monthStr = isoArray[1];
        const year = isoArray[3];

        const month = convertMonthStringtoNumber(monthStr);

        day = day.length === 2 ? day : '0' + day;

        return year + '-' + month + '-' + day;
    }

    toggleEventForm(e) {
        if (e.start && e.end) {
            const startDate = this.convertISOToCalendarFormat(e.start);
            const endDate = this.convertISOToCalendarFormat(e.end);
            this.setState((prevState) => ({
                newEvent: {
                    ...prevState.newEvent,
                    startDate: startDate,
                    startTime: '08:00',
                    endDate: endDate,
                    endTime: '23:59',
                }
            }));
        }

        this.setState({ formModal: !this.state.formModal });
    }

    async toggleEventDetails(e) {
        const selectedEvent = await this.props.events.filter((event) => (
            event.name === e.title
        ));
        await this.setState({ selectedEvent: selectedEvent[0], detailModal: !this.state.detailModal });
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
            return (
                <option key={image} value={image}>{image}</option>
            );
        });
    }
    
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
        }))
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
    
    async createHandler() {
        const { groupId, startDate, startTime, endDate, endTime, name, description, imageName } = this.state.newEvent;
        const res = await axios.post('/event', {
            groupId,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            name,
            description,
            image: imageName,
            _csrf: this.props.csrfToken
        });
        window.location.reload();
    }

    validate() {
        const { startDate, startTime, endDate, endTime, name, groupId } = this.state.newEvent;
        return startDate && startTime && endDate && endTime && name !== '' && groupId;
    }

    render() {
        const { events, newEvent, selectedEvent } = this.state;
        const { modal, toggleCalendar, images } = this.props;

        const groups = this.props.groups || [];
        const groupOptions = this.generateGroupOptions(groups);
        const generatedImages = this.generateImages(images);

        return (
            <div>
                <Modal size="lg" isOpen={modal} toggle={toggleCalendar} unmountOnClose={this.state.unmountOnClose}>
                    <ModalBody>
                        <div className="pb-5 mb-2">
                            <Calendar 
                                localizer={localizer}
                                defaultDate={new Date()}
                                defaultView="month"
                                events={events}
                                style={{ height: "80vh" }}
                                views={[ 'month', 'day' ]}
                                selectable={true}
                                onSelectSlot={this.toggleEventForm}
                                onSelectEvent={this.toggleEventDetails}
                            />
                        </div>
                        <Modal isOpen={this.state.formModal} toggle={this.toggleEventForm} unmountOnClose={this.state.unmountOnClose}>
                            <ModalHeader toggle={this.toggleEventForm}>Create Event</ModalHeader>
                            <ModalBody>
                                <AvForm>
                                    <AvField
                                        type="select"
                                        name="group"
                                        label="Group"
                                        helpMessage="Choose the group you will create as"
                                        onChange={this.setGroupId}
                                        value={'default'}
                                    >
                                        <option value="default" disabled>--Select the Group--</option>
                                        {groupOptions}
                                    </AvField>
                                </AvForm>
                                <Form>
                                    <FormGroup>
                                        <Label for="name">Event Name :</Label>
                                        <Input type="text" name="name" id="name" onChange={this.setName} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="6" sm="6" md="6">
                                                <Label for="startDate">Start Date :</Label>
                                                <Input type="date" name="startDate" id="startDate" value={newEvent.startDate} onChange={this.setStartDate} />
                                            </Col>
                                            <Col xs="6" sm="6" md="6">
                                                <Label for="startTime">Start Time :</Label>
                                                <Input type="time" name="startTime" id="startTime" value={newEvent.startTime} onChange={this.setStartTime} />
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Row>
                                            <Col xs="6" sm="6" md="6">
                                                <Label for="endDate">End Date :</Label>
                                                <Input type="date" name="endDate" id="endDate" value={newEvent.endDate} onChange={this.setEndDate} />
                                            </Col>
                                            <Col xs="6" sm="6" md="6">
                                                <Label for="endTime">End Time :</Label>
                                                <Input type="time" name="endTime" id="endTime" value={newEvent.endTime} onChange={this.setEndTime} />
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="description">Description :</Label>
                                        <Input type="textarea" name="description" id="description" placeholder="Event Details" onChange={this.setDescription} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="image">Event Image :</Label>
                                        <Input type="select" name="image" id="image" value={newEvent.imageName === '' ? 'default' : newEvent.imageName} onChange={this.setImage} >
                                            <option value="default" disabled>--Select an Image--</option>
                                            {generatedImages}
                                        </Input>
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
                                <Button onClick={this.toggleEventForm} color="secondary">Cancel</Button>
                            </ModalFooter>
                        </Modal>
                        { selectedEvent && selectedEvent.Group &&
                            <Modal isOpen={this.state.detailModal} toggle={this.toggleEventDetails} unmountOnClose={this.state.unmountOnClose}>
                                <ModalHeader>{selectedEvent.name}</ModalHeader>
                                <ModalBody>
                                    { selectedEvent.image !== '' &&
                                        <div>
                                            <img src={`/resources/img/buildings/${selectedEvent.image}`} className="image_preview" alt="Event Image"></img>
                                            <hr />
                                        </div>
                                    }
                                    <b>
                                    <h5>{selectedEvent.description}</h5>
                                    <br />
                                    Starts: [{selectedEvent.startDate}] at {selectedEvent.startTime}
                                    <br />
                                    Ends: [{selectedEvent.endDate}] at {selectedEvent.endTime}
                                    </b>
                                    <br />
                                    <div className="text-right">
                                        Hosted by <a href={`/group/${selectedEvent.Group.id}`}>{selectedEvent.Group.name}</a>
                                    </div>
                                </ModalBody>
                            </Modal>
                        }
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

// returns new Date Type
function convertStringsToInsertFormat(date, time) {
    // yyyy/MM/dd to [yyyy, MM, dd]
    const dateArray = date.split('-');
    // hh:mm to [hh, mm]
    const timeArray = time.split(':');

    return new Date(
        Number(dateArray[0]),
        Number(dateArray[1] - 1),
        Number(dateArray[2]),
        Number(timeArray[0]),
        Number(timeArray[1])
        );
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

CalendarPanel.propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    csrfToken: PropTypes.string.isRequired,
    toggleCalendar: PropTypes.func.isRequired,
    modal: PropTypes.bool.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default CalendarPanel;