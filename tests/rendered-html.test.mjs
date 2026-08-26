import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const distDirectory = resolve("dist");
const html = await readFile(resolve(distDirectory, "index.html"), "utf8");
const summary = JSON.parse(
  await readFile(
    resolve(distDirectory, "evidence", "artifacts", "summary.json"),
    "utf8",
  ),
);

test("builds the public portfolio metadata and evidence links", () => {
  assert.match(html, /<html\s+lang="nl">/i);
  assert.match(html, /<title>Amsterdam 750 - Engineering Case Study<\/title>/i);
  assert.match(html, /https:\/\/github\.com\/Gozzy82\/amsterdam750-public/);
  assert.match(html, /\.\/evidence\/load-test-methodology\.html/);
  assert.match(
    html,
    /https:\/\/gozzy82\.github\.io\/amsterdam750-public\//,
  );
  assert.doesNotMatch(html, /signin-with-chatgpt|oai-authenticated-user/i);
});

test("references assets that exist in the production build", async () => {
  const assetReferences = [
    ...html.matchAll(/(?:href|src)="(\.\/assets\/[^"]+)"/g),
  ].map((match) => match[1]);

  assert.ok(assetReferences.length > 0, "expected at least one generated asset");
  await Promise.all(
    assetReferences.map((assetPath) =>
      access(resolve(distDirectory, assetPath.slice(2))),
    ),
  );
});

test("publishes internally consistent load-test evidence", async () => {
  assert.equal(summary.preregisterSubmit.count, 126124);
  assert.equal(summary.preregisterSubmit.successful, 126124);
  assert.equal(summary.preregisterSubmit.failed, 0);
  assert.equal(summary.preregisterSubmit.p95Milliseconds, 634);
  assert.equal(
    summary.allRequests.count,
    summary.preregisterSubmit.count + summary.corsPreflight.count,
  );

  await Promise.all(
    [
      "azure-load-test-input-artifacts.zip",
      "azure-load-test-results-csv.zip",
      "azure-load-test-logs.zip",
      "SHA256SUMS.txt",
    ].map((fileName) =>
      access(resolve(distDirectory, "evidence", "artifacts", fileName)),
    ),
  );
});
