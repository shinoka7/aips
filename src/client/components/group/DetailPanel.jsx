import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardBody, Row, Col, Table } from 'reactstrap';

class DetailPanel extends React.Component {


    render() {
        const { group } = this.props;

        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col xs="6" sm="6" md="6">
                            <b>Email</b><br />
                            {group.groupEmail}<br />
                            <b>Website</b><br />
                            {group.website}<br />
                            <b>Statement of Purpose/Mission</b><br />
                            {group.statement}<br />
                            <b>Usual Meeting Day</b><br />
                            {group.meetingDay}<br />
                            <b>Usual Meeting Time</b><br />
                            {group.meetingTime}<br />
                            <b>Usual Meeting Place</b><br />
                            {group.meetingPlace}<br />
                        </Col>
                        <Col xs="6" sm="6" md="6">
                            <b>Current Positions</b>
                            <Table striped>
                            <thead>
                                <tr>
                                    <th>Role</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {groupList} */}
                            </tbody>
                            </Table>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

DetailPanel.propTypes = {
    group: PropTypes.object.isRequired,
};

export default DetailPanel;