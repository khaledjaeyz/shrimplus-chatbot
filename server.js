const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'أنت مساعد ذكي لمطعم شريمبلس. أجب باللغة المناسبة للمستخدم، وكن ودوداً، واعرض المعلومات حول الفروع، المنيو، وأوقات العمل فقط.',
        },
        { role: 'user', content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).send('حدث خطأ في الاتصال بالذكاء الاصطناعي.');
  }
});

app.listen(port, () => {
  console.log(`✅ Shrimplus chatbot running on http://localhost:${port}`);
});
