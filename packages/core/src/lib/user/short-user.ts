import { CaseStyle } from "kryo";
import { LiteralType } from "kryo/lib/literal.js";
import { $Null } from "kryo/lib/null.js";
import { RecordIoType, RecordType } from "kryo/lib/record.js";
import { TryUnionType } from "kryo/lib/try-union.js";

import { $ObjectType, ObjectType } from "../core/object-type.js";
import { $UserDisplayNameVersions, UserDisplayNameVersions } from "./user-display-name-versions.js";
import { $UserId, UserId } from "./user-id.js";

/**
 * Represents a reference to an Eternal-Twin user, with enough to display it.
 */
export interface ShortUser {
  type: ObjectType.User;

  id: UserId;

  displayName: UserDisplayNameVersions;
}

export const $ShortUser: RecordIoType<ShortUser> = new RecordType<ShortUser>({
  properties: {
    type: {type: new LiteralType({type: $ObjectType, value: ObjectType.User})},
    id: {type: $UserId},
    displayName: {type: $UserDisplayNameVersions},
  },
  changeCase: CaseStyle.SnakeCase,
});

/**
 * A short user that may be null.
 */
export type NullableShortUser = null | ShortUser;

export const $NullableShortUser: TryUnionType<NullableShortUser> = new TryUnionType({variants: [$Null, $ShortUser]});
