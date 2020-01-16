import App, { Container } from 'next/app';
import React from 'react';

import Header from '../src/client/components/header';
import Footer from '../src/client/components/footer';

export default class MyApp extends App {
    static async getInitialProps({ Component, router, ctx }) {
        let pageProps = {};
    
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
            pageProps.user = ctx.req.session.user || {};
        }
    
        return { pageProps: pageProps };
    }

    render() {
        const { Component, pageProps } = this.props;
        const { user } = pageProps;

        return (
            <React.Fragment>
                <Header
                    user={user}
                />
                <Component {...pageProps} />
                <div className="pt-4">
                    <Footer />
                </div>
            </React.Fragment>
        );
    }
}