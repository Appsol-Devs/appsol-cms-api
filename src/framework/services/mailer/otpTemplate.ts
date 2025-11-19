export function otpTemplateDark(name: string, otp: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">

    <style>
      /* Base (Light Mode) */
      body {
        margin: 0;
        padding: 0;
        background: #f7f9fc;
        font-family: Arial, sans-serif;
        color: #1a1a1a;
      }
     .logo{
        background: url("https://lh3.googleusercontent.com/pw/AP1GczMIcX7yNiKM_E_JLE8qsbvZkcUOA5GfYxdGLTkqhj1acnOYutWL2f8JpFScJxc6oR7cKHhKCHx1H-WXmrmJiow86LeB4lzzUq2h-O-lCFFpzWyBBg=w2400");
}

      .container {
        max-width: 480px;
        margin: 40px auto;
        background: #ffffff;
        padding: 32px;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      }

      .otp-box {
        background: #eef4ff;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        font-size: 30px;
        letter-spacing: 4px;
        font-weight: bold;
        color: #1a1a1a;
      }

      /* Dark Mode Styles */
      @media (prefers-color-scheme: dark) {
        body {
          background: #0f0f0f !important;
          color: #e4e7eb !important;
        }
    
        .container {
          background: #1a1a1a !important;
          color: #e4e7eb !important;
          box-shadow: 0 2px 8px rgba(255,255,255,0.05) !important;
        }
        .otp-box {
          background: #2d2d2d !important;
          color: #ffffff !important;
        }
        .footer-text {
          color: #999 !important;
        }
      }
    </style>
  </head>

  <body>
    <div class="container">

      <div style="text-align:center;margin-bottom:20px;">
  <picture>
    <!-- Dark mode logo -->
    <source
      srcset="https://lh3.googleusercontent.com/pw/AP1GczMJBTBEHbmDShgTYpWTmikYXobuKnad15FEpd1YJT7MyX7J5tBcnMRhGdIwrvcWB145sOJw2vXru6BTHvZC-OmQchGeAUKvdPDVjCQDmezzfKTtEg=w2400"
      media="(prefers-color-scheme: dark)"
    />

    <!-- Light mode logo -->
    <img
      src="https://lh3.googleusercontent.com/pw/AP1GczMIcX7yNiKM_E_JLE8qsbvZkcUOA5GfYxdGLTkqhj1acnOYutWL2f8JpFScJxc6oR7cKHhKCHx1H-WXmrmJiow86LeB4lzzUq2h-O-lCFFpzWyBBg=w2400"
      alt="Logo"
      style="height:40px;"
    />
  </picture>
</div>


      <p style="font-size:16px;">
        Hello ${name || ""},
      </p>

      <h2 style="margin-top:0;">Confirm Your Identity</h2>

      <p style="font-size:15px;line-height:1.5;">
        Use the One-Time Password (OTP) below to verify your account.
      </p>

      <div class="otp-box">
        ${otp}
      </div>

      <p style="font-size:14px;margin-top:25px;color:#666;">
        This code expires in <strong>1 hour</strong>. Do not share it with anyone.
      </p>

      <p style="font-size:14px;color:#666;">
        If you did not request this, you can safely ignore it.
      </p>

      <hr style="border:none;border-top:1px solid #eee;margin:30px 0;">

      <p class="footer-text" style="font-size:12px;text-align:center;color:#aaa;">
        Need help? Contact us at 
        <a href="mailto:info@appsolinfosystems.com" style="color:#4a7afe;">info@appsolinfosystems.com</a>
      </p>

    </div>
  </body>
  </html>
  `;
}
