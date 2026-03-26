const BLOTATO_KEY = 'ak_c1e8c4c6c251222c982c62ddcfeab8818abbe8e014a416a3a83d72423a426412';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { action, url, sourceId } = req.body || {};

    if (action === 'submit') {
      const response = await fetch('https://backend.blotato.com/v2/source-resolutions-v3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'blotato-api-key': BLOTATO_KEY
        },
        body: JSON.stringify({
          source: { sourceType: 'tiktok', url },
          customInstructions: `Give a full second-by-second breakdown with visual and audio details. For each timestamp include exactly what is shown on screen (setting, props, person's actions, facial expressions, text overlays) and exactly what is being said verbatim. Format: [0:00-0:03] VISUAL: ... AUDIO: ... Be as detailed as possible.`
        })
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (action === 'poll') {
      const response = await fetch(`https://backend.blotato.com/v2/source-resolutions-v3/${sourceId}`, {
        headers: { 'blotato-api-key': BLOTATO_KEY }
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    return res.status(400).json({ error: 'Invalid action' });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
