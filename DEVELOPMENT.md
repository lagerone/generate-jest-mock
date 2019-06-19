# Development

## Link

Checkout this repo and link this package name to you local copy:

1. CD to this repo and run `npm link`
1. Link a local global install to this repo by running `npm link --local generate-jest-mock`

## Unlink

1. `npm unlink --local generate-jest-mock`
1. CD to this repo and run `npm unlink`

## Bump a package version

Commit your changes and bump the version using [npm-version](https://docs.npmjs.com/cli/version.html), e.g:

```bash
npm version patch # v0.0.x
npm version minor # v0.x.0
npm version major # vx.0.0
```

When you bump version the following scripts will be triggered:

1. `npm run version`: runs the build command and git stages the build output with the bumped version tag
1. `npm run postversion`: pushes the changes and tags to remote
