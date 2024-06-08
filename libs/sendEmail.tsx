import { Resend } from "resend";

export const sendNotificationEmail = async (
  email: string,

  message: string,
) => {
  const resend = new Resend(process.env.RESEND_API);

  console.log(email);
  // the content of the email
  const emailData = {
    from: "Admin <admin@arfix-code.my.id>",
    to: email,
    subject: "Notification",
    html: `
        <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }
            .container {
                width: 100%;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
                background-color: #007BFF;
                color: #ffffff;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
            }
            .content {
                padding: 20px;
                line-height: 1.6;
            }
            .content p {
                margin: 0 0 10px;
            }
            .btn {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                color: #ffffff;
                background-color: #28a745;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                padding: 10px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Monitoring PH dan SUHU AIR</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>${message}</p>
               
            </div>
            <div class="footer">
                <p>&copy; 2024 Your Company. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
      `,
  };

  try {
    // send the email
    await resend.emails.send(emailData);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};
