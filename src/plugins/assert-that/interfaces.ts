interface Tags {
  type: string;
  location: {
    line: number;
    column: number;
  };
  name: string;
}

interface Steps {
  type: string;
  location: {
    line: number;
    column: number;
  };
  keyword: string;
  text: string;
  argument: undefined;
}

interface Children {
  type: string;
  tags: Tags[];
  location: {
    line: number;
    column: number;
  };
  keyword: string;
  name: string;
  description: undefined | string;
  steps: Steps[];
}

interface Feature {
  type: string;
  tags: Tags[];
  location: {
    line: number;
    column: number;
  };
  language: string;
  keyword: string;
  name: string;
  description: string;
  children: Children[];
}

export interface FeatureJSON {
  type: string;
  feature: Feature;
  comments: string[];
}

export interface Settings {
  features_url?: string;
  mode?: "automated" | "manual" | "both";
  jql?: string;
  tags?: string;
  jiraServerUrl?: string;
  projectId: string;
  numbered?: string;
  access_key: string;
  secret_key: string;
  output_folder?: string;
}
