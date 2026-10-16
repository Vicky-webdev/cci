#!/usr/bin/env node
// Extracts the inline India SVG (paths + UT links) from _public_html/crafts-map.html into
// src/components/crafts-map/india-map.json. Geometry is static code-like data, not CMS content.
import fs from "node:fs";
import * as cheerio from "cheerio";

const $ = cheerio.load(fs.readFileSync("_public_html/crafts-map.html", "utf8"));
const svg = $("svg").filter((_, el) => $(el).find("path.state-path, path[data-name]").length > 5).first();
const paths = svg
  .find("path")
  .toArray()
  .map((p) => ({
    state: $(p).attr("data-state") ?? null,
    name: $(p).attr("data-name") ?? "",
    d: $(p).attr("d") ?? "",
    interactive: ($(p).attr("class") ?? "").includes("state-path"),
  }));
const utLinks = $(".map-svg-wrap > span.state-path")
  .toArray()
  .map((s) => ({ state: $(s).attr("data-state"), label: $(s).text().trim() }));
const out = { viewBox: svg.attr("viewBox"), source: "Generated from amCharts geodata | Mercator projection (comment in legacy crafts-map.html)", paths, utLinks };
fs.writeFileSync("src/components/crafts-map/india-map.json", JSON.stringify(out));
console.log(`paths: ${paths.length}, UT links: ${utLinks.length}`);
