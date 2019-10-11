const Cas = require('express-cas-authentication');

class CasService {

    constructor() {
        this.casConfig = {
            cas_url: process.env.CAS_URL,
            service_url: process.env.CAS_SERVICE_URL,
        };
    }

    createConnection() {
        return new Cas({
            cas_url: this.casConfig.cas_url,
            service_url: this.casConfig.service_url,
            cas_version: '3.0',
            renew: false,
        });
    }
}

const service = new CasService();
module.exports = service;