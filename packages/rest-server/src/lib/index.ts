import { AnnouncementService } from "@eternal-twin/core/lib/announcement/service.js";
import { AuthService } from "@eternal-twin/core/lib/auth/service.js";
import { UserService } from "@eternal-twin/core/lib/user/service.js";
import Koa from "koa";
import koaMount from "koa-mount";

import { createAnnouncementsRouter } from "./announcements.js";
import { createAuthRouter } from "./auth.js";
import { KoaAuth } from "./helpers/koa-auth.js";
import { createUsersRouter } from "./users.js";

export interface Api {
  announcement: AnnouncementService;
  auth: AuthService;
  koaAuth: KoaAuth;
  user: UserService;
}

export function createApiRouter(api: Api): Koa {
  const router: Koa = new Koa();

  router.use(koaMount("/announcements", createAnnouncementsRouter(api)));
  router.use(koaMount("/auth", createAuthRouter(api)));
  router.use(koaMount("/users", createUsersRouter(api)));

  router.use((ctx: Koa.Context) => {
    ctx.response.status = 404;
    ctx.body = {error: "ResourceNotFound"};
  });

  return router;
}
