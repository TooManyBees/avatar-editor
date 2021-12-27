import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { MobReset as MobResetType, Objekt, Room } from "../app/models";

interface Props {
	mobId: string;
}

export default function MobResets({ mobId }: Props) {
	const resets = useAppSelector(state => state.resets.resets.mobile.filter(r => r.mobId === mobId));
	const objects = useAppSelector(state => state.objects.objects);
	const rooms = useAppSelector(state => state.rooms.rooms);
	return (
		<ol>
			{resets.map(reset => (
				<li>
					<MobReset reset={reset} rooms={rooms} objects={objects} />
				</li>
			))}
		</ol>
	);
}

function MobReset({ reset, rooms, objects }: { reset: MobResetType, rooms: Room[], objects: Objekt[] }) {
	return (
		<div>
			<RoomSelector rooms={rooms} selected={reset.roomId} />
			<p>Equipment</p>
			{reset.equipment.map(eqReset => (
				<p key={eqReset.id}>
					<ObjectSelector selected={eqReset.objectId} objects={objects} />
					<WearSelector selected={eqReset.wearLocation} />
				</p>
			))}
			{reset.inventory.map(invReset => (
				<p key={invReset.id}>
					<ObjectSelector selected={invReset.objectId} objects={objects} />
				</p>
			))}
		</div>
	);
}

function ObjectSelector({ selected, objects }: { selected: string, objects: Objekt[] }) {
	return (
		<select value={selected}>
			{!objects.find(o => o.id === selected) && <option value={selected}>{selected} (not in area)</option>}
			{objects.map(o => <option value={o.id} key={o.id}>{o.vnum} {o.name}</option>)}
		</select>
	);
}

function RoomSelector({ selected, rooms }: { selected: string, rooms: Room[] }) {
	return (
		<select value={selected}>
			{!rooms.find(r => r.id === selected) && <option value={selected}>{selected} (not in area)</option>}
			{rooms.map(r => <option value={r.id} key={r.id}>{r.vnum} {r.name}</option>)}
		</select>
	);
}

function WearSelector({ selected }: { selected: number }) {
	return (
		<select value={selected}>
			<option value="0">Light</option>
			<option value="1">Left finger</option>
			<option value="2">Right Finger</option>
			<option value="3">Neck 1</option>
			<option value="4">Neck 2</option>
			<option value="5">On Body</option>
			<option value="6">Head</option>
			<option value="7">Legs</option>
			<option value="8">Feed</option>
			<option value="9">Hands</option>
			<option value="10">Arms</option>
			<option value="11">Offhand/Shield</option>
			<option value="12">About body</option>
			<option value="13">Waist</option>
			<option value="14">Left wrist</option>
			<option value="15">Right wrist</option>
			<option value="16">Wield</option>
			<option value="17">Held</option>
			<option value="19">Floating</option>
		</select>
	);
}
