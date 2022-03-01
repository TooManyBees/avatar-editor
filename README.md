# Midgaard Royal Surveyors' Guild

It's an area builder for Avatar MUD, written by Scevine. See https://www.toomanybees.com/avatar/builder.

## Todo

* \[*low priority*\] room doors should be keyed by direction, not a list
* \[*high priority*\] display parse errors
* \[*low priority*\] keyword inputs have delete buttons on keywords, rather than listening for backspace
* \[*medium priority*\] Undo/redo history????
* \[*medium priority*\] Selector components on areadata tab

## Known limitations

The Midgaard Royal Surveyors' Guild does not guarantee that it will parse and serialize an area file with 100% fidelity. The following limitations are known and probably will not be fixed.

* Reset comments that appear on their own lines (not on the same line as a reset) get stripped
* Ordering of resets is not preserved. They are always sorted by vnum, except for inv/eq resets which are grouped with their associated mob reset.
* On multi-line strings (descriptions, edescs, door descs, adescs, kspawns) trailing whitespace will be trimmed a single newline.
* You can make wonky areas by giving 2 mobiles/objects/rooms the same vnum, or giving 2 room doors the same direction. Just™ don't do that.

## Building

`npm run build` for the hosted app on toomanybees dot com

`npm run build-portable` for the app that runs directly from the file system

## Contributing

Contributors must follow a strict code of conduct:

1. indent with tabs
2. bee awesome to each other
