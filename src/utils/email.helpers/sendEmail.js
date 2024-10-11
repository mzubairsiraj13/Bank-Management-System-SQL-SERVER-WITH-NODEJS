import nodeMailer from 'nodemailer';
import { EMAIL_TRANSPORT_CONFIG } from '../../constants.js';
import generateEmailBody from './generateEmailBody.js';



const transportConfig = (transportConfigOptions) => {

    if (transportConfigOptions.isServiceMode) {
        return  nodeMailer.createTransport({
            service: transportConfigOptions.serivce,
            auth: {
                user: transportConfigOptions.user,
                pass: transportConfigOptions.password
            },
            tls: transportConfigOptions.tls,
            secure: transportConfigOptions.secure
    })

    return nodeMailer.createTransport({
        host: transportConfigOptions.host,
        port: transportConfigOptions.port,
        secure: transportConfigOptions.secure,
        auth: {
            user: transportConfigOptions.user,
            pass: transportConfigOptions.password
        },
        tls: transportConfigOptions.tls

    })
}
    
}
const sendEmail= async (emailSendTo, subject, otpCode, userName, emailType) => {

    try {
        const mailOptions = {
            from: EMAIL_TRANSPORT_CONFIG.user, 
            to : emailSendTo,                         
            subject,                   
            html: generateEmailBody(userName, otpCode, emailType, true), 
          };
          const transporter = transportConfig(EMAIL_TRANSPORT_CONFIG);
        
          const mailResponse = await transporter.sendMail(mailOptions);
          return mailResponse;
          
          
    } catch (error) {
        console.error('Error sending email:', error);
    }

}


export default sendEmail;