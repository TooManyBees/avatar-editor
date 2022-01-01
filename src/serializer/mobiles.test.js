import parseMobiles, { parseMobile } from "../parser/mobiles";
import serializeMobiles, { serializeMob } from "./mobiles";

describe("serializeMob", () => {
	test("serializes a mobile", () => {
		const mob = parseMobile(MOB);
		expect(serializeMob(mob)).toBe(MOB);
	});

	test("serializes a mobile with extra applies", () => {
		const mob = parseMobile(MOB_WITH_APPLIES);
		expect(serializeMob(mob)).toBe(MOB_WITH_APPLIES);
	});

		const MOB = `#8113
nom meadow shaman 'meadow shaman'~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also
sells items of vital importance to those who are in need.  To see those,
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.
~
1|2|2048 8|32|128|512 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 3
L 4
K 1 2 9999 -1 Nom's kneecap falls off and lies beside the corpse!
A nearby sparrow screams, "OH MY GOODNESS!"~
`;

	const MOB_WITH_APPLIES = `#8113
nom meadow shaman 'meadow shaman'~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also
sells items of vital importance to those who are in need.  To see those,
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.
~
1|2|2048 8|32|128|512 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
A 1 1
A 19 10
K 1 2 9999 -1 Nom's kneecap falls off and lies beside the corpse!
A nearby sparrow screams, "OH MY GOODNESS!"~
`;
});


describe("serializeMobiles", () => {
	test("serializes a mobiles section", () => {
		const mobs = parseState(MOBILES);
		expect(serializeMobiles(mobs)).toBe(MOBILES);
	});

	test("omits an empty section", () => {
		const mobs = parseState("#MOBILES\n\n#0\n");
		expect(serializeMobiles(mobs)).toBe("");
	});

	const MOBILES = `#MOBILES

#8104
rabbit~
A rabbit~
A rabbit scampers about in the weeds.
~
This plump rabbit seems just the right size for a kettle of boiling water.
It senses your thoughts and starts to hop away.
~
1|64 0 250 S
2 0 0
0d0+0 0d0+0 0 0
0 0 0
R 24
C 3

#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also
sells items of vital importance to those who are in need.  To see those,
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.
~
1|2|2048 8|32|128|512 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 0
R 0
C 3

#0
`;
});

function parseState(section) {
	const mobs = parseMobiles(section.substring("#MOBILES\n".length));
	return mobs;
}
