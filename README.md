# Midgaard Royal Surveyors' Guild

It's an area builder for Avatar MUD, written by Scevine. See https://www.toomanybees.com/avatar/builder.

## Todo

* portable build should not include source maps
* room doors should be keyed by direction, not a list
* display parse errors
* when changing tabs or selected mob/obj/room, only refocus cursor when it's performed by keyboard input

## Known limitations

The Midgaard Royal Surveyors' Guild does not guarantee that it will parse and serialize an area file with 100% fidelity. The following limitations are known and probably will not be fixed.

* Ordering of resets is not preserved. They are always sorted by vnum, except for inv/eq resets which are grouped with their associated mob reset.

## Building

`npm run build` for the hosted app on toomanybees dot com

`npm run build-portable` for the app that runs directly from the file system

## Contributing

Contributors must follow a strict code of conduct:

1. indent with tabs
2. bee awesome to each other
