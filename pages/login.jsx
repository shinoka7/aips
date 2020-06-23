import React from 'react';
import { Input, Button } from 'reactstrap';

/* This component renders the login page, which currently
allows users to log in via RPI's CAS (RCSID and password). */
export default class extends React.Component {

    static async getInitialProps(context) {
        return context.query || {};
    }

    render() {
        return (
            <div className="about col-sm-12 col-md-4 offset-md-4">
                <h4>Login</h4>
                <hr/>
                <div>
                    {/* <form action="/auth/google" method="GET">
                            <Button block className="btn btn-primary"><i className="fab fa-google"></i> Login with Google</Button>
                        </form> */}
                    {/* This form redirects users to the RPI CAS login page. */}
                    <form action="/auth/cas" method="GET">
                        {/* <input type="hidden" name="returnTo" value="/auth/cas/callback" /> */}
                        <Button block className="btn btn-primary"><img className="icon" alt="RPI" src="/resources/img/RPI.png" /> Login with CAS</Button>
                    </form>
                </div>
            </div>
        );
    }

}
