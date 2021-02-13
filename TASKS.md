# Tasks

## Updating sets

A member of the `@smogon` org on npm should update the `@smogon/sets` package monthly after usage stats are published, though they may also create patch releases on demand. After a new sets package has been released:

1. If you haven't done so already:
    * clone [`smogon/pokemon-showdown`](https://github.com/smogon/pokemon-showdown) into a `pokemon-showdown` directory which sits in the same parent directory as your clone of `smogon/damage-calc`.
    * run `npm install` and `node build`
2. Ensure your `pokemon-showdown` and `damage-calc` branches are fully up to date, make sure to have run `node build` in the `pokemon-showdown` directory after syncing.
3. `cd import/` and run [`ncu -u`](https://www.npmjs.com/package/npm-check-updates) to update to the latest `@smogon/sets` package (or manually update the version `package.json`).
4. `npm install` from within `import/`, then run `npm run compile`.
5. Run `./ps-import` (or `node ps-import` if you're on a Windows OS) to pull in tiers from `pokemon-showdown`
6. Run `./import` (or `node import` if you're on a Windows OS)
7. Run `node build` in the top level and open up the calc UI in the browser and sanity check that the sets generated in `../src/js/data` look OK (viewing them in your text editor is also recommend).
8. Commit the changes and push them to master. Only JSON files in `import/` (always `package.json`, sometimes `src/tiers.json`) should have changes as well as the files in `src/js/data`.

## Releasing a new `@smogon/calc` package

You must be part of the `@smogon` org on npm to be able to release this package.

1. Ensure your branch is fully up to date
2. Run `npm test` to ensure `calc/` is in a good state.
3. Update the the `version` field in `calc/package.json` to correctly reflect the new version according to the guidance around [semantic versioning](https://semver.org/).
4. **Be very sure everything is correct - you can not unpublish a version**.
5. Run `npm publish --access public` from within the `calc/` subdirectory.
