export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send();

    const { subscriberId, phone } = req.body;
    const API_SECRET = process.env.KIT_API_SECRET;

    try {
        const response = await fetch(`https://api.convertkit.com/v3/subscribers/${subscriberId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_secret: API_SECRET,
                fields: { "Cellphone Number": phone } // 'Cellphone Number' maps to your custom field key
            }),
        });

        const data = await response.json();
        if (data.error) throw new Error(data.error.message);

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
