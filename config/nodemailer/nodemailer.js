const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "Rambiharipalacewebsite@gmail.com",
    pass: "febk anzo qdix lklm",
  },
});






// const transporter = nodemailer.createTransport({
//   host: 'mail.aggrabandhuss.org',
//   port: 587,
//   secure: false,
//   auth: {
//       user: 'send@aggrabandhuss.org',
//       pass: 'c[Z7KAs.ak!='
//   }
// });

// Function to send an email

async function sendEmail(email, subject, text) {
  try {
    let info = await transporter.sendMail({
      from: "Rambiharipalacewebsite@gmail.com",
      to: email,
      subject: subject,
      text: text
    });
    console.log('Message sent: %s', info.messageId);
    
    return info.messageId;
  } catch (error) {
    console.error('Error occurred while sending email:', error.message);
    throw error;
  }
}

module.exports = { sendEmail };
