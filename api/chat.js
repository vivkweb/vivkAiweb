export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "الطريقة غير مسموحة" });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // ضع المفتاح في Vercel
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "❌ حدث خطأ";

    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "مشكلة في الخادم" });
  }
}
