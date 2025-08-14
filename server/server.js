import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post('/api/send-sms', async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const smsMessage = `🏗️ HPS NEW LEAD!

👤 ${name}
📧 ${email}
📱 ${phone}

⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

Check your email for details!`;

    await twilioClient.messages.create({
      body: smsMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: '+919555633827'
    });

    res.json({ success: true });
  } catch (error) {
    console.error('SMS Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`SMS service running on port ${PORT}`);
});
