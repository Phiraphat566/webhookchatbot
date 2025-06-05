const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const CHANNEL_ACCESS_TOKEN = 'YOUR_CHANNEL_ACCESS_TOKEN';
const GROUP_ID = 'YOUR_GROUP_ID';

// รับ event จาก LINE webhook
app.post('/webhook', (req, res) => {
  console.log('Webhook event received:', JSON.stringify(req.body));

  // คุณอาจเพิ่ม logic ดัก event อื่นๆ ได้
  res.sendStatus(200); // ต้องส่ง 200 ตอบกลับเสมอ
});

// API รับข้อความจาก Google Sheets ผ่าน Apps Script แล้วส่งข้อความไปกลุ่ม
async function sendMessageToGroup(message) {
  try {
    await axios.post('https://api.line.me/v2/bot/message/push', {
      to: GROUP_ID,
      messages: [
        { type: 'text', text: message },
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Message sent to group');
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
}

app.post('/notify', async (req, res) => {
  const { message } = req.body;
  await sendMessageToGroup(message);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Server running on port 3000'));
