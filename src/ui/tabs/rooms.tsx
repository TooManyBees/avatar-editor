import React from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Actions from "../../app/store/rooms";
import { selectedId } from "../../app/store/ui";
import { VnumItemList } from "../VnumList";
import { Room, Door } from "../../app/models";
import {
	BitsField,
	EdescFields,
	KeywordField,
	NumberField,
	SelectField,
	TextField,
	TextArea,
} from "../fields";
import TabsNav from "./tabs-nav";
import "./tabs.css";
import "../VnumList.css";

export default function RoomsTab() {
	const dispatch = useAppDispatch();
	const rooms = useAppSelector(state => state.rooms.rooms);
	const currentId = useAppSelector(state => state.ui.currentId);
	const room = rooms.find(m => m.id === currentId);

	function onSelect(id: string) {
		dispatch(selectedId(id));
	}

	return (
		<div className="Tabs">
			<div className={room ? "TabsContents" : "VnumItemEditorPlaceholder"}>
				<TabsNav />
				{room ? <RoomForm key={currentId} room={room} /> : null }
			</div>
			<VnumItemList items={rooms} selected={currentId} onChange={onSelect} />
		</div>
	);
}


interface Props {
	room: Room;
}

function RoomForm(props: Props) {
	const dispatch = useAppDispatch();
	const { room } = props;
	const id = room.id;

	const rooms = useAppSelector(state => state.rooms.rooms);

	const updatedVnum = (n: number) => dispatch(Actions.updatedVnum([id, n]));
	const updatedName = (s: string) => dispatch(Actions.updatedName([id, s]));
	const updatedDescription = (s: string) => dispatch(Actions.updatedDescription([id, s]));
	const updatedFlags = (ns: number[]) => dispatch(Actions.updatedFlags([id, ns]));
	const updatedSector = (n: number) => dispatch(Actions.updatedSector([id, n]));
	const updatedAlignFlags = (ns: number[]) => dispatch(Actions.updatedAlignFlags([id, ns]));
	const updatedClassFlags = (ns: number[]) => dispatch(Actions.updatedClassFlags([id, ns]));

	return (
		<div>
			<NumberField name="VNUM" value={room.vnum} min={0} onUpdate={updatedVnum} />
			<TextField name="Name" value={room.name} onUpdate={updatedName} />
			<TextArea name="Description" value={room.description} onUpdate={updatedDescription} />
			<BitsField name="Flags" value={room.flags} map={FLAGS} onUpdate={updatedFlags} />
			<SelectField name="Sector" value={room.sector} map={SECTOR} onUpdate={updatedSector} />
			<EdescFields edescs={room.extraDescs} id={id} updatedEdesc={Actions.updatedExtraDesc} addedEdesc={Actions.addedExtraDesc} removedEdesc={Actions.removedExtraDesc} />
			<Doors roomId={id} doors={room.doors} rooms={rooms} />
			<BitsField name="Prevent align from entering" value={room.alignFlags} map={ALIGN_FLAGS} onUpdate={updatedAlignFlags}/>
			<BitsField name="Prevent class from entering" value={room.classFlags} map={CLASS_FLAGS} onUpdate={updatedClassFlags}/>
		</div>
	);
}

interface DoorsProps {
	roomId: string,
	doors: Door[],
	rooms: Room[],
}

function Doors({ roomId, doors, rooms }: DoorsProps) {
	const dispatch = useAppDispatch();
	return (
		<ol>
			<p>Exits</p>
			{doors.map(door => (
				<li key={door.id}>
					<SelectField name="Direction" value={door.direction} map={DIRECTIONS} onUpdate={direction => dispatch(Actions.updatedDoor([roomId, {...door, direction}]))} />
					<Destination roomId={roomId} doorId={door.id} rooms={rooms} value={door.toRoomId} onUpdate={toRoomId => dispatch(Actions.updatedDoor([roomId, {...door, toRoomId}]))} />
					<SelectField name="Door" value={door.locks} map={LOCKS} onUpdate={locks => dispatch(Actions.updatedDoor([roomId, {...door, locks}]))} />
					{/* key selector */}
					<KeywordField name="Keywords" value={door.keywords} onUpdate={keywords => dispatch(Actions.updatedDoor([roomId, {...door, keywords}]))} />
					<TextArea name="Description" value={door.description} onUpdate={description => dispatch(Actions.updatedDoor([roomId, {...door, description}]))} />
				</li>
			))}
		</ol>
	);
}

interface DestinationProps {
	roomId: string;
	doorId: string;
	rooms: Room[];
	value: string;
	onUpdate: (s: string) => void;
}

