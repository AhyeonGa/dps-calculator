export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const webhook = process.env.DISCORD_WEBHOOK_URL;

    if (!webhook) {
        return res.status(500).json({ error: "Webhook 未設定" });
    }

    try {
        const { name, type, contact, message } = req.body || {};

        if (!name || !type || !message) {
            return res.status(400).json({ error: "缺少必要欄位" });
        }

        const discordRes = await fetch(webhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: "DPS 模擬器",
                embeds: [
                    {
                        title: "📩 收到新留言",
                        color: 10181046,
                        fields: [
                            {
                                name: "留言類型",
                                value: String(type).slice(0, 100),
                                inline: true
                            },
                            {
                                name: "暱稱",
                                value: String(name).slice(0, 100),
                                inline: true
                            },
                            {
                                name: "聯絡方式",
                                value: String(contact || "未填").slice(0, 200),
                                inline: false
                            },
                            {
                                name: "內容",
                                value: String(message).slice(0, 1000),
                                inline: false
                            }
                        ],
                        footer: {
                            text: "loveahyeon.vercel.app"
                        },
                        timestamp: new Date().toISOString()
                    }
                ]
            })
        });

        if (!discordRes.ok) {
            const text = await discordRes.text();
            return res.status(500).json({ error: text || "Discord 發送失敗" });
        }

        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({
            error: err && err.message ? err.message : "發送失敗"
        });
    }
}
