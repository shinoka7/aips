import React from 'react';
import { Input, Button } from 'reactstrap';

export default class extends React.Component {
    
    static async getInitialProps(context) {
        return context.query || {};
    }

    render() {
        return (
            <div>
                <span>Login Page</span>
                <hr/>
                <div>
                    <form action="/auth/google" method="GET">
                        <Button className="btn btn-primary"><i className="fab fa-google"></i> Login with Google</Button>
                    </form>
                    <form actions="/auth/cas" method="GET">
                        <Button className="btn btn-primary"><i className="rpi-icon"> Login with CAS</i></Button>
                    </form>
                </div>
            </div>
        );
    }

}