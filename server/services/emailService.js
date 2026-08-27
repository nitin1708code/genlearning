const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// =========================================================
// COMMON EMAIL FUNCTION
// =========================================================

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend email error:", error);

      return {
        success: false,
        error,
      };
    }

    console.log("Email sent successfully:", data.id);

    return {
      success: true,
      messageId: data.id,
    };

  } catch (error) {
    console.error("Email sending error:", error);

    return {
      success: false,
      error,
    };
  }
};


// =========================================================
// MENTORING CONFIRMATION
// =========================================================

const sendMentoringConfirmation = async ({
  to,
  name,
  duration,
  date,
  time,
  price,
  paymentId,
}) => {

  return sendEmail({
    to,

    subject: "Mentoring Session Confirmed - GEN Learning",

    html: `
      <!DOCTYPE html>

      <html>
      <body style="
        margin: 0;
        padding: 0;
        background: #000;
        font-family: Arial, sans-serif;
        color: #fff;
      ">

        <div style="
          max-width: 600px;
          margin: 30px auto;
          padding: 30px;
          background: #111;
          border: 1px solid #333;
          border-radius: 12px;
        ">

          <h1 style="
            margin: 0 0 20px;
            font-size: 28px;
          ">
            GEN Learning
          </h1>

          <p style="font-size: 16px;">
            Hi ${name || "there"},
          </p>

          <p style="font-size: 16px; line-height: 1.6;">
            Your <strong>1:1 mentoring session</strong>
            has been successfully confirmed.
          </p>

          <div style="
            margin-top: 25px;
            padding: 20px;
            background: #181818;
            border: 1px solid #333;
            border-radius: 10px;
          ">

            <h2 style="margin-top: 0;">
              Session Details
            </h2>

            <p>
              <strong>Duration:</strong>
              ${duration}
            </p>

            <p>
              <strong>Date:</strong>
              ${date}
            </p>

            <p>
              <strong>Time:</strong>
              ${time}
            </p>

            <p>
              <strong>Amount Paid:</strong>
              ₹${price}
            </p>

            <p style="
              word-break: break-all;
            ">
              <strong>Payment ID:</strong>
              ${paymentId}
            </p>

          </div>

          <p style="
            margin-top: 25px;
            color: #aaa;
            line-height: 1.6;
          ">
            Thank you for choosing GEN Learning.
            We look forward to your mentoring session.
          </p>

          <p style="
            color: #777;
            font-size: 13px;
            margin-top: 30px;
          ">
            This is an automated confirmation email.
          </p>

        </div>

      </body>
      </html>
    `,
  });
};


// =========================================================
// EXPORT
// =========================================================

module.exports = {
  sendEmail,
  sendMentoringConfirmation,
};