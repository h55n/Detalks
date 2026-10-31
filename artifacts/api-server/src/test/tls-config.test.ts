import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveTlsConfig } from "@workspace/db";

const URL_REQUIRE = "postgres://u:p@db.example.com:5432/detalks?sslmode=require";

test("sslmode=require without a CA keeps encrypted-but-unverified TLS", () => {
  const tls = resolveTlsConfig(URL_REQUIRE, {});
  assert.deepEqual(tls.ssl, { rejectUnauthorized: false });
  assert.equal(tls.cleanedConnectionString.includes("sslmode"), false);
});

test("a PEM CA in DATABASE_CA_CERT upgrades to full chain verification", () => {
  const pem = "-----BEGIN CERTIFICATE-----\nMIIBszCCAVmgAwIBAgIU...\n-----END CERTIFICATE-----";
  const tls = resolveTlsConfig(URL_REQUIRE, { DATABASE_CA_CERT: pem });
  assert.equal(tls.ssl?.rejectUnauthorized, true);
  assert.equal(tls.ssl?.ca, pem);
});

test("a malformed CA value is ignored rather than half-applied", () => {
  const tls = resolveTlsConfig(URL_REQUIRE, { DATABASE_CA_CERT: "not a pem" });
  assert.deepEqual(tls.ssl, { rejectUnauthorized: false });
});

test("non-TLS connections stay untouched", () => {
  const tls = resolveTlsConfig("postgres://u:p@localhost:5432/detalks", {
    DATABASE_CA_CERT: "-----BEGIN CERTIFICATE-----\nx\n-----END CERTIFICATE-----",
  });
  assert.equal(tls.ssl, undefined);
});
