const express = require("express");
const app = express();
app.use(express.json());

const SUPABASE_URL = "https://hkjfddnwlaelicjmmsju.supabase.com";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhramZkZG53bGFlbGljam1tc2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTU2MTQsImV4cCI6MjA5MDQzMTYxNH0.ONfiugbnKxy32vE-QNh1ZXV_VhagsYzXq1k-sAM1RUg";

app.post("/webhook", async (req, res) => {
  res.status(200).json({ success: true });

  const payload = req.body;
  const type = payload?.type;
  const customer = payload?.data?.customer;
  const message = payload?.data?.message;

  if (!customer || !message) return;

  const record = {
    contact_phone: customer.channel_phone_number,
    contact_name: customer.traits?.name || null,
    message: message.message,
    direction: type === "message_received" ? "inbound" : "outbound",
    message_type: type,
    status: message.message_status,
    message_id: message.id,
    timestamp: message.received_at_utc,
    raw_payload: payload
  };

  await fetch(`${https://hkjfddnwlaelicjmmsju.supabase.com}/rest/v1/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": sb_publishable_-Agb5zfYLiCFKVF8MYge0Q_vlxHSIGo,
      "Authorization": `Bearer ${sb_publishable_-Agb5zfYLiCFKVF8MYge0Q_vlxHSIGo}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(record)
  });
});

app.listen(3000, () => console.log("Webhook receiver running!"));
