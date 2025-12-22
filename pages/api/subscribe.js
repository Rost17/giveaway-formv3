export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send();

    const { email } = req.body;
    const FORM_ID = process.env.KIT_FORM_ID;
    const API_KEY = process.env.NEXT_PUBLIC_KIT_API_KEY;

    try {
        const response = await fetch(`https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: API_KEY, email }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        // Return the subscriber ID and Email to the frontend
        res.status(200).json({ subscriberId: data.subscription.subscriber.id, email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
