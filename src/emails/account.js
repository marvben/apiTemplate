const { resolve } = require("path");
require("dotenv").config({ path: resolve(__dirname, "../src/config/.env") });
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (newUserEmail, newUsername) => {
  try {
    await sgMail.send({
      to: newUserEmail,
      from: "test@example.com", // Use the email address or domain you verified above
      subject: `Welcome ${newUsername} to the Aboki Family`,
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    });
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

const sendGoodbyeEmail = async (newUserEmail, newUsername) => {
  try {
    await sgMail.send({
      to: newUserEmail,
      from: "test@example.com", // Use the email address or domain you verified above
      subject: `Sad to see you go ${newUsername}.The Aboki Family will miss you `,
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    });
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = { sendWelcomeEmail, sendGoodbyeEmail };
