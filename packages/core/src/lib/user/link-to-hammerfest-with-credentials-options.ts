import { CaseStyle } from "kryo";
import { LiteralType } from "kryo/lib/literal.js";
import { RecordIoType, RecordType } from "kryo/lib/record.js";

import { $HammerfestServer, HammerfestServer } from "../hammerfest/hammerfest-server.js";
import { $HammerfestUsername, HammerfestUsername } from "../hammerfest/hammerfest-username.js";
import { $Password, Password } from "../password/password.js";
import { $LinkToHammerfestMethod, LinkToHammerfestMethod } from "./link-to-hammerfest-method.js";
import { $UserId, UserId } from "./user-id.js";

export interface LinkToHammerfestWithCredentialsOptions {
  method: LinkToHammerfestMethod.Credentials;

  /**
   * Id of the Eternal-Twin user to link.
   */
  userId: UserId;

  /**
   * Hammerfest server.
   */
  hammerfestServer: HammerfestServer;

  /**
   * Username for the Hammerfest user.
   */
  hammerfestUsername: HammerfestUsername;

  /**
   * Password for the Hammerfest user.
   */
  hammerfestPassword: Password;
}

export const $LinkToHammerfestWithCredentialsOptions: RecordIoType<LinkToHammerfestWithCredentialsOptions> = new RecordType<LinkToHammerfestWithCredentialsOptions>({
  properties: {
    method: {type: new LiteralType({type: $LinkToHammerfestMethod, value: LinkToHammerfestMethod.Credentials})},
    userId: {type: $UserId},
    hammerfestServer: {type: $HammerfestServer},
    hammerfestUsername: {type: $HammerfestUsername},
    hammerfestPassword: {type: $Password},
  },
  changeCase: CaseStyle.SnakeCase,
});