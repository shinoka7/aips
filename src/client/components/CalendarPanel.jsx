import React from 'react';
import PropTypes from 'prop-types';

import { Col, Row, Card, CardBody, CustomInput, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import Swal from 'sweetalert2';

import FileUpload from './FileUpload.jsx';

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
                repeats: 'Never',
                customImage: null
            },
            selectedEvent: {},
            showCustomDates: false,
            repeatDropdownOpen: false,
            currentImage: "/resources/img/default/default_group.png"
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
        this.setRepeats = this.setRepeats.bind(this);
        this.toggleAllDay = this.toggleAllDay.bind(this);
        this.addToGoogleCalendarHandler = this.addToGoogleCalendarHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
        this.setCustomImage = this.setCustomImage.bind(this);
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
                    startTime: '00:00',
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

    setRepeats(e) {
        const repeats = e.target.value;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                repeats: repeats,
            }
        }));
    }

    setCustomImage(file)
    {
        console.log(file.name, file.type)
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                customImage: file,
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

    async createHandler() {
        const { groupId, startDate, startTime, endDate, endTime, name, description, imageName, repeats, customImage } = this.state.newEvent;
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
            _csrf: this.props.csrfToken,
            customImage: customImage
        });
        window.location.reload();
    }

    async deleteHandler() {
        const { selectedEvent } = this.state;
        const params = {
            eventId: selectedEvent.id,
            _csrf: this.props.csrfToken,
        };

        await Swal.fire({
            title: 'Delete Event',
            type: 'warning',
            text: 'Are you sure that you want to permanently delete this item',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#d33',
            cancelButtonColor: 'secondary',
            preConfirm: async() => {
                try {
                    return await axios.post('/event/delete', params);
                }
                catch(err) {
                    console.log(err);
                }
            }
        }).then((result) => {
            if (result.value) {
                Swal.fire(
                    'Deleted!',
                    'Your event has been deleted',
                    'success'
                ).then((res) => {
                    if (!res.dismiss) {
                        window.location.reload();
                    }
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Your event is safe',
                    'error'
                );
            }
        });
    }

    async addToGoogleCalendarHandler() {
        // https://developers.google.com/calendar/create-events
        // verify whether user is true && connected with google calendars
        // const { googleCalendar } = this.props;
        // const { selectedEvent } = this.state;
        // if (googleCalendar.events && selectedEvent.groupId) {
        //     const newEvent = {
        //         summary: selectedEvent.name,
        //         description: selectedEvent.description,
        //         organizer: {
        //             displayName: selectedEvent.Group.name,
        //             email: selectedEvent.Group.groupEmail
        //         },
        //         start: {
        //             date: selectedEvent.startDate
        //         },
        //         end: {
        //             date: selectedEvent.endDate
        //         },
        //     };
        //     await googleCalendar.Events.insert({
        //         calendarId: 'primary',
        //         resource: newEvent,
        //       }, function(err, newEvent) {
        //         if (err) {
        //           console.log('There was an error contacting the Calendar service: ' + err);
        //           return;
        //         }
        //         console.log('Event created: %s', newEvent.htmlLink);
        //       });
        // }
        // THIS ===================================================
        // https://www.npmjs.com/package/react-google-calendar-api
    }

    validate() {
        const { startDate, startTime, endDate, endTime, name, groupId } = this.state.newEvent;
        return startDate && startTime && endDate && endTime && name !== '' && groupId;
    }

    render() {
        const { events, newEvent, selectedEvent, showCustomDates, repeatDropdownOpen, currentImage } = this.state;
        const { modal, toggleCalendar, images, user, isUserInGroup, googleCalendar } = this.props;

        const groups = this.props.groups || [];
        const groupOptions = this.generateGroupOptions(groups);
        const generatedImages = this.generateImages(images);

        const googleButton = (
            <Button outline color="primary" onClick={this.addToGoogleCalendarHandler}>
                Add to <i className="fab fa-google"></i> <i className="fas fa-calendar-alt"></i>
            </Button>
        );

        return (
            <div>
                <Modal size="lg" isOpen={modal} toggle={toggleCalendar} unmountOnClose={this.state.unmountOnClose}>
                    <ModalBody>
                        <div className="pb-2">
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
                            <ModalHeader toggle={this.toggleEventForm}>New Event</ModalHeader>
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
                                        <FileUpload 
                                            uploadFile={this.setCustomImage} 
                                            accept="image/*"
                                            currentImage={currentImage}
                                            hasModal={false}>
                                        </FileUpload>
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
                                <ModalHeader close={googleButton}>{selectedEvent.name}</ModalHeader>
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
                                    <div className="text-right">
                                        Hosted by <a href={`/group/${selectedEvent.Group.id}`}>{selectedEvent.Group.name}</a>
                                    </div>
                                </ModalBody>
                                { isUserInGroup &&
                                    <ModalFooter>
                                        <Row>
                                            <Col xs="6" sm="6" md="6">
                                                <Button color="link"><i className="fas fa-user-edit"></i> Edit</Button>
                                            </Col>
                                            <Col xs="6" sm="6" md="6">
                                                <Button color="link" onClick={this.deleteHandler}><i className="fas fa-trash-alt"></i> Delete</Button>
                                            </Col>
                                        </Row>
                                    </ModalFooter>
                                }
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
    user: PropTypes.object.isRequired,
    isUserInGroup: PropTypes.bool,
    googleCalendar: PropTypes.object.isRequired,
}

export default CalendarPanel;