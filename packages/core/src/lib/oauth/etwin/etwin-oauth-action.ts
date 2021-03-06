import { TaggedUnionType } from "kryo/tagged-union";

import { $LinkOauthAction, LinkOauthAction } from "./link-oauth-action.js";
import { $LoginOauthAction, LoginOauthAction } from "./login-oauth-action.js";


export type EtwinOauthAction =
  LinkOauthAction
  | LoginOauthAction;

export const $EtwinOauthAction: TaggedUnionType<EtwinOauthAction> = new TaggedUnionType<EtwinOauthAction>({
  variants: [$LinkOauthAction, $LoginOauthAction],
  tag: "type",
});
