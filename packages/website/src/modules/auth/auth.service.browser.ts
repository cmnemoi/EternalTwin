import { Injectable } from "@angular/core";
import { TransferState } from "@angular/platform-browser";
import { $AuthContext, AuthContext } from "@eternal-twin/etwin-api-types/lib/auth/auth-context";
import { AuthScope } from "@eternal-twin/etwin-api-types/lib/auth/auth-scope";
import { AuthType } from "@eternal-twin/etwin-api-types/lib/auth/auth-type";
import {
  $RegisterWithUsernameOptions,
  RegisterWithUsernameOptions,
} from "@eternal-twin/etwin-api-types/lib/auth/register-with-username-options";
import { UserAuthContext } from "@eternal-twin/etwin-api-types/lib/auth/user-auth-context";
import { $User, User } from "@eternal-twin/etwin-api-types/lib/user/user";
import { JsonValueReader } from "kryo-json/lib/json-value-reader";
import { concat as rxConcat, NEVER as RX_NEVER,Observable, of as rxOf, ReplaySubject } from "rxjs";
import { map as rxMap, tap as rxTap } from "rxjs/operators";

import { RestService } from "../rest/rest.service";
import { AuthService } from "./auth.service";
import { AUTH_CONTEXT_KEY, RawAuthContext } from "./state-keys";

const JSON_VALUE_READER: JsonValueReader = new JsonValueReader();

const GUEST_AUTH_CONTEXT: AuthContext = {type: AuthType.Guest, scope: AuthScope.Default};

@Injectable()
export class BrowserAuthService extends AuthService {
  private readonly rest: RestService;
  private readonly auth$: ReplaySubject<AuthContext>;

  constructor(transferState: TransferState, rest: RestService) {
    super();
    this.rest = rest;

    let firstAuth: Observable<AuthContext>;

    const transferredAuth: RawAuthContext | undefined = transferState.get(AUTH_CONTEXT_KEY, undefined);
    if (transferredAuth !== undefined) {
      let auth: AuthContext = GUEST_AUTH_CONTEXT;
      try {
        auth = $AuthContext.read(JSON_VALUE_READER, transferredAuth);
      } catch (err) {
        console.error(err);
      }
      firstAuth = rxOf(auth);
    } else {
      firstAuth = this.getSelf();
    }

    // Prevent the `complete` event.
    const infFirstAuth: Observable<AuthContext> = rxConcat(firstAuth, RX_NEVER);

    this.auth$ = new ReplaySubject(1);
    infFirstAuth.subscribe(this.auth$);
  }

  public auth(): Observable<AuthContext> {
    return this.auth$;
  }

  public registerWithUsername(options: Readonly<RegisterWithUsernameOptions>): Observable<User> {
    return this.rest.post(["users"], $RegisterWithUsernameOptions, options, $User)
      .pipe(rxTap((user: User): void => {
        const auth: UserAuthContext = {
          type: AuthType.User,
          scope: AuthScope.Default,
          userId: user.id,
          displayName: user.displayName,
          isAdministrator: user.isAdministrator,
        };
        this.auth$.next(auth);
      }));
  }

  logout(): Observable<null> {
    return this.rest.delete(["auth", "self"], $AuthContext)
      .pipe(
        rxMap((): null => {
          this.auth$.next(GUEST_AUTH_CONTEXT);
          return null;
        }),
      );
  }

  private getSelf(): Observable<AuthContext> {
    return this.rest.get(["auth", "self"], $AuthContext);
  }
}