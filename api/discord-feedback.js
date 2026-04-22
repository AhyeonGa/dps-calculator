export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const webhook = process.env.DISCORD_WEBHOOK_URL;

    if (!webhook) {
        return res.status(500).json({ error: "Webhook 未設定" });
    }

    try {
        const { name, message } = req.body;

        const content = `📩 新留言\n👤 ${name}\n💬 ${message}`;

        await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        });

        res.status(200).json({ success: true });

    } catch (err) {
        res.status(500).json({ error: "發送失敗" });
    }
}