const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  host:'smtp.gmail.com',
  port:465,
  secure:true,
  auth: {
    type: 'OAuth2',
    user: `hoangyan16@gmail.com`,
    pass: `phamhoangan131299`,
    clientId: `820691792077-s7f5itp23bgh7gcroj65sr852b29f9a1.apps.googleusercontent.com`,
    clientSecret: `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`,
    refreshToken: `1//04sUnzqGkarn1CgYIARAAGAQSNwF-L9IrnH9XEZeSH5ztVh8IX_usXdyKqYKqFTfgeceBj3uF4XMCIo3BkJWh-RbhmZu9E9iulbA`
},
    tls: {
        rejectUnauthorized: false
    }
});
transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
});

module.exports = transporter;
