require('dotenv').config()
const nodemailer = require('nodemailer')
const getHTML = require('../templates/email_html')

const sendMail = async (to, url) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: `"Tien Dat B1910206 Handsome 👨‍💻 <${process.env.EMAIL}>`,
            to: to,
            subject: "Do Not Reply - Email Verification ✔️",
            html: getHTML(url)
        }
        const info = await transporter.sendMail(mailOptions)
        return info
    } catch (error) {
        console.log(error)
    }
}
module.exports = sendMail