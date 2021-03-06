use once_cell::sync::Lazy;
use serde::Deserialize;
use std::fs;
use std::io;
use std::path::{Path, PathBuf};
use url::Url;

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Deserialize)]
pub struct Config {
  pub etwin: EtwinConfig,
  pub db: DbConfig,
  pub mailer: Option<MailerConfig>,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Deserialize)]
pub struct EtwinConfig {
  pub http_port: u16,
  pub external_uri: Url,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Deserialize)]
pub struct DbConfig {
  pub host: String,
  pub port: u16,
  pub name: String,
  pub admin_user: String,
  pub admin_password: String,
  pub user: String,
  pub password: String,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Deserialize)]
pub struct MailerConfig {
  pub host: String,
  pub username: String,
  pub password: String,
  pub sender: String,
  pub headers: Option<Vec<MailerHeader>>,
}

#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Deserialize)]
pub struct MailerHeader {
  pub name: String,
  pub value: String,
}

#[derive(Debug)]
pub enum FindConfigFileError {
  NotFound(PathBuf),
  Other(PathBuf, io::Error),
}

#[derive(Debug)]
pub enum FindConfigError {
  NotFound(PathBuf),
  ParseError(toml::de::Error),
  Other(PathBuf, io::Error),
}

fn find_config_file(dir: PathBuf) -> Result<(PathBuf, String), FindConfigFileError> {
  for d in dir.ancestors() {
    let config_path = d.join("etwin.toml");
    match fs::read_to_string(&config_path) {
      Ok(toml) => return Ok((config_path, toml)),
      Err(e) if e.kind() == io::ErrorKind::NotFound => continue,
      Err(e) => return Err(FindConfigFileError::Other(dir, e)),
    }
  }
  Err(FindConfigFileError::NotFound(dir))
}

pub fn parse_config(_file: &Path, config_toml: &str) -> Result<Config, toml::de::Error> {
  let raw: Config = toml::from_str(config_toml)?;
  Ok(raw)
}

pub fn find_config(dir: PathBuf) -> Result<Config, FindConfigError> {
  match find_config_file(dir) {
    Ok((file, config_toml)) => match parse_config(&file, &config_toml) {
      Ok(config) => Ok(config),
      Err(e) => Err(FindConfigError::ParseError(e)),
    },
    Err(FindConfigFileError::NotFound(dir)) => Err(FindConfigError::NotFound(dir)),
    Err(FindConfigFileError::Other(dir, cause)) => Err(FindConfigError::Other(dir, cause)),
  }
}

pub static DEFAULT: Lazy<Config> = Lazy::new(|| Config {
  etwin: EtwinConfig {
    http_port: 50320,
    external_uri: Url::parse("http://localhost:50320/").unwrap(),
  },
  db: DbConfig {
    host: "localhost".to_string(),
    port: 5432,
    name: "etwin.dev".to_string(),
    admin_user: "etwin.dev.admin".to_string(),
    admin_password: "dev".to_string(),
    user: "etwin.dev.admin".to_string(),
    password: "dev".to_string(),
  },
  mailer: None,
});

#[cfg(test)]
mod test {
  use crate::{parse_config, DEFAULT};

  #[test]
  fn test_default_config() {
    const INPUT: &str = r#"
[etwin]
http_port = 50320
external_uri = "http://localhost:50320"

[db]
host = "localhost"
port = 5432
name = "etwin.dev"
admin_user = "etwin.dev.admin"
admin_password = "dev"
user = "etwin.dev.admin"
password = "dev"
    "#;
    let path = std::env::current_dir().unwrap().join("etwin.toml");
    let actual = parse_config(&path, INPUT);
    let expected = Ok(DEFAULT.clone());
    assert_eq!(actual, expected);
  }
}
