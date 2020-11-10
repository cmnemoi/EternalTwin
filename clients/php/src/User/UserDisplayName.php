<?php declare(strict_types=1);

namespace Etwin\User;

final class UserDisplayName implements \JsonSerializable {
  private string $inner;

  final public function __construct(string $inner) {
    $this->inner = $inner;
  }

  final public function getInner(): string {
    return $this->inner;
  }

  final public function toString(): string {
    return $this->inner;
  }

  final public function __toString(): string {
    return $this->toString();
  }

  final public function jsonSerialize(): string {
    return $this->inner;
  }

  /**
   * @param mixed $raw
   * @return self
   */
  final public static function jsonDeserialize($raw): self {
    return new UserDisplayName($raw);
  }
}
