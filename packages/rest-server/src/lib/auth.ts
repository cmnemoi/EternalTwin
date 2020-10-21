import { $AuthContext, AuthContext } from "@eternal-twin/core/lib/auth/auth-context.js";
import { AuthMethod } from "@eternal-twin/core/lib/auth/auth-method.js";
import { AuthScope } from "@eternal-twin/core/lib/auth/auth-scope.js";
import { AuthType } from "@eternal-twin/core/lib/auth/auth-type.js";
import { $CreateSessionQuery, CreateSessionQuery } from "@eternal-twin/core/lib/auth/create-session-query.js";
import { $Credentials, Credentials } from "@eternal-twin/core/lib/auth/credentials.js";
import { GuestAuthContext } from "@eternal-twin/core/lib/auth/guest-auth-context.js";
import { AuthService } from "@eternal-twin/core/lib/auth/service.js";
import { UserAndSession } from "@eternal-twin/core/lib/auth/user-and-session.js";
import {
  $HammerfestCredentials,
  HammerfestCredentials,
} from "@eternal-twin/core/lib/hammerfest/hammerfest-credentials.js";
import { $MaybeCompleteUser } from "@eternal-twin/core/lib/user/maybe-complete-user.js";
import { UserService } from "@eternal-twin/core/lib/user/service.js";
import Koa from "koa";
import koaBodyParser from "koa-bodyparser";
import koaCompose from "koa-compose";
import koaRoute from "koa-route";
import { JSON_VALUE_READER } from "kryo-json/lib/json-value-reader.js";
import { JSON_VALUE_WRITER } from "kryo-json/lib/json-value-writer.js";
import { QsValueReader } from "kryo-qs/lib/qs-value-reader.js";

import { KoaAuth, SESSION_COOKIE } from "./helpers/koa-auth.js";

const QS_VALUE_READER: QsValueReader = new QsValueReader();

const GUEST_AUTH: GuestAuthContext = {type: AuthType.Guest, scope: AuthScope.Default};

export interface Api {
  auth: AuthService;
  koaAuth: KoaAuth;
  user: UserService;
}

export function createAuthRouter(api: Api): Koa {
  const router: Koa = new Koa();

  router.use(koaRoute.get("/self", getSelf));

  async function getSelf(cx: Koa.Context): Promise<void> {
    const auth: AuthContext = await api.koaAuth.auth(cx);
    cx.response.body = $AuthContext.write(JSON_VALUE_WRITER, auth);
  }

  router.use(koaRoute.put("/self", koaCompose([koaBodyParser(), createSession])));

  async function createSession(cx: Koa.Context): Promise<void> {
    let query: CreateSessionQuery;
    try {
      query = $CreateSessionQuery.read(QS_VALUE_READER, cx.request.query);
    } catch (_err) {
      cx.response.status = 422;
      cx.response.body = {error: "InvalidMethod"};
      return;
    }
    switch (query.method) {
      case AuthMethod.Etwin: {
        await createSessionWithCredentials(cx);
        break;
      }
      case AuthMethod.Hammerfest: {
        await createSessionWithHammerfestCredentials(cx);
        break;
      }
      case AuthMethod.Twinoid: {
        await createSessionWithTwinoidCredentials(cx);
        break;
      }
      default: {
        cx.response.status = 422;
        cx.response.body = {error: "InvalidMethod"};
      }
    }
  }

  async function createSessionWithCredentials(cx: Koa.Context): Promise<void> {
    const credentials: Credentials = $Credentials.read(JSON_VALUE_READER, cx.request.body);
    const result: UserAndSession = await api.auth.loginWithCredentials(GUEST_AUTH, credentials);
    cx.cookies.set(SESSION_COOKIE, result.session.id);
    const user = await api.user.getUserById(
      {type: AuthType.User, user: result.user, isAdministrator: result.user.isAdministrator, scope: AuthScope.Default},
      {id: result.user.id},
    );
    cx.response.body = $MaybeCompleteUser.write(JSON_VALUE_WRITER, user!);
  }

  async function createSessionWithHammerfestCredentials(cx: Koa.Context): Promise<void> {
    const credentials: HammerfestCredentials = $HammerfestCredentials.read(JSON_VALUE_READER, cx.request.body);
    const result: UserAndSession = await api.auth.registerOrLoginWithHammerfest(GUEST_AUTH, credentials);
    cx.cookies.set(SESSION_COOKIE, result.session.id);
    const user = await api.user.getUserById(
      {type: AuthType.User, user: result.user, isAdministrator: result.user.isAdministrator, scope: AuthScope.Default},
      {id: result.user.id},
    );
    cx.response.body = $MaybeCompleteUser.write(JSON_VALUE_WRITER, user!);
  }

  async function createSessionWithTwinoidCredentials(cx: Koa.Context): Promise<void> {
    cx.response.status = 500;
  }

  router.use(koaRoute.delete("/self", deleteSession));

  async function deleteSession(cx: Koa.Context): Promise<void> {
    cx.cookies.set(SESSION_COOKIE, "");
    cx.response.body = $AuthContext.write(JSON_VALUE_WRITER, GUEST_AUTH);
  }

  return router;
}
