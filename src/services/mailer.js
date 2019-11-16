const Email = require('email-templates');

class MailerService {
    constructor() {
        this.mailjet = require('node-mailjet').connect(
            process.env.MJ_PUBLIC_KEY,
            process.env.MJ_PRIVATE_KEY,
        );

        this.fromEmail = 'rpiaips@gmail.com';
        this.fromName = 'Team AIPS';
    }

    sendEmail(msgInfo, html) {
        return this.mailjet.post('send', {version: 'v3.1'}).request({
            Messages: [
                {
                    From: {Email: msgInfo.fromEmail},
                    To: [{Email: msgInfo.email, Name: msgInfo.name}],
                    Subject: msgInfo.subject,
                    HTMLPart: html,
                },
            ],
        });
    }

    sendOne(templateName, user, subject, title, content) {
        const email = new Email();

        const locals = {
            name: user.firstName || user.username,
            subject: subject,
            title: title,
            content: content,
        };
        const msgInfo = {
            email: user.email,
            fromEmail: this.fromEmail,
            fromName: this.fromName,
            subject: subject,
        };
    
        return Promise.all([
          email.render(`${templateName}/html`, locals),
        ])
            .then(([html]) => {
              return this.sendEmail(msgInfo, html);
            })
            .catch(console.error);
    }
}

const service = new MailerService();
module.exports = service;