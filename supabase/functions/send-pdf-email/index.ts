import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { to, subject, html, orderData } = await req.json();

  const emailHtml = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="color:#484888">DELIVERY NOTE — Ygii</h2>
      <p>Dear ${orderData.customerName},</p>
      <p>Order No: <strong>${orderData.deliveryNo}</strong></p>
      <p>Date: ${orderData.date}</p>
      <br/>
      <p>All products were received as mentioned above with accepted quantity and quality by the client</p>
      <p style="direction:rtl;text-align:right">تم استلام جميع المنتجات المذكورة أعلاه بالكمية والجودة المقبولة من قبل العميل</p>
      <br/>
      <p style="color:#484888;font-size:12px">Ygii — شركة تطبيق يجي لتقنية المعلومات</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
    },
    body: JSON.stringify({
      from: "hello@ygii.app",
      to: [to],
      bcc: ["monera@ygii.app", "asj@ygii.app", "hello@ygii.app"],
      subject: subject,
      html: emailHtml,
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
