import * as dotenv from "dotenv";
import fs from "fs";
import _ from "lodash";
import path from "path";

import AssertThatPlugin from "../plugins/assert-that";
import type { FeatureJSON } from "../plugins/assert-that/interfaces";
// import { logger } from "../utility/logger";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const yargs = require("yargs");

dotenv.config({ path: path.join(process.cwd(), "/envs/.env") });

const { argv } = yargs(process.argv.slice(2)).options({
  jql: {
    alias: "j",
    default: null,
    describe: "JIRA JQA query",
    type: "string",
  },
  tags: {
    alias: "t",
    default: null,
    describe: "Cucumber scenario tags",
    type: "string",
  },
  mode: {
    alias: "m",
    default: "both",
    describe: "Scenario AssertThat mode",
    type: "string",
  },
  path: {
    alias: "p",
    default: null,
    describe: 'Path where the spec file should generated. Started from "playwright/features"',
    type: "string",
  },
});

if (!argv.tags.includes("@apiOnly") && !argv.tags.includes("@uiOnly")) {
  throw new Error("The following tags are required to be passed within '-t' or '--tags' flag: @apiOnly or @ui");
}

const plugin = new AssertThatPlugin({
  projectId: process.env.JIRA_PROJECT_ID,
  access_key: process.env.ASSERTTHAT_ACCESS_KEY,
  secret_key: process.env.ASSERTTHAT_SECRET_KEY,
  tags: argv.tags ? `${argv.tags} and not(@manualOnly)` : "not(@manualOnly)",
  jql: argv.jql,
  mode: argv.mode as "automated" | "manual" | "both",
  output_folder: "./download",
});

plugin.downloadFeatures((feature_file: FeatureJSON[]) => write_generated_spec(feature_file));

/**
 *
 */
function generate_template({ feature }: FeatureJSON, file_path: string) {
  const describe_template = `\ntest.describe('<%= Title =%>', function () { <%= Nested =%> });`;
  const nesting_template = `<%= Nested =%>`;
  const splitted_titles = feature.name.split(": ");

  const describe_tree = splitted_titles.reduce((acc, title, counter) => {
    let generated_describe = acc.replace("<%= Title =%>", to_title_case(title));

    if (counter === splitted_titles.length - 1) {
      return generated_describe;
    } else {
      generated_describe = generated_describe.replace(nesting_template, describe_template);
    }

    return generated_describe;
  }, describe_template);

  const file_header = `
  import '${path.relative(file_path, "src/hooks/before-each")}';

  import {test}  from '${path.relative(file_path, "src/features/test-base")}';\n`;

  const test_body = `${feature.children
    .filter(({ type }) => type === "Scenario")
    .reduce((acc, scenario) => {
      const { name, steps, tags, keyword } = scenario;
      const extracted_tags: string = tags
        .reduce((acc, { name }) => {
          if (name === "@MANUAL" || name === "@AUTOMATED") return acc;

          return acc.concat(name + " ");
        }, "")
        .trimEnd();

      // logger.debug(`Playwright spec is generating for: "${keyword}: ${name}"`);

      return acc.concat(`
    test('${name} ${extracted_tags}', async () => {
           ${steps.reduce((acc, { keyword, text }) => {
             return acc.concat(`
             await test.step('${keyword}${text}', async () => {
              
             })`);
           }, ``)}
        });\n`);
    }, ``)}`;

  const spec_tree = describe_tree.replace(nesting_template, test_body);

  return `${file_header}${spec_tree}`;
}

/**
 *
 */
function write_generated_spec(feature_file: FeatureJSON[]) {
  feature_file.forEach((file, index) => {
    const path_parts = file.feature.name
      .split(": ")
      .map((title) => _.upperFirst(_.camelCase(title)))
      .join("/");
    const test_level = file.feature.children
      .filter(({ type }) => type === "Scenario")
      .every((scenario) => scenario.tags.some((tag) => tag.name === "@apiOnly") === true);
    const full_path = path.resolve(
      path.join("src", "features", (argv.path || path_parts) as string, test_level ? "api" : "ui")
    );

    // logger.debug(`\nThe Playwright spec will be generate on path: ${full_path}\n`);

    if (!fs.existsSync(full_path)) {
      fs.mkdirSync(full_path, { recursive: true });
    }

    fs.writeFileSync(
      path.resolve(`${full_path}/playwright-template${argv.path ? `-${index}` : ""}.spec.ts`),
      generate_template(file, full_path),
      "utf-8"
    );
  });
}

const to_title_case = (phrase: string) => {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
