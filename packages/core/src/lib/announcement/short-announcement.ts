import { CaseStyle } from "kryo";
import { $Date } from "kryo/date";
import { LiteralType } from "kryo/literal";
import { RecordIoType, RecordType } from "kryo/record";

import { $LocaleId, LocaleId } from "../core/locale-id.js";
import { $ObjectType, ObjectType } from "../core/object-type.js";
import { $ForumThread, ForumThread } from "../forum/forum-thread.js";
import { $AnnouncementId, AnnouncementId } from "./announcement-id.js";

export interface ShortAnnouncement {
  type: ObjectType.Announcement;
  id: AnnouncementId;
  createdAt: Date;
  thread: ForumThread;
  locale: LocaleId;
}

export const $ShortAnnouncement: RecordIoType<ShortAnnouncement> = new RecordType<ShortAnnouncement>({
  properties: {
    type: {type: new LiteralType({type: $ObjectType, value: ObjectType.Announcement})},
    id: {type: $AnnouncementId},
    createdAt: {type: $Date},
    thread: {type: $ForumThread},
    locale: {type: $LocaleId},
  },
  changeCase: CaseStyle.SnakeCase,
});
