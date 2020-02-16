import React from 'react';
import PropTypes from 'prop-types';

class Preview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentEvent: 0,
            calendarIsOpen: false,
            detailModal: false,
        };

        // Swap events every 10 seconds
        this.timer = 10000;
        this.toggleEventDetails = this.toggleEventDetails.bind(this);
    }

    // Advance the slider to the next event
    advance() {
        this.setState((state) => {
            if (state.currentEvent >= this.props.events.length - 1)
                return {currentEvent: 0};
            return {currentEvent: state.currentEvent + 1};
        });

        setTimeout(this.advance.bind(this), this.timer);
    }

    componentDidMount() {
        setTimeout(this.advance.bind(this), this.timer);
    }

    async toggleEventDetails(e) {
        const selectedEvent = await this.props.events.filter((event) => (
            event.name === e.title
        ));
        await this.setState({ selectedEvent: selectedEvent[0], detailModal: !this.state.detailModal });
    }

    render() {
        const { selectedEvent } = this.state;
        const { events } = this.props;
        let event = events[this.state.currentEvent];

        if (event == null) {
            event = {
                imagePath: "",
                startDate: "01-01-1969",
                startTime: "0:00",
                name: "Hmm... Nothing going on this week",
                description: "Add your event here",
                Group: {
                    name: "Display Calendar"
                }
            }
        }

        const imagePath = "/resources/img/buildings/" + event.image;

        const blog_slider = (
            <div className="blog-slider">
                <div className="blog-slider__wrp swiper-wrapper">
                    <div className="blog-slider__item swiper-slide">
                        <div className="blog-slider__img">
                            <img src={imagePath} alt="Event Image"></img>
                        </div>
                        <div className="blog-slider__content">
                            <span className="blog-slider__code">
                                {event.startDate} at {event.startTime}
                            </span>
                            <div className="blog-slider__title">
                                <a href="/" onClick={this.toggleEventDetails}>{event.name}</a>
                            </div>
                            <div className="blog-slider__text">
                                { event.description.length > 175 &&
                                    event.description.slice(0,175) + '...'
                                }
                                { event.description.length <= 175 &&
                                    event.description
                                }
                            </div>
                            <div className="blog-slider__button">
                                <a href={`/group/${event.Group.id}`}>
                                    {event.Group.name}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="blog-slider__pagination"></div>
            </div>
        );

        return (
            <React.Fragment>
                {blog_slider}
                {/* { selectedEvent && selectedEvent.Group &&
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
                } */}
            </React.Fragment>
        );
    }
}

Preview.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Preview;
