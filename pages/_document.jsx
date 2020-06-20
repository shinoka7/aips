import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {

    static async getInitialProps(ctx) {
      const initialProps = await Document.getInitialProps(ctx);
      return { ...initialProps };
    }

    render() {
      return (
        <html lang="en">
          <Head>
            <title>AIPS</title>

            {/* <!-- Iconset: Font Awesome 5.0.13 via CDN --> */}
            <link href="//use.fontawesome.com/releases/v5.0.13/css/all.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />

            {/* Bootstrap */}
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossOrigin="anonymous" />
            <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js" integrity="sha384-cs/chFZiN24E4KMATLdqdvsezGxaGsi4hLGOzlXwp5UZB1LY//20VyM2taTB4QvJ" crossOrigin="anonymous"></script>

            <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js" integrity="sha384-uefMccjFJAIv6A+rW+L4AHf99KvxDjWSu1z9VI8SKNVmz4sk7buKt/6v9KI65qnm" crossOrigin="anonymous"></script>

            {/* Polyfill */}
            <script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.js"></script>

            {/* React Big Calendar */}
            <link href="https://cdn.jsdelivr.net/npm/react-big-calendar@0.19.0/lib/css/react-big-calendar.css" rel="stylesheet"/>

            {/* Sass files */}
            <link rel="stylesheet" href="../resources/styles/css/aips.css"/>

          </Head>
          <body className="pt-5">
            <Main />
            <NextScript />
          </body>
        </html>
      );
    }
  }
