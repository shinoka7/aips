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
                            <pre>{group.groupEmail}</pre>
                            <b>Website</b><br />
                            <pre>{group.website}</pre>
                            <b>Statement of Purpose/Mission</b><br />
                            <pre>{group.statement}</pre>
                            <b>Usual Meeting Day</b><br />
                            <pre>{group.meetingDay}</pre>
                            <b>Usual Meeting Time</b><br />
                            <pre>{group.meetingTime}</pre>
                            <b>Usual Meeting Place</b><br />
                            <pre>{group.meetingPlace}</pre>
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