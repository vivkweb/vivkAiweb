
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST' });

  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        response_format: 'b64_json'
      })
    });

    const data = await r.json();
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return res.status(500).json({ error: 'Failed to generate image' });

    // حوّل Base64 إلى Data URL ليسهل عرضه مباشرة
    const url = `data:image/png;base64,${b64}`;
    return res.status(200).json({ url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
}