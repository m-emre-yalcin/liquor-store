const nodemailer = require("nodemailer")
const createTemplate = require('./template')
require('dotenv').config()

module.exports = async (req, res) => {
  const { fullname, email, age, gender, description, attachments } = req.body

  // console.log(createTemplate({ fullname, age, gender, attachments }))

  if (!email) res.status(400).send('Email is missing.')

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
      from: `"${fullname}" <${email}>`,
      to: `Estefulya <${process.env.email_user}>`,
      subject: `estefulya.com | ${fullname} - ${description.slice(0, 70)}...`,
      text: `age: ${age}, gender: ${gender}, description: ${description}`,
      html: createTemplate(req.body),
      attachments
    })

    res.send(`Mail sent successfully.`)
  } catch (error) {
    res.status(500).send(`Mail could not be received. <br> ${error.message}`)
  }


}