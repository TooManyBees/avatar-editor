import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import * as Actions from "../app/store/resets";
import { MobReset as MobResetType, Objekt, Room } from "../app/models";
import { NumberField } from "./fields";

interface Props {
	mobId: string;
}

export default function MobResets({ mobId }: Props) {
	// FIXME: could probably reduce redraws if we passed in state.resets.resets as a prop
	// then filtered it inside *shrug*
	const resets = useAppSelector(state => state.resets.resets.mobile.filter(r => r.mobId === mobId));
	const objects = useAppSelector(state => state.objects.objects);
	const rooms = useAppSelector(state => state.rooms.rooms);
	return (
		<ol>
			{resets.map(reset => (
				<li key={reset.id}>
					<MobReset reset={reset} rooms={rooms} objects={objects} />
				</li>
			))}
		</ol>
	);
}

function MobReset({ reset, rooms, objects }: { reset: MobResetType, rooms: Room[], objects: Objekt[] }) {
	const dispatch = useAppDispatch();
	return (
		<div>
			<RoomSelector rooms={rooms} selected={reset.roomId} onUpdate={id => dispatch(Actions.updatedMobReset({...reset, roomId: id}))} />
			<NumberField name="Limit" value={reset.limit} onUpdate={l => dispatch(Actions.updatedMobReset({...reset, limit: l}))} />
			<p>Equipment</p>
			{reset.equipment.map(eqReset => (
				<div key={eqReset.id}>
					<ObjectSelector selected={eqReset.objectId} objects={objects} onUpdate={id => dispatch(Actions.updatedEquipmentReset([reset.id, {...eqReset, objectId: id}]))} />
					<WearSelector selected={eqReset.wearLocation} onUpdate={l => dispatch(Actions.updatedEquipmentReset([reset.id, {...eqReset, wearLocation: l}]))} />
					<NumberField name="Limit (0 for none)" value={eqReset.limit} onUpdate={l => dispatch(Actions.updatedEquipmentReset([reset.id, {...eqReset, limit: l}]))} />
				</div>
			))}
			{reset.inventory.map(invReset => (
				<div key={invReset.id}>
					<ObjectSelector selected={invReset.objectId} objects={objects} onUpdate={id => dispatch(Actions.updatedInventoryReset([reset.id, {...invReset, objectId: id}]))} />
					<NumberField name="Limit (0 for none)" value={invReset.limit} onUpdate={l => dispatch(Actions.updatedInventoryReset([reset.id, {...invReset, limit: l}]))} />
				</div>
			))}
		</div>
	);
}

interface ObjectSelectorProps {
	selected: string;
	objects: Objekt[];
	onUpdate: (id: string) => void;
}

function ObjectSelector({ selected, objects, onUpdate }: ObjectSelectorProps) {
	return (
		<select value={selected} onChange={e => onUpdate(e.target.value)}>
			{!objects.find(o => o.id === selected) && <option value={selected}>{selected} (not in area)</option>}
			{objects.map(o => <option value={o.id} key={o.id}>{o.vnum} {o.name}</option>)}
		</select>
	);
}

interface RoomSelectorProps {
	selected: string;
	rooms: Room[];
	onUpdate: (id: string) => void;
}

function RoomSelector({ selected, rooms, onUpdate }: RoomSelectorProps) {
	return (
		<select value={selected} onChange={e=> onUpdate(e.target.value)}>
			{!rooms.find(r => r.id === selected) && <option value={selected}>{selected} (not in area)</option>}
			{rooms.map(r => <option value={r.id} key={r.id}>{r.vnum} {r.name}</option>)}
		</select>
	);
}

function WearSelector({ selected, onUpdate }: { selected: number, onUpdate: (n: number) => void }) {
	return (
		<select value={selected} onChange={e => onUpdate(Number(e.target.value))}>
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
