import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardBody, Row, Col, Table } from 'reactstrap';

/* This component manages and renders the group detail
panel ('General' tab) for an individual group's show page,
containing group information and a list of group members. */
class DetailPanel extends React.Component {

    constructor(props) {
        super(props);

        this.generateMemberList = this.generateMemberList.bind(this);
        this.generateName = this.generateName.bind(this);
    }

    /* This function generates a display name for member of the
    group, taking into account whether or not first name and last name fields
    are specified by the user in their profile page. */
    generateName(member)
    {
        let str = "";
        if (member.firstName === null && member.lastName === null)
            return "No name specified"
        if (member.firstName !== null)
            str += member.firstName;
        if (member.firstName !== null && member.lastName !== null)
            str += " "
        if (member.lastName !== null)
            str += member.lastName;
        return str;
    }

    /* This function generates the full list of a group's members 
    as table rows containing a member's role, username, and name. */
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
                        {this.generateName(member)}
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
                            { group.groupEmail != "" &&
                              <pre>{group.groupEmail}</pre>
                            }
                            <b>Website</b><br />
                            { group.website != "" &&
                                <pre><a href={group.website}>{group.website}</a></pre>
                            }
                            { group.website == "" &&
                                 <pre></pre>
                            }
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