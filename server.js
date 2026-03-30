const express = require("express");
const app = express();
app.use(express.json());

const SUPABASE_URL = "https://hkjfddnwlaelicjmmsju.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhramZkZG53bGFlbGljam1tc2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTU2MTQsImV4cCI6MjA5MDQzMTYxNH0.ONfiugbnKxy32vE-QNh1ZXV_VhagsYzXq1k-sAM1RUg";

app.post("/webhook", async (req, res) => {
  res.status(200).json({ success: true });

  const payload = req.body;
  const type = payload?.type;
  const customer = payload?.data?.customer;
  const message = payload?.data?.message;

  console.log("Webhook received:", JSON.stringify(payload));

  if (!customer || !message) {
    console.log("Missing customer or message — skipping insert");
    return;
  }

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

  console.log("Inserting record:", JSON.stringify(record));

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(record)
    });

    const responseText = await response.text();
    console.log("Supabase response status:", response.status);
    console.log("Supabase response body:", responseText);

    if (response.ok) {
      console.log("✅ Row inserted successfully!");
    } else {
      console.log("❌ Insert failed!");
    }
  } catch (err) {
    console.log("❌ Fetch error:", err.message);
  }
});

app.listen(3000, () => console.log("Webhook receiver running!"));
