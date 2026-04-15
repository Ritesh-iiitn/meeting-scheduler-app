let nodemailer;
let transporter;

try {
  nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} catch (e) {
  // Graceful fallback if nodemailer is not installed
  console.log("nodemailer is not installed. Mock mode activated.");
}

exports.sendBookingConfirmation = async (bookingDetails) => {
  if (!process.env.SMTP_HOST || !transporter) {
    console.log('Mock Email Sent: Booking Confirmed', bookingDetails);
    return;
  }
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@calendly-clone.com',
    to: bookingDetails.invitee_email,
    subject: `Confirmed: ${bookingDetails.event_title || 'Meeting'} with Host`,
    text: `Hi ${bookingDetails.invitee_name},\n\nYour booking is confirmed for ${new Date(bookingDetails.start_time).toLocaleString()}.\n\nAdditional notes: ${bookingDetails.notes || ''}\n\nThank you.`,
  };
  await transporter.sendMail(mailOptions);
};

exports.sendBookingCancellation = async (bookingDetails) => {
  if (!process.env.SMTP_HOST || !transporter) {
    console.log('Mock Email Sent: Booking Cancelled', bookingDetails);
    return;
  }
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@calendly-clone.com',
    to: bookingDetails.invitee_email,
    subject: `Cancelled: ${bookingDetails.event_title || 'Meeting'} with Host`,
    text: `Hi ${bookingDetails.invitee_name},\n\nYour booking for ${new Date(bookingDetails.start_time).toLocaleString()} has been cancelled.\n\nThank you.`,
  };
  await transporter.sendMail(mailOptions);
};
