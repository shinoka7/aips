import React from 'react';
import PropTypes from 'prop-types';

import { Row, Label, Col, Table } from 'reactstrap';

class GroupList extends React.Component {


    render() {
        const { groups } = this.props;
        const groupList = groups.map((group) => {
            return (
                <tr key={group.id}>
                    <th scope="row">{group.id}</th>
                    <td><a href={`/group/${group.id}`}>{group.name}</a></td>
                    <td>{group.groupEmail}</td>
                </tr>
            );
        });
        
        return (
            <div className="pl-4 pr-4 fixed-bottom pb-5">
                <Table striped dark bordered>
                    <thead>
                        <tr>
                            <th>Groups (id)</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupList}
                    </tbody>
                </Table>
            </div>
        );
    }
}

GroupList.propTypes = {
    groups: PropTypes.arrayOf(PropTypes.object),
};

export default GroupList;