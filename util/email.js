import nodemailer from 'nodemailer';
import { config } from '../config.js';

export function mailSender (data) {

  const {to_email, subject, content} = data;

  const transporter = nodemailer.createTransport({
      service: config.email.smtpService,   // 메일 보내는 곳
      port: config.email.smtpPort,
      host: config.email.smtpHost,  
      secure: false,  
      requireTLS: true ,
      auth: {
        user: config.email.smtpUser,  // 보내는 메일의 주소
        pass: config.email.smtpPassword   // 보내는 메일의 비밀번호
      }
    });
    // 메일 옵션
  const mailOptions = {
    from: config.email.smtpEmail,
    to: to_email, // 수신할 이메일
    subject,
    text: content
  };
    
  // 메일 발송    
  return transporter.sendMail(mailOptions, function (error, info) {

    // return error ? error : info.response;
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}
