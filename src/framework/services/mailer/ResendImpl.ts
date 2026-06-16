import type { IMailer } from "./IMailer.js";
import config from "../../../config/config.js";
import { inject, injectable } from "inversify";
import type { ILogger } from "../../logging/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { type Resend, Resend as ResendClient } from "resend";

@injectable()
export class ResendImpl implements IMailer {
  private logger: ILogger;
  private resend: Resend;

  constructor(@inject(INTERFACE_TYPE.Logger) logger: ILogger) {
    this.logger = logger;
    this.resend = new ResendClient(config.resendApiKey);
  }
  async sendEmail(email: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: "Appsol CMS <" + config.mailerEmail + ">",
      to: email,
      subject: subject,
      html: text,
    };

    try {
      const { data, error } = await this.resend.emails.send(mailOptions);
      this.logger.info(
        "Email sent, response data: " + JSON.stringify(data, null, 2),
      );
      if (error) {
        this.logger.error("Resend error", error);
        throw new Error(error.message);
      }
    } catch (error) {
      this.logger.error("Error sending email:", error);
      throw error; // rethrow the error to propagate the rejection
    }
  }
}
