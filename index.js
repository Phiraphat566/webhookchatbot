const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const CHANNEL_ACCESS_TOKEN = 'jP4hShb0K05lC0qKXSURTDh4bE1O3eSDcAVRWgmxttnfP33wp7cZMJeXnbSDLNLlGLniKau/Z2J9sGa/+QyjVMidZFCoBIB41u2fUIjKQAwnP9/3dKO98K4L9LrMdo/8nvWmfUG/hjVHR0JeWlozLwdB04t89/1O/w1cDnyilFU=';
const GROUP_ID = 'YOUR_GROUP_ID';

// รับ event จาก LINE webhook
app.post('/webhook', (req, res) => {
  const events = req.body.events;
  if (events && events.length > 0) {
    for (const event of events) {
      if (event.source.type === 'group') {
        const groupId = event.source.groupId;
        console.log('📌 Group ID:', groupId); // << ตรงนี้แหละที่เราต้องการ
      }
    }
  }

  res.sendStatus(200); // ตอบกลับให้ LINE ว่าโอเค
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
