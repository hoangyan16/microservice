'use strict' 
const transporter = require('../utils/nodeMailer');

// SendMailToVerify
exports.sendMailVerify = async (host, email, token, user_name) => {
    let to_email = email;
    var url = "http://" + host + "/" + token;
    let mailOptions = {
        from: process.env.EMAIL,
        to: to_email,
        subject: 'Password help has arrived!',
        text: `Click to verify: ${url}`,
        html: `<div style="text-align: center">
   <h2 style="font-size: 24px; margin-bottom: 16px">Chào: <span style="font-weight: 600; color: #09B1BA">${user_name}</span> !</h2>
   <h2 style="font-size: 22px; margin-bottom: 24px">Nhấn vào đường dẫn bên dưới để xác nhận !</h2>
   <button style="padding: 10px 26px; background: #ffffff; border: 1px solid #09B1BA; border-radius:8px"><a style="text-decoration: none; color: #09B1BA; font-size: 22px; font-weight: 600" href="${url}">Xác nhận</a></button>
 </div>`
    };
    const contentMail = await transporter.sendMail(mailOptions);
    return contentMail;
};
