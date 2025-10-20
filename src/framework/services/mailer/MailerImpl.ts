import type { IMailer } from "./IMailer.js";
import nodemailer from "nodemailer";
import config from "../../../config/config.js";
import { inject, injectable } from "inversify";
import type { ILogger } from "../../logging/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

@injectable()
export class MailerImpl implements IMailer {
  private logger: ILogger;
  constructor(@inject(INTERFACE_TYPE.Logger) logger: ILogger) {
    this.logger = logger;
  }
  async sendEmail(email: string, subject: string, text: string): Promise<void> {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: config.mailerHost,
      port: config.mailerPort,
      secure: true,
      auth: {
        user: config.mailerEmail,
        pass: config.mailerAppPassword,
      },
    });

    const mailOptions = {
      from: "Appsol CMS <" + config.mailerEmail + ">",
      to: email,
      subject: subject,
      html: text,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      this.logger.info("Email sent: " + info.response);
    } catch (error) {
      this.logger.error("Error sending email:", error);
      throw error; // rethrow the error to propagate the rejection
    }
  }
}
