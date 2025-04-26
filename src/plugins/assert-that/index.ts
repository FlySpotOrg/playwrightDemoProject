import admZip from "adm-zip";
import fs from "fs";
import path from "path";
import request from "superagent";

import type { FeatureJSON, Settings } from "./interfaces";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parser = require("gherkin-parse");

export default class AssertThatPlugin {
  private readonly features_url: string;
  private readonly mode: "automated" | "manual" | "both";
  private readonly jql: string;
  private readonly tags: string;
  private readonly numbered: string;
  private readonly access_key: string;
  private readonly secret_key: string;
  private readonly output_folder: string;

  constructor(settings: Settings) {
    this.features_url = settings.jiraServerUrl
      ? settings.jiraServerUrl + "/rest/assertthat/latest/project/" + settings.projectId + "/client/features"
      : "https://bdd.assertthat.app/rest/api/1/project/" + settings.projectId + "/features";

    this.mode = settings.mode || "both";
    this.jql = settings.jql;
    this.tags = settings.tags;
    this.numbered = settings.numbered;
    this.access_key = settings.access_key;
    this.secret_key = settings.secret_key;
    this.output_folder = settings.output_folder || "download";
  }

  /**
   *
   */
  downloadFeatures(callback) {
    if (!fs.existsSync(this.output_folder)) {
      fs.mkdirSync(this.output_folder);
    }

    if (!this.jql) {
      throw new Error("Please define JQL query to fetch scenario(s)!");
    }

    const req = request.get(this.features_url);

    req.query({ jql: this.jql });
    req.query({ mode: this.mode });
    req.query({ tags: this.tags });
    req.query({ numbered: this.numbered });

    req
      .auth(this.access_key, this.secret_key)
      .on("error", function (error) {
        console.log(error);
      })
      .on("response", function (response) {
        if (response.status !== 200) {
          console.log("Failed to download feature files: " + response.text);
          req.abort();

          return;
        }

        console.log("Features fetching done.");
      })
      .pipe(fs.createWriteStream(this.output_folder + "/features.zip"))
      .on("finish", () => {
        const zip = new admZip(this.output_folder + "/features.zip");
        // const entries = zip.getEntries();

        zip.extractAllTo(this.output_folder, true);
        fs.unlinkSync(this.output_folder + "/features.zip");

        const files = fs.readdirSync(path.resolve(this.output_folder)).filter((file) => !/^.DS_Store$/.test(file));

        const features: FeatureJSON[] = files.map((file) =>
          parser.convertFeatureFileToJSON(path.resolve(this.output_folder, file))
        );

        if (!features.length) {
          console.log(`\nNo scenarios found within ${this.jql} with tags ${this.tags}.\n`);
          return;
        }

        callback(features);

        files.forEach((file) => {
          fs.unlinkSync(path.resolve(this.output_folder, file));
        });
      });
  }
}
