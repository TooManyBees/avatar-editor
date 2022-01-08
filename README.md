# Midgaard Royal Surveyors' Guild

It's an area builder for Avatar MUD, written by Scevine.

## Todo

* portable build should not include source maps
* room doors should be keyed by direction, not a list
* allow "fixing" orphaned resets, specials, shops
* display parse errors

## Known limitations

The Midgaard Royal Surveyors' Guild does not guarantee that it will parse and serialize an area file with 100% fidelity. The following limitations are known and probably will not be fixed.

* Ordering of resets is not preserved. They are always sorted by vnum, except for inv/eq resets which are placed immediately after their associated mob reset.

## Building

`npm run build` for the hosted app on toomanybees dot com

`npm run build-portable` for the app that runs directly from the file system
