import {
  $ArchivedDinoparcUser,
  $NullableArchivedDinoparcUser,
  ArchivedDinoparcUser
} from "@eternal-twin/core/lib/dinoparc/archived-dinoparc-user.js";
import { $DinoparcDinozResponse, DinoparcDinozResponse } from "@eternal-twin/core/lib/dinoparc/dinoparc-dinoz-response.js";
import {
  $DinoparcInventoryResponse,
  DinoparcInventoryResponse
} from "@eternal-twin/core/lib/dinoparc/dinoparc-inventory-response.js";
import {
  $GetDinoparcUserOptions,
  GetDinoparcUserOptions
} from "@eternal-twin/core/lib/dinoparc/get-dinoparc-user-options.js";
import { $ShortDinoparcUser, ShortDinoparcUser } from "@eternal-twin/core/lib/dinoparc/short-dinoparc-user.js";
import { DinoparcStore } from "@eternal-twin/core/lib/dinoparc/store.js";
import { JSON_READER } from "kryo-json/lib/json-reader.js";
import { JSON_WRITER } from "kryo-json/lib/json-writer.js";
import { promisify } from "util";

import native from "../native/index.js";
import { NativeClock } from "./clock.js";
import { Database } from "./database.js";
import { NativeUuidGenerator } from "./uuid";

declare const MemDinoparcStoreBox: unique symbol;
declare const PgDinoparcStoreBox: unique symbol;
export type NativeDinoparcStoreBox = typeof MemDinoparcStoreBox | typeof PgDinoparcStoreBox;

export abstract class NativeDinoparcStore implements DinoparcStore {
  public readonly box: NativeDinoparcStoreBox;
  private static GET_USER = promisify(native.dinoparcStore.getUser);
  private static TOUCH_SHORT_USER = promisify(native.dinoparcStore.touchShortUser);
  private static TOUCH_DINOZ = promisify(native.dinoparcStore.touchDinoz);
  private static TOUCH_INVENTORY = promisify(native.dinoparcStore.touchInventory);

  constructor(box: NativeDinoparcStoreBox) {
    this.box = box;
  }

  async getUser(options: Readonly<GetDinoparcUserOptions>): Promise<ArchivedDinoparcUser | null> {
    const rawOptions: string = $GetDinoparcUserOptions.write(JSON_WRITER, options);
    const rawOut = await NativeDinoparcStore.GET_USER(this.box, rawOptions);
    return $NullableArchivedDinoparcUser.read(JSON_READER, rawOut);
  }

  async touchShortUser(short: Readonly<ShortDinoparcUser>): Promise<ArchivedDinoparcUser> {
    const rawShort: string = $ShortDinoparcUser.write(JSON_WRITER, short);
    const rawOut = await NativeDinoparcStore.TOUCH_SHORT_USER(this.box, rawShort);
    return $ArchivedDinoparcUser.read(JSON_READER, rawOut);
  }

  async touchInventory(response: Readonly<DinoparcInventoryResponse>): Promise<void> {
    const rawShort: string = $DinoparcInventoryResponse.write(JSON_WRITER, response);
    await NativeDinoparcStore.TOUCH_INVENTORY(this.box, rawShort);
  }

  async touchDinoz(response: Readonly<DinoparcDinozResponse>): Promise<void> {
    const rawShort: string = $DinoparcDinozResponse.write(JSON_WRITER, response);
    await NativeDinoparcStore.TOUCH_DINOZ(this.box, rawShort);
  }
}

export interface MemDinoparcStoreOptions {
  clock: NativeClock;
}

export class MemDinoparcStore extends NativeDinoparcStore {
  constructor(options: Readonly<MemDinoparcStoreOptions>) {
    super(native.dinoparcStore.mem.new(options.clock.box));
  }
}

export interface PgDinoparcStoreOptions {
  clock: NativeClock;
  database: Database;
  uuidGenerator: NativeUuidGenerator;
}

export class PgDinoparcStore extends NativeDinoparcStore {
  private static NEW = promisify(native.dinoparcStore.pg.new);

  private constructor(box: typeof PgDinoparcStoreBox) {
    super(box);
  }

  public static async create(options: Readonly<PgDinoparcStoreOptions>): Promise<PgDinoparcStore> {
    const box = await PgDinoparcStore.NEW(options.clock.box, options.database.box, options.uuidGenerator.box);
    return new PgDinoparcStore(box);
  }
}
