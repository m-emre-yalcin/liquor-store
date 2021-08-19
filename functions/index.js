const functions = require("firebase-functions");
const express = require('express')
const cors = require('cors')
const emailHandler = require('./utils/email-handler')

const app = express()
app.use(express.json({ extended: true }))
app.use(cors())

app.post('/contact-email', emailHandler)

exports.app = functions.https.onRequest(app)