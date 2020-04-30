import { $EmailAddress, EmailAddress } from "@eternal-twin/core/lib/email/email-address.js";
import { $Uint53 } from "kryo/lib/integer.js";
import { RecordIoType, RecordType } from "kryo/lib/record.js";

export interface EmailRegistrationJwt {
  email: EmailAddress;

  issuedAt: number;

  expirationTime: number;
}

export const $EmailRegistrationJwt: RecordIoType<EmailRegistrationJwt> = new RecordType<EmailRegistrationJwt>({
  properties: {
    email: {type: $EmailAddress},
    issuedAt: {type: $Uint53, rename: "iat"},
    expirationTime: {type: $Uint53, rename: "exp"},
  },
});
