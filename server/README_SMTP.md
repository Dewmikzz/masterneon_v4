SMTP setup and testing

This project supports sending emails for contact and design requests. For local testing we recommend Mailtrap (https://mailtrap.io).

1) Get Mailtrap SMTP credentials
   - Sign in to Mailtrap and open an Inbox
   - Copy SMTP host, port, username and password

2) Update your local `server/.env` with Mailtrap values
   - Example values:
     - `SMTP_HOST=smtp.mailtrap.io`
     - `SMTP_PORT=2525`
     - `SMTP_USER=<your_mailtrap_user>`
     - `SMTP_PASS=<your_mailtrap_pass>`
     - `DESIGNER_EMAIL=you@yourdomain.com`

3) Start the server and run the test script
```bash
cd server
npm install
npm run dev
# in another terminal
node test-contact.js
```

4) Inspect Mailtrap inbox to confirm messages arrived.

If you want, paste your Mailtrap `SMTP_USER` and `SMTP_PASS` here and I can run the test for you (I will not save credentials). Alternatively, update `server/.env` locally and run the commands above.