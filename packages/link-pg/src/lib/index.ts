import { AuthScope } from "@eternal-twin/core/lib/auth/auth-scope.js";
import { AuthType } from "@eternal-twin/core/lib/auth/auth-type.js";
import { GuestAuthContext } from "@eternal-twin/core/lib/auth/guest-auth-context.js";
import { ObjectType } from "@eternal-twin/core/lib/core/object-type.js";
import { $HammerfestServer, HammerfestServer } from "@eternal-twin/core/lib/hammerfest/hammerfest-server.js";
import { HammerfestUserId } from "@eternal-twin/core/lib/hammerfest/hammerfest-user-id";
import { $HammerfestUserId } from "@eternal-twin/core/lib/hammerfest/hammerfest-user-id.js";
import { $HammerfestUsername } from "@eternal-twin/core/lib/hammerfest/hammerfest-username.js";
import { EtwinLink } from "@eternal-twin/core/lib/link/etwin-link.js";
import { HammerfestLink, NullableHammerfestLink } from "@eternal-twin/core/lib/link/hammerfest-link.js";
import { LinkService } from "@eternal-twin/core/lib/link/service.js";
import { NullableTwinoidLink, TwinoidLink } from "@eternal-twin/core/lib/link/twinoid-link.js";
import { VersionedEtwinLink } from "@eternal-twin/core/lib/link/versioned-etwin-link.js";
import { VersionedHammerfestLink } from "@eternal-twin/core/lib/link/versioned-hammerfest-link.js";
import { VersionedLinks } from "@eternal-twin/core/lib/link/versioned-links.js";
import { VersionedTwinoidLink } from "@eternal-twin/core/lib/link/versioned-twinoid-link.js";
import { $TwinoidUserDisplayName } from "@eternal-twin/core/lib/twinoid/twinoid-user-display-name.js";
import { $TwinoidUserId, TwinoidUserId } from "@eternal-twin/core/lib/twinoid/twinoid-user-id.js";
import { UserId } from "@eternal-twin/core/lib/user/user-id.js";
import {
  HammerfestUserLinkRow,
  HammerfestUserRow,
  TwinoidUserLinkRow,
  TwinoidUserRow
} from "@eternal-twin/etwin-pg/lib/schema.js";
import { Database, Queryable, TransactionMode } from "@eternal-twin/pg-db";
import { PgUserService } from "@eternal-twin/user-pg";
import { JSON_VALUE_READER } from "kryo-json/lib/json-value-reader.js";

const GUEST_AUTH_CONTEXT: GuestAuthContext = {
  type: AuthType.Guest,
  scope: AuthScope.Default,
};

export class PgLinkService implements LinkService {
  private readonly database: Database;
  private readonly user: PgUserService;

  constructor(
    database: Database,
    user: PgUserService,
  ) {
    this.database = database;
    this.user = user;
  }

  async getLinkFromHammerfest(hfServer: HammerfestServer, hfUserId: string): Promise<VersionedEtwinLink> {
    return this.database.transaction(TransactionMode.ReadOnly, q => this.getLinkFromHammerfestTx(q, hfServer, hfUserId));
  }

  async getLinkFromHammerfestTx(queryable: Queryable, hfServer: HammerfestServer, hfUserId: string): Promise<VersionedEtwinLink> {
    type Row = Pick<HammerfestUserLinkRow, "ctime" | "user_id">;
    const row: Row | undefined = await queryable.oneOrNone(
      `
        SELECT ctime, user_id
        FROM hammerfest_user_links
        WHERE hammerfest_server = $1::VARCHAR
          AND hammerfest_user_id = $2::VARCHAR;
      `,
      [hfServer, hfUserId],
    );
    if (row === undefined) {
      return {
        current: null,
        old: [],
      };
    }
    const user = await this.user.getUserRefByIdTx(queryable, GUEST_AUTH_CONTEXT, row.user_id);
    if (user === null) {
      throw new Error("AssertionError: Expected user to exist");
    }
    const link: EtwinLink = {
      link: {time: row.ctime, user},
      unlink: null,
      user,
    };
    return {
      current: link,
      old: [],
    };
  }

