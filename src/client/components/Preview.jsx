import React from 'react';
import PropTypes from 'prop-types';
import ListFeature from './ListFeature.jsx';
import Swiper from 'swiper';
import Switch from "react-switch";
import { Collapse, Button, ButtonGroup, Tooltip } from 'reactstrap';
class Preview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentEvent: 0,
            calendarIsOpen: false,
            detailModal: false,
            listView: false,
        };

        this.swiper = new Swiper('.blog-slider', {
            spaceBetween: 30,
            effect: 'fade',
            loop: true,
            mousewheel: {
              invert: false,
            },
            // autoHeight: true,
            pagination: {
              el: '.blog-slider__pagination',
              clickable: true,
            }
          });

        // Swap events every 10 seconds
        this.timer = 10000;
        //list mode feature
        this.toggleTheme = this.toggleTheme.bind(this);
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

    //function switches theme from list to !list
    toggleTheme() {
        this.setState({ listView: !this.state.listView });
    }

    render() {
        const { events } = this.props;
        const listView = this.state.listView;

        let event = events[this.state.currentEvent];
        let nullEvent = false;

        if (event == null) {
            event = {
                image: "defaultImage.png",
                startDate: "10-28-2015",
                startTime: "0:00",
                name: "Hmm... Nothing going on this week",
                description: "Add your event here",
                endDate: "10-28-2015",
                endTime: "11:59",
                private: false,
                Group: {
                    id: "#",
                    name: "Display Calendar"
                }
            }
            nullEvent = true;

        }

        const imagePath = event.image ? "/resources/img/buildings/" + event.image : "/resources/img/buildings/defaultImage.png";

        const blog_slider = (
            <div className="blog-slider">
                <div className="blog-slider__wrp swiper-wrapper">
                    <div className="blog-slider__item swiper-slide">
                        <div className="blog-slider__img">
                            <img src={imagePath} alt="Event Image"></img>
                        </div>
                        <div className="blog-slider__content">
                            <span className="blog-slider__code">{event.startDate} at {event.startTime}</span>
                            <div className="blog-slider__title"><a href="/" onClick={this.toggleEventDetails}>{event.name}</a></div>
                            <div className="blog-slider__text">
                                { event.description.length > 175 &&
                                    event.description.slice(0,175) + '...'
                                }
                                { event.description.length <= 175 &&
                                    event.description
                                }
                            </div>
                            <a href={`/group/${event.Group.id}`} className="blog-slider__button">
                                {event.Group.name}
                            </a>
                        </div>
                    </div>
                </div>
                <div className="blog-slider__pagination"></div>
            </div>
        );

        return (
                <div>
                  <div className = "d-flex flex-row-reverse pr-2 fixed-center pt-3">
                  {/* Toggle button that activates list view, disabled with no events */}
                    <Switch
                      aria-label = "Toggle theme change"
                      checked={listView}
                      uncheckedIcon = {false}
                      checkedIcon = {false}
                      onColor = {'#F32013'}
                      onChange={this.toggleTheme}
                      id= "list_toggle"
                      disabled={nullEvent}
                    />

                  </div>
                    <div>
                    { !listView &&
                      <div>
                      {blog_slider}
                      </div>
                    }
                    { listView &&
                      <div>
                      <ListFeature events = {this.props.events} />
                      </div>
                    }
                    </div>


                </div>

        );
    }
}

Preview.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Preview;
