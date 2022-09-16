const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const path = require('path');
const { readFile } = require('fs/promises');

const sendMail = async (subject, to, text, html, data) => {
  const htmlFilePath = await readFile(
    path.join(__dirname, '..', 'public', 'html', html),
    'utf-8'
  );

  const template = handlebars.compile(htmlFilePath);

  const htmlToSend = template(data);

  // create Transport for sending emails
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // This EMAIL_PASSWORD is gotten from google app passwords
    },
  });

  const mailOptions = {
    from: 'HangoutPadie 📧 <h***@gmail.com>',
    to,
    subject,
    text,
    html: htmlToSend,
  };

  const result = await transport.sendMail(mailOptions);
};

module.exports = sendMail;
