const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const nodemailerSendgrid = require('nodemailer-sendgrid');


dotenv.config();
const { GMAIL_HOST, GMAIL_USERNAME, GMAIL_PASSWORD, ENV, Sendgrid } =
    process.env;
  
    function mail() {
        let transporter;
        if (ENV == "prod") {
          transporter = nodemailer.createTransport(
            nodemailerSendgrid({
              apiKey:
              Sendgrid ,
            })
          );
        } else {
          transporter = nodemailer.createTransport({
            host: GMAIL_HOST,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: GMAIL_USERNAME, // generated ethereal user
              pass: GMAIL_PASSWORD, // generated ethereal password
            },
            tls: { rejectUnauthorized: false },
          });
        }
      
        return transporter;
}
      

class SendMail {
  send(mailOptions) {
      mail().sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("preview URL: %s", nodemailer.getTestMessageUrl(info));
      });
    }
}


  
module.exports= {SendMail}