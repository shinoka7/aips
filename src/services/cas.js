const CASAuthentication = require('express-cas-authentication');

const service = new CASAuthentication({
    cas_url: process.env.CAS_URL,
    service_url: process.env.CAS_SERVICE_URL,
    renew: false,
    session_name: 'cas_user',
    session_info: 'cas_userinfo',
    cas_version: '3.0',
});

module.exports = service;