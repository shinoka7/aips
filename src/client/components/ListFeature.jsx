/*  ListFeature.jsx
** displays events in a list format
*/


import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardBody,
    CardText, CardImg, Col, Row, Nav,
    Pagination, PaginationItem, PaginationLink,
    Badge } from 'reactstrap';


class ListFeature extends React.Component {
    constructor(props) {
        super(props);

    }
    /* Return display of every event in a list format */
    render() {
      const { events } = this.props;
      // Display an empty event if there are no events to display
      if (events === undefined || events.length == 0) {
        let event = {
            image: "defaultImage.png",
            startDate: "10-28-2015",
            startTime: "0:00",
            name: "Hmm... Nothing going on this week",
            description: "Add your event here",
            endDate: "10-28-2015",
            endTime: "11:59",
            Group: {
                id: "#",
                name: "Display Calendar"
            }
        };
        events.push(event);
      }
    // Only the next 6 upcoming events are shown, can't get scrollbar to work + showing all events at once
    // may cause website to crash if there are a lot of events. Cards will be hidden when the window gets too small
    // This should probably be changed to a carousel or a scrollbar.
     let eventRange = events.length < 6 ? events.length : 6;
     let newEvents = events.slice(0, eventRange);
         return (
          <div className= "list_box">
           { newEvents.map( tmp =>
             <div key={ tmp.name } className = "list_card">
               <div>
                 <div className="list_card_title">{tmp.name}</div>
                 <hr />
                 <span className="d-flex justify-content-between">
                   <img src={ "/resources/img/buildings/" + tmp.image } width = "100%"/>
                 </span>
                 <br />
                 <div className="d-flex justify-content-between">
                     { tmp.description.length > 25 &&
                         tmp.description.slice(0, 25) + '...'
                     }
                     { tmp.description.length <= 25 &&
                         tmp.description
                     }
                 </div>
                 <span className="d-flex justify-content-between"> from {tmp.startTime}, {tmp.startDate}</span>
                 <span className="d-flex justify-content-between"> to {tmp.endTime}, {tmp.endDate}</span>
                 < hr/>
                 Hosted by <a href={`/group/${tmp.Group.id}`}> {tmp.Group.name}</a>

               </div>
             </div>
           )}

          </div>
         );
   }


}

ListFeature.propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ListFeature;
