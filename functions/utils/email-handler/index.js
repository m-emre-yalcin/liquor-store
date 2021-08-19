const nodemailer = require("nodemailer")
const createTemplate = require('./template')
require('dotenv').config()

module.exports = async (req, res) => {
  const {
    name
  } = req.body


  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      // secure: true,
      // requireTLS: true,
      auth: {
        user: process.env.email_user,
        pass: process.env.email_pass,
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    })

    await transporter.sendMail({
      from: `"${name}" <${process.env.email_user}>`,
      to: `Online Tekel Ortaköy <${process.env.email_user}>`,
      subject: `${name} yeni bir sipariş verdi`,
      html: createTemplate(req.body),
    })

    res.send(`Mail sent successfully.`)
  } catch (error) {
    res.status(500).send(`Mail could not be received. <br> ${error.message}`)
  }


}