  async getLinkFromTwinoid(twinoidUserId: string): Promise<VersionedEtwinLink> {
    return this.database.transaction(TransactionMode.ReadOnly, q => this.getLinkFromTwinoidTx(q, twinoidUserId));
  }

  async getLinkFromTwinoidTx(queryable: Queryable, twinoidUserId: string): Promise<VersionedEtwinLink> {
    type Row = Pick<TwinoidUserLinkRow, "ctime" | "user_id">;
    const row: Row | undefined = await queryable.oneOrNone(
      `
        SELECT ctime, user_id
        FROM twinoid_user_links
        WHERE twinoid_user_links.twinoid_user_id = $1::VARCHAR;
      `,
      [twinoidUserId],
    );
    if (row === undefined) {
      return {
        current: null,
        old: [],
      };
    }
    const user = await this.user.getUserRefByIdTx(queryable, GUEST_AUTH_CONTEXT, row.user_id);
    if (user === null) {
      throw new Error("AssertionError: Expected user to exist");
    }
    const link: EtwinLink = {
      link: {time: row.ctime, user},
      unlink: null,
      user,
    };
    return {
      current: link,
      old: [],
    };
  }

  async linkToHammerfest(userId: UserId, hfServer: HammerfestServer, hfUserId: HammerfestUserId): Promise<VersionedHammerfestLink> {
    return this.database.transaction(TransactionMode.ReadWrite, q => this.linkToHammerfestTx(q, userId, hfServer, hfUserId));
  }

  async linkToHammerfestTx(queryable: Queryable, userId: UserId, hfServer: HammerfestServer, hfUserId: HammerfestUserId): Promise<VersionedHammerfestLink> {
    await queryable.countOne(
      `
        INSERT INTO hammerfest_user_links(user_id, hammerfest_server, hammerfest_user_id, ctime)
        VALUES ($1::UUID, $2::VARCHAR, $3::INT, NOW());`,
      [userId, hfServer, hfUserId],
    );

    type Row =
      Pick<HammerfestUserLinkRow, "hammerfest_server" | "hammerfest_user_id" | "ctime">
      & Pick<HammerfestUserRow, "username">;
    const row: Row = await queryable.one(
      `
        SELECT hammerfest_server, hammerfest_user_id, ctime, username
        FROM hammerfest_user_links
               INNER JOIN hammerfest_users USING (hammerfest_server, hammerfest_user_id)
        WHERE hammerfest_user_links.user_id = $1::UUID;
      `,
      [userId],
    );
    const server = $HammerfestServer.read(JSON_VALUE_READER, row.hammerfest_server);
    const id = $HammerfestUserId.read(JSON_VALUE_READER, row.hammerfest_user_id);
    const username = $HammerfestUsername.read(JSON_VALUE_READER, row.username);
    const user = await this.user.getUserRefByIdTx(queryable, GUEST_AUTH_CONTEXT, userId);
    if (user === null) {
      throw new Error("AssertionError: Expected user to exist");
    }
    const link: HammerfestLink = {
      link: {time: row.ctime, user},
      unlink: null,
      user: {type: ObjectType.HammerfestUser, server, id, username},
    };
    return {current: link, old: []};
  }

  async linkToTwinoid(userId: UserId, twinoidUserId: TwinoidUserId): Promise<VersionedTwinoidLink> {
    return this.database.transaction(TransactionMode.ReadWrite, q => this.linkToTwinoidTx(q, userId, twinoidUserId));
  }

