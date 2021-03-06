import { CaseStyle } from "kryo";
import { LiteralType } from "kryo/literal";
import { RecordIoType, RecordType } from "kryo/record";

import { $ObjectType, ObjectType } from "../core/object-type.js";
import { $OauthClientId, OauthClientId } from "./oauth-client-id.js";
import { $OauthClientKey, OauthClientKey } from "./oauth-client-key.js";

export interface OauthClientIdRef {
  type: ObjectType.OauthClient;
  id: OauthClientId;
  key?: OauthClientKey;
}

export const $OauthClientIdRef: RecordIoType<OauthClientIdRef> = new RecordType<OauthClientIdRef>({
  properties: {
    type: {type: new LiteralType({type: $ObjectType, value: ObjectType.OauthClient})},
    id: {type: $OauthClientId},
    key: {type: $OauthClientKey, optional: true},
  },
  changeCase: CaseStyle.SnakeCase,
});
