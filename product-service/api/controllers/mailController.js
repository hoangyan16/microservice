'use strict'
//const messageContants = require('../constants/messageContants');
const transporter = require('../utils/nodeMailer');

// Send Mail mẫu chung
exports.sendMail = async (req, res) => {
    const data = req.body.email;
    const filename = 'dataset-1.csv';
    const path = `${__basedir}/api/resources/${filename}`;
    for (var i = 0; i < data.length; i++) {
        let to_email = `${
            data[i]
        }`;
        let mailOptions = {
            from: process.env.EMAIL,
            to: to_email,
            subject: 'Gửi mail mẫu chung!',
            html: `<div >
              <p>Xác nhận đăng ký thành công</p>
              <p>Xác nhận bạn đã đăng ký thành công.</p>
              <br>
              <p>Trân trọng cảm ơn và hẹn gặp lại,</p>
              <br>
              </div>`,
            attachments: [
                {
                    filename: filename,
                    path: path
                },
            ]
        };
        const contentMail = await transporter.sendMail(mailOptions);
        if (contentMail.accepted.length > 0) {
            res.status(200).json({error: 0, message: "Success", data_success: contentMail.accepted, data_failure: contentMail.rejected});
        } else {
            res.status(400).json({error: 1, message: "Failed", data: contentMail.response});
        }
    }
};
