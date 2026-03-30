const express = require("express");
const app = express();
app.use(express.json());

const SUPABASE_URL = "PASTE_YOUR_PROJECT_URL_HERE";
const SUPABASE_KEY = "PASTE_YOUR_ANON_KEY_HERE";

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

  await fetch(`${SUPABASE_URL}/rest/v1/conversations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(record)
  });
});

app.listen(3000, () => console.log("Webhook receiver running!"));
