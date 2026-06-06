import pkg from "../../package.json";

export const DATASET_VERSION: string = (pkg as { version: string }).version;

export const CHANGELOG_URL = "https://github.com/systemslibrarian/crypto-compare/blob/main/CHANGELOG.md";
