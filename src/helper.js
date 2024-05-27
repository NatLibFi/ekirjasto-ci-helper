//import path from 'path'
import { Octokit } from "@octokit/rest";
import _sodium from "libsodium-wrappers";
import 'zx/globals'

import { exitCodes } from "./exit-codes.js"
import {
  exit,
} from './util.js'

let octokit
let octokitDefaults
let publicKey = {
  key: null,
  key_id: null,
}

async function init(argv) {
  if (!argv.token) {
    exit(exitCodes.ERROR_GITHUB_TOKEN_REQUIRED, "GitHub token is required (set in the GITHUB_TOKEN environment variable)")
  }
  
  octokitDefaults = {
    headers: {
      "X-GitHub-Api-Version": argv.apiVersion
    },
    owner: argv.owner,
    repo: argv.repo,
  }
  octokit = new Octokit({ auth: argv.token })

  publicKey = await getPublicKey()
}

/**
 * Run the default command (no command specified).
 * @param {*} argv Arguments from the command line (yargs).
 */
export async function runDefault(argv) {
  console.log("runDefault()")
  //console.log("argv:", argv)
  await init(argv)

  //console.log(await $`git status`)
  console.log("Nothing to do, please select a command! See --help")
}


/**
 * Run "list-secrets" command.
 * @param {*} argv Arguments from the command line (yargs).
 */
export async function runListSecrets(argv) {
  console.log("runListSecrets()")
  //console.log("argv:", argv)
  await init(argv)

  const secrets = await getSecrets()
  console.log("Secrets:", secrets)

  console.log("\nDone!\n")
}


/**
 * Run "delete-secret" command.
 * @param {*} argv Arguments from the command line (yargs).
 */
export async function runDeleteSecret(argv) {
  console.log("runDeleteSecret()")
  //console.log("argv:", argv)
  await init(argv)

  await deleteSecret(argv.secretName)

  console.log("\nDone!\n")
}


/**
 * Run "set-secret" command.
 * @param {*} argv Arguments from the command line (yargs).
 */
export async function runSetSecret(argv) {
  console.log("runSetSecret()")
  //console.log("argv:", argv)
  await init(argv)

  await setSecret(argv.secretName, argv.secretValue)

  console.log("\nDone!\n")
}


/**
 * Run "set-secret-file" command.
 * @param {*} argv Arguments from the command line (yargs).
 */
export async function runSetSecretFile(argv) {
  console.log("runSetSecretFile()")
  //console.log("argv:", argv)
  await init(argv)

  const contents = fs.readFileSync(argv.secretFilepath, {encoding: "base64"})
  console.log("contents:", contents)

  await setSecret(argv.secretName, contents)

  console.log("\nDone!\n")
}


/**
 * Delete a repository secret.
 * @param {String} secretName  Name of the secret.
 */
async function deleteSecret(secretName) {
  const response = await octokit.request(
    "DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}",
    {
      ...octokitDefaults,
      secret_name: secretName,
    }
  )

  console.log("response:", response)
}


/**
 * Encrypt a secret using the repository public key.
 * @param {String} secretValue  Plaintext secret to encrypt.
 * @returns {String} The encrypted secret in Base64.
 */
async function encryptSecret(secretValue) {
  await _sodium.ready
  const sodium = _sodium

  // Convert the secret and key to a Uint8Array.
  const keyBytes = sodium.from_base64(publicKey.key, sodium.base64_variants.ORIGINAL)
  const secretBytes = sodium.from_string(secretValue)

  // Encrypt the secret using libsodium
  const encryptedBytes = sodium.crypto_box_seal(secretBytes, keyBytes)

  // Convert the encrypted Uint8Array to Base64
  const encryptedSecret = sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL)

  return encryptedSecret
}


/**
 * Get the repository public key.
 * @returns {String} The repository public key.
 */
async function getPublicKey() {
  const { data: publicKey } = await octokit.request(
    'GET /repos/{owner}/{repo}/actions/secrets/public-key',
    octokitDefaults
  )
  //console.log("publicKey:", publicKey)
  return publicKey
}


/**
 * Get repository secrets.
 * @returns The list of repository secrets.
 */
async function getSecrets() {
  const { data: secrets } = await octokit.request(
    "GET /repos/{owner}/{repo}/actions/secrets",
    octokitDefaults
  )

  return secrets
}


/**
 * Set a repository secret.
 * @param {String} secretName  Name of the secret.
 * @param {String} secretValue  Value of the secret.
 */
async function setSecret(secretName, secretValue) {
  const encryptedSecret = await encryptSecret(secretValue)
  console.log("encryptedSecret:", encryptedSecret)
  const response = await octokit.request(
    "PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}",
    {
      ...octokitDefaults,
      secret_name: secretName,
      encrypted_value: encryptedSecret,
      key_id: publicKey.key_id,
    }
  )

  console.log("response:", response)
}
