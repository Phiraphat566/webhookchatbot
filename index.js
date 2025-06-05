const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const CHANNEL_ACCESS_TOKEN = 'jP4hShb0K05lC0qKXSURTDh4bE1O3eSDcAVRWgmxttnfP33wp7cZMJeXnbSDLNLlGLniKau/Z2J9sGa/+QyjVMidZFCoBIB41u2fUIjKQAwnP9/3dKO98K4L9LrMdo/8nvWmfUG/hjVHR0JeWlozLwdB04t89/1O/w1cDnyilFU=';

app.post('/notify', async (req, res) => {
  const { message } = req.body; // รับข้อความจาก Google Sheet

  try {
    // ส่งข้อความไปยังกลุ่ม LINE (ใช้ groupId ที่ได้จาก event webhook หรือ hardcode ถ้าทราบแล้ว)
    await axios.post('https://api.line.me/v2/bot/message/broadcast', {
      messages: [
        {
          type: 'text',
          text: message,
        },
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err.response?.data || err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