  async linkToTwinoidTx(queryable: Queryable, userId: UserId, twinoidUserId: TwinoidUserId): Promise<VersionedTwinoidLink> {
    await queryable.countOne(
      `
        INSERT
        INTO twinoid_user_links(user_id, twinoid_user_id, ctime)
        VALUES ($1::UUID, $2::VARCHAR, NOW());`,
      [userId, twinoidUserId],
    );

    type TwinoidRow =
      Pick<TwinoidUserLinkRow, "twinoid_user_id" | "ctime">
      & Pick<TwinoidUserRow, "name">;
    const row: TwinoidRow = await queryable.one(
      `
        SELECT twinoid_user_id, ctime, name
        FROM twinoid_user_links
               INNER JOIN twinoid_users USING (twinoid_user_id)
        WHERE twinoid_user_links.user_id = $1::UUID;
      `,
      [userId],
    );
    const user = await this.user.getUserRefByIdTx(queryable, GUEST_AUTH_CONTEXT, userId);
    if (user === null) {
      throw new Error("AssertionError: Expected user to exist");
    }
    const id = $TwinoidUserId.read(JSON_VALUE_READER, row.twinoid_user_id);
    const displayName = $TwinoidUserDisplayName.read(JSON_VALUE_READER, row.name);
    const link: TwinoidLink = {
      link: {time: row.ctime, user},
      unlink: null,
      user: {type: ObjectType.TwinoidUser, id, displayName},
    };
    return {current: link, old: []};
  }

  public async getVersionedLinks(userId: UserId): Promise<VersionedLinks> {
    return this.database.transaction(TransactionMode.ReadOnly, async (q: Queryable) => {
      return this.getVersionedLinksTx(q, userId);
    });
  }

  private async getVersionedLinksTx(queryable: Queryable, userId: UserId): Promise<VersionedLinks> {
    const user = await this.user.getUserRefByIdTx(queryable, GUEST_AUTH_CONTEXT, userId);
    if (user === null) {
      throw new Error("AssertionError: Expected user to exist");
    }
    let hammerfestEs: NullableHammerfestLink = null;
    let hammerfestFr: NullableHammerfestLink = null;
    let hfestNet: NullableHammerfestLink = null;
    let twinoid: NullableTwinoidLink = null;
    {
      type HammerfestRow =
        Pick<HammerfestUserLinkRow, "hammerfest_server" | "hammerfest_user_id" | "ctime">
        & Pick<HammerfestUserRow, "username">;
      const rows: HammerfestRow[] = await queryable.many(
        `
          SELECT hammerfest_server, hammerfest_user_id, ctime, username
          FROM hammerfest_user_links
                 INNER JOIN hammerfest_users USING (hammerfest_server, hammerfest_user_id)
          WHERE hammerfest_user_links.user_id = $1::UUID;
        `,
        [userId],
      );
      for (const row of rows) {
        const server = $HammerfestServer.read(JSON_VALUE_READER, row.hammerfest_server);
        const id = $HammerfestUserId.read(JSON_VALUE_READER, row.hammerfest_user_id);
        const username = $HammerfestUsername.read(JSON_VALUE_READER, row.username);
        const link: HammerfestLink = {
          link: {time: row.ctime, user},
          unlink: null,
          user: {type: ObjectType.HammerfestUser, server, id, username},
        };
        switch (server) {
          case "hammerfest.es":
            hammerfestEs = link;
            break;
          case "hammerfest.fr":
            hammerfestFr = link;
            break;
          case "hfest.net":
            hfestNet = link;
            break;
          default:
            throw new Error("AssertionError: Unexpected hammerfest server");
        }
      }
    }
    {
      type TwinoidRow =
        Pick<TwinoidUserLinkRow, "twinoid_user_id" | "ctime">
        & Pick<TwinoidUserRow, "name">;
      const row: TwinoidRow | undefined = await queryable.oneOrNone(
        `
          SELECT twinoid_user_id, ctime, name
          FROM twinoid_user_links
                 INNER JOIN twinoid_users USING (twinoid_user_id)
          WHERE twinoid_user_links.user_id = $1::UUID;
        `,
        [userId],
      );
      if (row !== undefined) {
        const id = $TwinoidUserId.read(JSON_VALUE_READER, row.twinoid_user_id);
        const displayName = $TwinoidUserDisplayName.read(JSON_VALUE_READER, row.name);
        const link: TwinoidLink = {
          link: {time: row.ctime, user},
          unlink: null,
          user: {type: ObjectType.TwinoidUser, id, displayName},
        };
        twinoid = link;
      }
    }

    return {
      hammerfestEs: {
        current: hammerfestEs,
        old: [],
      },
      hammerfestFr: {
        current: hammerfestFr,
        old: [],
      },
      hfestNet: {
        current: hfestNet,
        old: [],
      },
      twinoid: {
        current: twinoid,
        old: [],
      }
    };
  }
}