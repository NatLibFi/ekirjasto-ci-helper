# ekirjasto-ci-helper

`ekirjasto-ci-helper` is a small app to help with managing secrets in
E-kirjasto's CI workflows (GitHub Actions).

Prerequisites:
- Node 22+
- Yarn

The repository uses Yarn's "zero-installs" pattern,
so you should be able to run the app directly after cloning.

The app reads your GitHub personal access token from an environment
variable named GITHUB_TOKEN. You have to be a member (or admin) in the
repository where you want to access the secrets.

To see the available commands, just run:  
`yarn helper --help`

To see help for a specific command, run something like:  
`yarn helper set-secret --help`

