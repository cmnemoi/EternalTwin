import { $Null } from "kryo/lib/null.js";
import { TryUnionType } from "kryo/lib/try-union.js";

import { $CompleteSimpleUser, CompleteSimpleUser } from "./complete-simple-user.js";
import { $ShortUser, ShortUser } from "./short-user.js";
import { $SimpleUser, SimpleUser } from "./simple-user.js";

export type GetUserResult = ShortUser | SimpleUser | CompleteSimpleUser;

export const $GetUserResult: TryUnionType<GetUserResult> = new TryUnionType<GetUserResult>({
  variants: [$CompleteSimpleUser, $SimpleUser, $ShortUser],
});

export type NullableGetUserResult = null | GetUserResult;

export const $NullableGetUserResult: TryUnionType<NullableGetUserResult> = new TryUnionType({variants: [$Null, $GetUserResult]});