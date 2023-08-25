import { prisma } from "../../lib/prisma";

require("dotenv").config();

let nodemailer = require("nodemailer");
export default async function Nodemailer(req: any, res: any) {
  const { email } = req.body

  const transporter = nodemailer.createTransport({
    port: 465, //587
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    secure: true,
  });

  const user = await prisma.user.findUnique({
    where: { email: email },  
  });

  const account = await prisma.account.findFirst({
    where: {userId:user?.id!}
  })

  const token = account?.access_token
  
  const mailData = {
    from: process.env.email,
    to: `"${req.body.email}"`,
    // to:`"${session?.user.email!}"`,
    subject: `Message From`,
    text: " | Sent from: " + req.body.email,
    // html: `<div>${req.body.message}</div><p>Sent from: ${req.body.email}</p>`,
    html: `<head>
    <title>Contoh Template Email</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style type="text/css">
      body {
        background-color: #f6f6f6;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 3;
        color: #333;
        padding: 20px;
        text-align: center;
        justify-content: center;
        align-items: center;
      }
      a {
        color: #333;
        background-color: aqua;
        padding: 0.5rem;
        border-radius: 10px;
        text-decoration-line: none;
        margin-top: 25px;
        width: auto;
        transition: all ease-in-out 1s;
      }
      a:hover {
        color: #f6f6f6;
        background-color: rgb(11, 145, 145);
        transition: all ease-in-out 1s;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Change Phone Number</h1>
      <p>
        Ganti Nomor Telefon Anda, ${token}
      </p>
      <a href="https://www.tigaorang.dev/changephoneNumber?token=${token}" class="button">Verification</a>
    </div>
  </body>`,
  };
  
  if(user){
    transporter.sendMail(mailData, function (err: any, info: any) {
      if (err) console.log(err);
      else console.log(info);
    });
  }if(!user){
    return null
  }

  //console.log(req.body);
  res.send("success");
}
