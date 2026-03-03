export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const slackMsg = req.body;
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      return res.status(500).json({ error: 'Slack webhook not configured' });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMsg)
    });

    if (response.ok) {
      return res.status(200).json({ status: 'ok' });
    } else {
      return res.status(500).json({ error: 'Slack error', status: response.status });
    }
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
