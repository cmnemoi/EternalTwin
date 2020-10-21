import { CaseStyle } from "kryo";
import { $Boolean } from "kryo/lib/boolean.js";
import { $Date } from "kryo/lib/date.js";
import { LiteralType } from "kryo/lib/literal.js";
import { RecordIoType, RecordType } from "kryo/lib/record.js";

import { $ObjectType, ObjectType } from "../core/object-type.js";
import { $NullableEmailAddress, NullableEmailAddress } from "../email/email-address.js";
import { $VersionedLinks, VersionedLinks } from "../link/versioned-links.js";
import { $UserDisplayNameVersions, UserDisplayNameVersions } from "./user-display-name-versions.js";
import { $UserId, UserId } from "./user-id.js";
import { $NullableUsername, NullableUsername } from "./username.js";

/**
 * Main user interface.
 *
 * Aggregates data from multiple services to present the full user.
 * Includes private data.
 */
export interface CompleteUser {
  type: ObjectType.User;

  id: UserId;

  displayName: UserDisplayNameVersions;

  isAdministrator: boolean;

  links: VersionedLinks;

  ctime: Date;

  username: NullableUsername;

  emailAddress: NullableEmailAddress;

  hasPassword: boolean;
}

export const $CompleteUser: RecordIoType<CompleteUser> = new RecordType<CompleteUser>({
  properties: {
    type: {type: new LiteralType({type: $ObjectType, value: ObjectType.User})},
    id: {type: $UserId},
    displayName: {type: $UserDisplayNameVersions},
    isAdministrator: {type: $Boolean},
    links: {type: $VersionedLinks},
    ctime: {type: $Date},
    username: {type: $NullableUsername},
    emailAddress: {type: $NullableEmailAddress},
    hasPassword: {type: $Boolean},
  },
  changeCase: CaseStyle.SnakeCase,
});
