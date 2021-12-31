import parseFile from "../parser";
import parseRooms from "../parser/rooms";
import serializeRooms from "./rooms";

describe("serializeRooms", () => {
	// If we don't change the vnum, we might just be testing that the vnum
	// never got linked to an object, and "12699" was an external vnum that
	// should simply not be touched.

	test("serializes door connection room vnums", () => {
		const area = parseFile(CONNECTED_ROOMS);
		area.rooms[1].vnum = 9999;
		expect(serializeRooms(area.rooms, area.objects)).toBe(CONNECTED_ROOMS.replace(/8081/g, "9999"));
	});

	test("serializes door key vnums", () => {
		const area = parseFile(KEYS + ROOMS_AND_KEYS);
		area.objects[0].vnum = 9999;
		expect(serializeRooms(area.rooms, area.objects)).toBe(ROOMS_AND_KEYS.replace(/12699/g, "9999"));
	});

	const CONNECTED_ROOMS = `#ROOMS

#8080
A narrow trail~
Trees blanket this dirt trail shadowing the sky from you.  To the east
is the meadow and White Stone Road is west.
~
0 131072 3
D1
The trail looks very mysterious.
 ... .. . Very mysterious indeed.
~
~
0 0 8117
D3
~
~
0 0 8081
S

#8081
A narrow trail~
Trees blanket this dirt trail shadowing the sky from you.  To the east
is the meadow and White Stone Road is west.
~
0 131072 3
D1
~
~
0 0 8080
D3
~
~
0 0 8082
E
key words~
This description is so extra!
~
S

#8082
A narrow trail~
Trees blanket this dirt trail shadowing the sky from you.  To the east
is the meadow and White Stone Road is west.
~
0 131072 3
D1
~
~
0 0 8081
D3
~
~
0 0 8083
S

#0
`

	const KEYS = `#OBJECTS
#12699
heavy key backroom room~
key to the back room~
This heavy key must open a huge lock.~
~
18 1|128|4096|8192|131072 1
0 0 0 0
20 0 0 0
#0
`
const ROOMS_AND_KEYS = `#ROOMS

#12698
The back room~
The gloomy back room is dimly lit through the cracks in some boarded-
up windows. The room is cluttered near the walls, where boxes and bags
have been tossed in sloppy piles. Towards the center of the room, the
floor has been kept clear to make room for a large trap door.
~
0 4|8|8192 0
D3
This large door is reinforced with thick iron bands and bolts. An oddly
shapen metal bulge sits dead center on the door, with a complex array of
gears, screws, and pins sticking out of it.
~
door~
6 12699 3201
D5
Lacking a lock, this sturdy trap door can probably be opened as long as
nothing heavy is sitting on top of it.
~
door trap trapdoor~
1 0 12697
S

#0
`
});
