import { CaseStyle } from "kryo";
import { $Date } from "kryo/lib/date.js";
import { RecordIoType, RecordType } from "kryo/lib/record.js";

import { $UserId, UserId } from "./user-id.js";

export interface GetUserByIdOptions {
  id: UserId;
  time?: Date;
}

export const $GetUserByIdOptions: RecordIoType<GetUserByIdOptions> = new RecordType<GetUserByIdOptions>({
  properties: {
    id: {type: $UserId},
    time: {type: $Date, optional: true},
  },
  changeCase: CaseStyle.SnakeCase,
});