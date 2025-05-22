const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const { OPENAI_API_KEY } = require('./config');

const app = express();
const port = 3000;

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'أنت مساعد ذكي لمطعم شريمبلس. أجب باللغة المناسبة للمستخدم، وكن ودوداً، واعرض المعلومات حول الفروع، المنيو، وأوقات العمل فقط.' },
                 { role: 'user', content: userMessage }]
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).send('حدث خطأ');
  }
});

app.listen(port, () => {
  console.log(`Shrimplus chatbot server running at http://localhost:${port}`);
});
