import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardBody, Row, Col, Table } from 'reactstrap';

class DetailPanel extends React.Component {

    constructor(props) {
        super(props);

        this.generateMemberList = this.generateMemberList.bind(this);

    }

    generateMemberList(group, members)
    {
        return members.map((member) => {
            return (
                <tr key={member.id}>
                    <td>
                        {group.adminUserId === member.id &&
                            "Owner"
                        }
                        {group.adminUserId !== member.id &&
                            "Member"
                        }
                    </td>
                    <td>
                        {member.username}
                    </td>
                    <td>
                        {member.firstName + " " + member.lastName|| "No name specified."}
                    </td>
                </tr>
            );
        });
    }

    render() {
        const { group, members } = this.props;
        const memberList = this.generateMemberList(group, members);

        return (
            <Card>
                <CardBody>
                    <Row>
                        <Col xs="6" sm="6" md="6">
                            <b>Email</b><br />
                            <pre>{group.groupEmail}</pre>
                            <b>Website</b><br />
                            <pre><a href={group.website}>{group.website}</a></pre>
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
                                    <th>Username</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                { memberList }
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