import serializeResets from "./resets";
import parseFile from "../parser";

describe("serializeResets", () => {
	test("serializes a resets section", () => {
		const area = parseFile(RESETS);
		expect(serializeResets(area.resets)).toBe(RESETS);
	});

	test("serializes the links between vnum items", () => {
		const area = parseFile(AREA_AND_RESETS + REST_OF_AREA);
		// Alter the vnums to ensure the links are actually being looked up
		area.mobiles.forEach(m => m.vnum += 100);
		area.objects.forEach(o => o.vnum += 100);
		area.rooms.forEach(r => r.vnum += 100);
		const result = serializeResets(area.resets, area.mobiles, area.objects, area.rooms)
		expect(result).toBe(AREA_AND_RESETS.replace(/107/g, "108"));
	});

	const RESETS = `#RESETS
M 0 10717 1 10783 * featureless druid in "Along a stone path"
E 0 10733 0 16    * wields: wooden crossbow
E 0 10779 0 17    * holds: standard bolts
G 0 133 0         * inventory: fletching kit
O 0 10757 0 10740 * fountain (keyword statue), container, in "Within a..."
P 0 10767 0 10757 * clay shard within fountain
D 0 10752 3 2     * locked door into "Rotten core"
D 0 10753 1 2     * locked door out of "Rotten core"
R 0 10770 3
S
`;

	const AREA_AND_RESETS = `#RESETS
M 0 10717 1 10777 * featureless druid in "Along a stone path"
E 0 10733 0 16    * wields: wooden crossbow
G 0 10766 0         * inventory: fletching kit
O 0 10757 0 10777 * fountain (keyword statue), container, in "Within a..."
P 0 10767 0 10757 * clay shard within fountain
D 0 10777 3 2     * locked door into "Rotten core"
R 0 10777 3
S
`;

	const REST_OF_AREA = `
#MOBILES
#10717
name~
short-desc~
long-desc~
desc
~
1 0 0 S
1 0 0
0d0+0 0d0+0 0 0
0 0 0
#0

#OBJECTS
#10766
name~
short-desc~
long-desc~
action-desc~
1 0 1
0 0 0 0
0 0 0 0
#10733
name~
short-desc~
long-desc~
action-desc~
1 0 1
0 0 0 0
0 0 0 0
#10757
name~
short-desc~
long-desc~
action-desc~
1 0 1
0 0 0 0
0 0 0 0
#10767
name~
short-desc~
long-desc~
action-desc~
1 0 1
0 0 0 0
0 0 0 0
#0

#ROOMS
#10777
name~
desc
~
0 0 1
D3
~
~
0 0 10778
S
#0
`;
});
