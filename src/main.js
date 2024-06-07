#!/usr/bin/env node

/**
 * Main entrypoint.
 */

import esMain from 'es-main'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import 'zx/globals'

import * as helper from './helper.js'


/**
 * Main function (only run if not imported).
 */
export async function main() {
  // Parse arguments with Yargs
  const yarg = yargs(hideBin(process.argv))
  await yarg
    .strict()
    .wrap(Math.min(120, yarg.terminalWidth()))
    .scriptName("helper")
    .usage("E-kirjasto CI helper")
    // Help text
    .help()
    .alias("help", "h")
    // --api-version=...
    .option("api-version", {
      describe: "GitHub API version",
      default: "2022-11-28",
    })
    // --owner=...
    .option("owner", {
      describe: "GitHub repository owner",
      default: "NatLibFi",
    })
    // --repo=...
    .option("repo", {
      describe: "GitHub repository",
      default: "ekirjasto-android-core",
    })
    // --token=...
    .option("token", {
      describe: "GitHub personal access token",
      default: process.env.GITHUB_TOKEN,
      defaultDescription: "GITHUB_TOKEN environment variable"
    })
    .command("$0",
      "Default command (does nothing)",
      () => {},
      helper.runDefault
    )
    .command("list-secrets",
      "List repository secrets",
      () => {},
      helper.runListSecrets
    )
    .command("set-secret <secret-name> <secret-value>",
      "Set a repository secret",
      () => {},
      helper.runSetSecret
    )
    .command("set-secret-file <secret-name> <secret-filepath>",
      "Set a repository secret from a file (will be base64 encoded)",
      () => {},
      helper.runSetSecretFile
    )
    .command("set-secret-file-raw <secret-name> <secret-filepath>",
      "Set a repository secret from a file (raw content, not base64 encoded)",
      () => {},
      helper.runSetSecretFileRaw
    )
    .command("delete-secret <secret-name>",
      "Delete a repository secret",
      () => {},
      helper.runDeleteSecret
    )
    // Parse arguments
    .parse()
}

// Run main function if running directly (and not imported)
if (esMain(import.meta)) {
  await main()
}
