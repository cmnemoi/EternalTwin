import { CaseStyle, IoType } from "kryo";
import { ArrayType } from "kryo/lib/array.js";
import { $Date } from "kryo/lib/date.js";
import { $Uint32 } from "kryo/lib/integer.js";
import { LiteralType } from "kryo/lib/literal.js";
import { $Null } from "kryo/lib/null.js";
import { RecordIoType, RecordType } from "kryo/lib/record.js";
import { TryUnionType } from "kryo/lib/try-union.js";

import { $ObjectType, ObjectType } from "../core/object-type.js";
import { $NullableLatestTemporal, NullableLatestTemporal } from "../temporal/latest-temporal.js";
import { $DinoparcDinozIdRef, DinoparcDinozIdRef } from "./dinoparc-dinoz-id-ref.js";
import { $DinoparcItemCounts, DinoparcItemCounts } from "./dinoparc-item-counts.js";
import { $DinoparcServer, DinoparcServer } from "./dinoparc-server.js";
import { $DinoparcUserId, DinoparcUserId } from "./dinoparc-user-id.js";
import { $DinoparcUsername, DinoparcUsername } from "./dinoparc-username.js";

export interface ArchivedDinoparcUser {
  type: ObjectType.DinoparcUser;
  server: DinoparcServer;
  id: DinoparcUserId;
  archivedAt: Date;
  username: DinoparcUsername;
  coins: NullableLatestTemporal<number>,
  dinoz: NullableLatestTemporal<DinoparcDinozIdRef[]>,
  inventory: NullableLatestTemporal<DinoparcItemCounts>,
}

export const $ArchivedDinoparcUser: RecordIoType<ArchivedDinoparcUser> = new RecordType<ArchivedDinoparcUser>({
  properties: {
    type: {type: new LiteralType({type: $ObjectType, value: ObjectType.DinoparcUser})},
    server: {type: $DinoparcServer},
    id: {type: $DinoparcUserId},
    archivedAt: {type: $Date},
    username: {type: $DinoparcUsername},
    coins: {type: $NullableLatestTemporal.apply($Uint32) as IoType<NullableLatestTemporal<number>>},
    dinoz: {type: $NullableLatestTemporal.apply(new ArrayType({itemType: $DinoparcDinozIdRef, maxLength: 10000})) as IoType<NullableLatestTemporal<DinoparcDinozIdRef[]>>},
    inventory: {type: $NullableLatestTemporal.apply($DinoparcItemCounts) as IoType<NullableLatestTemporal<DinoparcItemCounts>>},
  },
  changeCase: CaseStyle.SnakeCase,
});

export type NullableArchivedDinoparcUser = null | ArchivedDinoparcUser;

export const $NullableArchivedDinoparcUser: TryUnionType<NullableArchivedDinoparcUser> = new TryUnionType({variants: [$Null, $ArchivedDinoparcUser]});
