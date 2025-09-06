
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'No message provided' });

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // يمكنك ترقيته لاحقًا
        messages: [
          { role: 'system', content: 'أنت Vivk AI — مساعد ذكي سريع يجيب بإيجاز ووضوح.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      }),
    });

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content;
    return res.status(200).json({ reply: reply || 'No reply' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}