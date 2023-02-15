//const mailchimp = require("@mailchimp/mailchimp_marketing");
const dotenv = require('dotenv');


dotenv.config();
const { Mailchimp_API_Key, Server} =
    process.env;

    const mailchimp = require('@mailchimp/mailchimp_transactional')('md-cXSV7tPCdKH7l27ZsdDc0Q');
// mailchimp.setConfig({
//   apiKey: Mailchimp_API_Key,
//   server: Server,
// });

async function run() {
  const response = await mailchimp.users.ping();
  console.log(response);
}

//run();

class SendMail {

  async  send(mailOptions) {
      const response = await mailchimp.users.ping();
      console.log(response);
        return response
    }
    async mail(template) {
        const response = await mailchimp.templates.publish(template)
        return response
    }

    async senders() {
        const response = await mailchimp.senders.list();
        console.log(response)
        return response
    }
}

module.exports= {SendMail}