function Destination(props: DestinationProps) {
	return (
		<label>Destination: <select value={props.value} onChange={e => props.onUpdate(e.target.value)}>
			{props.rooms.map(r => <option key={r.id} value={r.id}>{r.vnum} {r.name}</option>)}
		</select></label>
	);
}

const FLAGS: [number, string, string][] = [
	[1, "Dark", "Need a light source"],
	// [2, "House", "Only owner may enter room"],
	[4, "No Mob", "No mobs may enter room"],
	[8, "Indoors", "Room is indoors"],
	// [16, "Bfs Mark", "Marks a tracked path"],
	[32, "No Track", "Cannot track"],
	[64, "Room Arena", "Players will not be flagged or die here"],
	[128, "Anti Magic", "No spells can be cast within room"],
	// [256, "Phased", ""],
	[512, "Private", "Only 2 characters allowed"],
	[1024, "Safe", "No offensive actions allowed in this room"],
	[2048, "Solitary", "Only 1 character allowed in room"],
	[4096, "Pet Shop", "Pet shop/pet shop store room"],
	[8192, "No Recall", "Player can't recall"],
	[16384, "Bank", "Acts as a bank"],
	[32768, "Silenced", "Characters in room are treated as if silenced"],
	[65536, "Infirmary", "Characters regen twice as fast"],
	[131072, "Shade", "No_sun players are safe here"],
	[262144, "Noemote", "Socials and Emotes cannot be used in or sent to this room"],
	// [524288, "Gateway", ""],
	[1048576, "Lloydable", "Spells requiring rooms be lloydable work here"],
	[2097152, "No Imp", "Items on the ground are not taken by imps."],
	[4194304, "Barracks", "See Appendix A: Legal System. New townguards will spawn here if necessary."],
	[8388608, "Forbidden", "See Appendix A: Legal System. If a player is caught in a forbidden room by an ACT_CITIZEN or SPEC_TOWNGUARD, the player will be flagged an outlaw and guards will be summoned."],
	[16777216, "Permdark", "Room functions as if players are blind"],
	[33554432, "No quit", "Players cannot quit in this room"],
	// [67108864, "Locker", "Lockers can be accessed from this room."],
	[134217728, "No regen", "Characters will not regenerate hit points, mana points or movement in this room."],
	[268435456, "No HOG", "Characters cannot enter room if hogged, or hog in room. "],
];

const SECTOR: [number, string, string][] = [
	[0, "Inside", ""],
	[1, "City", ""],
	[2, "Field", ""],
	[3, "Forest", ""],
	[4, "Hills", ""],
	[5, "Mountain", ""],
	[6, "Water (swim)", ""],
	[7, "Water (noswim)", ""],
	[8, "House", ""],
	[9, "Air", ""],
	[10, "Desert", ""],
	[11, "Underwater", ""],
	[12, "On bottom", ""],
	[13, "Rogue guild", ""],
];

const ALIGN_FLAGS: [number, string, string][] = [
	[1, "Evil", "Align <= -350"],
	[2, "Neutral", "Align < |350|"],
	[3, "Good", "Align >= 350"],
];

const CLASS_FLAGS: [number, string, string][] = [
	[1, "Mage", ""],
	[2, "Cleric", ""],
	[4, "Rogue", ""],
	[8, "Warrior", ""],
	[16, "Paladin", ""],
	[32, "Ranger", ""],
	[64, "Psionicist", ""],
	[128, "Monk", ""],
	[256, "Archer", ""],
	[512, "Sorcerer", ""],
	[1024, "Soldier", ""],
	[2048, "Priest", ""],
	[4096, "Berserker", ""],
	[8192, "Assassin", ""],
	[16384, "Wizard", ""],
	[32768, "Shadowfist", ""],
	[65536, "Mindbender", ""],
	[131072, "Druid", ""],
	[262144, "Black Circle Initiate", ""],
	[524288, "Bodyguard", ""],
	[1048576, "Fusilier", ""],
	[2097152, "Stormlord", ""],
	[4194304, "Ripper", ""],
	[8388608, "Bladedancer", ""],
	[16777216, "Vizier", ""],
];

const DIRECTIONS: [number, string, string][] = [
	[0, "North", ""],
	[1, "East", ""],
	[2, "South", ""],
	[3, "West", ""],
	[4, "Up", ""],
	[5, "Down", ""],
];

const LOCKS: [number, string, string][] = [
	[0, "No door", ""],
	[1, "Plain door", ""],
	[2, "Pickproof", ""],
	[3, "Bashproof", ""],
	[4, "Passproof", ""],
	[5, "Pickproof, Passproof", ""],
	[6, "Bashproof, Passproof", ""],
	[7, "Pickproof, Bashproof", ""],
	[8, "Everything-proof", ""],
];
