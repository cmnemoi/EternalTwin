<?php declare(strict_types=1);

namespace Etwin\Test\Auth;

use Etwin\Auth\AccessTokenAuthContext;
use Etwin\Auth\AuthScope;
use Etwin\Auth\AuthContext;
use Etwin\Auth\GuestAuthContext;
use Etwin\Auth\UserAuthContext;
use Etwin\Oauth\OauthClientDisplayName;
use Etwin\Oauth\OauthClientId;
use Etwin\Oauth\OauthClientKey;
use Etwin\Oauth\ShortOauthClient;
use Etwin\Test\SerializationTestItem;
use Etwin\User\ShortUser;
use Etwin\User\UserDisplayName;
use Etwin\User\UserDisplayNameVersion;
use Etwin\User\UserDisplayNameVersions;
use Etwin\User\UserId;
use PHPUnit\Framework\TestCase;

final class AuthContextTest extends TestCase {
  /**
   * @dataProvider provideFromJson
   * @param SerializationTestItem $item
   */
  public function testFromJson(SerializationTestItem $item): void {
    $actual = AuthContext::fromJson($item->getJson());
    $this->assertEquals($item->getValue(), $actual);
  }

  public function provideFromJson(): array {
    return SerializationTestItem::fromTestDir(
      "auth/auth-context",
      [
        "demurgos" => new UserAuthContext(
          AuthScope::Default(),
          new ShortUser(
            UserId::fromString("9f310484-963b-446b-af69-797feec6813f"),
            new UserDisplayNameVersions(new UserDisplayNameVersion(new UserDisplayName("Demurgos")), []),
          ),
          true,
        ),
        "eternalfest-demurgos" => new AccessTokenAuthContext(
          AuthScope::Default(),
          new ShortOauthClient(
            OauthClientId::fromString("d19e61a3-83d3-410f-84ec-49aaab841559"),
            new OauthClientKey("eternalfest@clients"),
            new OauthClientDisplayName("Eternalfest"),
          ),
          new ShortUser(
            UserId::fromString("9f310484-963b-446b-af69-797feec6813f"),
            new UserDisplayNameVersions(new UserDisplayNameVersion(new UserDisplayName("Demurgos")), []),
          ),
        ),
        "guest" => new GuestAuthContext(
          AuthScope::Default(),
        ),
      ],
    );
  }
}
