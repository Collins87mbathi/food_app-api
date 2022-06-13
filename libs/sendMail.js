const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const sendEmail = async (email,url,txt) => {

    try {
     
     let transporter = nodemailer.createTransport({
         service:"gmail",
         host:"smtp.gmail.com",
         port:465,
         secure:true, // true for 465 , false for other ports
         
         auth: {
             user:process.env.USER, //username
             pass:process.env.PASSWORD, //user password
         },


     });
     
     await transporter.sendMail({
         from:process.env.USER,
         to:email,
         subject:"perez foods",
         html: `
         <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
         <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to perez foods.</h2>
         <p>Congratulations! You're almost set to start using perez foods application.
             Just click the button below to validate your email address.
         </p>
         
         <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
     
         <p>If the button doesn't work for any reason, you can also click on the link below:</p>
     
         <div>${url}</div>
         </div>
     `
     });
     console.log("email sent successfully");

    } catch (err) {
    console.log("email not sent");        
    console.log(err);

    }



};

module.exports = sendEmail;