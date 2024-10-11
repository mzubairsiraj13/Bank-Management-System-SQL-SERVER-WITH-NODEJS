const generateEmailBody = (userName, otpCode, emailType, isHtml = true) => {
  const textBody = emailType === 'verification' ? `
    Dear ${userName},
    
    We’ve received a request to activate your account. Please use the following OTP to complete the activation process:
    
    OTP: ${otpCode}
    
    If you requested account activation, please enter this code in the activation form on our website.
    
    Important:
    - This code is valid for 10 minutes. After this time, it will expire for security reasons.
    - If you didn’t request this action, please disregard this email. Your account is safe.
    
    For further assistance, please contact our support team at support@sbl.com.
    
    Thank you,
    The SBL Team
    www.sbl.com
  ` : `
    Dear ${userName},
    
    Congratulations! Your account has been successfully activated.
    
    You can now log in and start using your account with us.
    
    If you have any questions or need assistance, please contact our support team at support@sbl.com.
    
    Thank you for choosing SBL!
    
    Best regards,
    The SBL Team
    www.sbl.com
  `;

  const htmlBody = emailType === 'verification' ? `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="text-align: center; color: #007bff;">Hello ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            We’ve received a request to activate your account. Please use the following OTP to complete the activation process:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <h3 style="font-size: 24px; color: #007bff; margin: 0;">${otpCode}</h3>
          </div>
          <p style="font-size: 16px; line-height: 1.6;">
            If you requested account activation, please enter this code in the activation form on our website.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            <strong>Important:</strong><br>
            - This code is valid for 10 minutes. After this time, it will expire for security reasons.<br>
            - If you didn’t request this action, please disregard this email. Your account is safe.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            For further assistance, please contact our support team at <a href="mailto:support@sbl.com" style="color: #007bff; text-decoration: none;">support@sbl.com</a>.
          </p>
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
            Thank you,<br>
            The SBL Team<br>
            <a href="http://www.sbl.com" style="color: #007bff; text-decoration: none;">www.sbl.com</a>
          </p>
        </div>
      </body>
    </html>
  ` : `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
          <h2 style="text-align: center; color: #007bff;">Hello ${userName},</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Congratulations! Your account has been successfully activated.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            You can now log in and start using your account with us.
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            For further assistance, please contact our support team at <a href="mailto:support@sbl.com" style="color: #007bff; text-decoration: none;">support@sbl.com</a>.
          </p>
          <p style="font-size: 16px; line-height: 1.6; text-align: center;">
            Thank you for choosing SBL!<br>
            The SBL Team<br>
            <a href="http://www.sbl.com" style="color: #007bff; text-decoration: none;">www.sbl.com</a>
          </p>
        </div>
      </body>
    </html>
  `;

  return isHtml ? htmlBody : textBody;
};

export default generateEmailBody;

  