import type { TPriority } from "../constants/genTypes.js";

export function ticketAssignmentTemplate(params: {
  engineerName: string;
  ticketId: string;
  priority: TPriority;
  title: string;
  clientName: string;
  deadline: string;
}) {
  // Logic for Priority Color
  const priorityColors = {
    low: "#94a3b8",
    medium: "#3b82f6",
    high: "#f59e0b",
    critical: "#ef4444",
  };
  const badgeColor = priorityColors[params.priority] || "#10b981";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <style>
      body { margin: 0; padding: 0; background: #f7f9fc; font-family: 'Inter', Arial, sans-serif; color: #1a1a1a; }
      .container { max-width: 500px; margin: 40px auto; background: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
      
      /* Ticket Detail Card */
      .ticket-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
      }
      .priority-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        color: white;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        background: ${badgeColor};
      }
      .btn {
        display: block;
        text-align: center;
        background: #10b981; /* Appsol Primary Green */
        color: white !important;
        padding: 14px;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        margin-top: 25px;
      }

      @media (prefers-color-scheme: dark) {
        body { background: #0f0f0f !important; color: #e4e7eb !important; }
        .container { background: #1a1a1a !important; color: #e4e7eb !important; }
        .ticket-card { background: #2d2d2d !important; border-color: #444 !important; }
        .footer-text { color: #999 !important; }
      }
    </style>
  </head>
  <body>
      <div class="container">
              <div style="text-align:center;margin-bottom:24px;">
              <div
          style="
            display: inline-block;
            background-color: #ffffff;
            padding: 10px 14px;
            border-radius: 8px;
          "
        >
          <img
            src="https://lh3.googleusercontent.com/pw/AP1GczMIcX7yNiKM_E_JLE8qsbvZkcUOA5GfYxdGLTkqhj1acnOYutWL2f8JpFScJxc6oR7cKHhKCHx1H-WXmrmJiow86LeB4lzzUq2h-O-lCFFpzWyBBg=w2400"
            alt="Appsol Logo"
            height="40"
            style="display:block;"
          />
        </div>
      </div>

      <h2 style="margin-top:0; font-size: 20px;">New Ticket Assigned</h2>
      <p style="font-size:15px; color: #64748b;">
        Hello <strong>${params.engineerName}</strong>, a new support ticket has been assigned to you and requires your attention.
      </p>

      <div class="ticket-card">
        <div style="margin-bottom: 12px;">
          <span class="priority-badge">${params.priority} Priority</span>
        </div>
        <div style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Ticket ID: #${params.ticketId}</div>
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${params.title}</div>
        <hr style="border:none; border-top: 1px solid #e2e8f0; margin: 12px 0;">
        <div style="font-size: 14px;"><strong>Client:</strong> ${params.clientName}</div>
        <div style="font-size: 14px; margin-top: 4px;"><strong>Target Resolution:</strong> ${params.deadline}</div>
      </div>

      <a href="https://appsol-cms.com/tickets/${params.ticketId}" class="btn">View Ticket Details</a>

      <p style="font-size:13px; margin-top:25px; color:#94a3b8; text-align: center;">
        Please log into the Appsol CMS App to start working on this ticket or contact the Appsol Support team if you have any questions.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">
      <p class="footer-text" style="font-size:12px; text-align:center; color:#aaa;">
        Appsol Information Systems <br>
        <a href="mailto:info@appsolinfosystems.com" style="color:#10b981;">info@appsolinfosystems.com</a>
      </p>
    </div>
  </body>
  </html>
  `;
}
