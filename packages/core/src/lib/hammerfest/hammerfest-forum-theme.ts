import { CaseStyle } from "kryo";
import { RecordIoType, RecordType } from "kryo/record";
import { $Ucs2String } from "kryo/ucs2-string";

import { $HammerfestForumThemeId } from "./hammerfest-forum-theme-id.js";
import { HammerfestForumThemeRef } from "./hammerfest-forum-theme-ref.js";
import { $HammerfestServer } from "./hammerfest-server.js";

/**
 * A forum theme as found in the forum main page.
 */
export interface HammerfestForumTheme extends HammerfestForumThemeRef {
  description: string;
}

export const $HammerfestForumTheme: RecordIoType<HammerfestForumTheme> = new RecordType<HammerfestForumTheme>({
  properties: {
    server: {type: $HammerfestServer},
    id: {type: $HammerfestForumThemeId},
    name: {type: $Ucs2String},
    description: {type: $Ucs2String},
  },
  changeCase: CaseStyle.SnakeCase,
});
