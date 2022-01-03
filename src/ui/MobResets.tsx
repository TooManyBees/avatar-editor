import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import * as Actions from "../app/store/resets";
import { MobReset as MobResetType, Objekt, Room } from "../app/models";
import {
	NumberField,
	SelectVnum,
} from "./components";

import ReactSelect, { CSSObjectWithLabel } from "react-select";

interface Props {
	mobId: string;
}

export default function MobResets({ mobId }: Props) {
	const dispatch = useAppDispatch();
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
			<button onClick={() => dispatch(Actions.addedMobReset(mobId))}>Add reset</button>
		</ol>
	);
}

function MobReset({ reset, rooms, objects }: { reset: MobResetType, rooms: Room[], objects: Objekt[] }) {
	const dispatch = useAppDispatch();
	return (
		<div>
			<div style={{display: "flex", alignItems: "baseline"}}>
				<NumberField name="Limit" value={reset.limit} min={0} onUpdate={l => dispatch(Actions.updatedMobReset({...reset, limit: l}))} />
				&nbsp;in&nbsp;
				<SelectVnum items={rooms} selectedId={reset.roomId} onUpdate={id => dispatch(Actions.updatedMobReset({...reset, roomId: id}))} />
				<button onClick={() => dispatch(Actions.removedMobReset(reset.id))}>Remove reset &amp; gear</button>
			</div>
			<p>Equipment</p>
			{reset.equipment.map(eqReset => (
				<div key={eqReset.id}>
					<div style={{display:"flex", alignItems: "baseline"}}>
						<SelectVnum items={objects} selectedId={eqReset.objectId} onUpdate={id => dispatch(Actions.updatedEquipmentReset([reset.id, {...eqReset, objectId: id}]))} />
						&nbsp;on&nbsp;
						<WearSelector selected={eqReset.wearLocation} onUpdate={l => dispatch(Actions.updatedEquipmentReset([reset.id, {...eqReset, wearLocation: l}]))} />
					</div>
					<NumberField name="Limit (0 for none)" value={eqReset.limit} onUpdate={l => dispatch(Actions.updatedEquipmentReset([reset.id, {...eqReset, limit: l}]))} />
					<button onClick={() => dispatch(Actions.removedEquipmentReset([reset.mobId, eqReset.id]))}>Remove</button>
				</div>
			))}
			{reset.inventory.map(invReset => (
				<div key={invReset.id}>
					<SelectVnum items={objects} selectedId={invReset.objectId} onUpdate={id => dispatch(Actions.updatedInventoryReset([reset.id, {...invReset, objectId: id}]))} />
					<NumberField name="Limit (0 for none)" value={invReset.limit} onUpdate={l => dispatch(Actions.updatedInventoryReset([reset.id, {...invReset, limit: l}]))} />
					<button onClick={() => dispatch(Actions.removedInventoryReset([reset.mobId, invReset.id]))}>Remove</button>
				</div>
			))}
		</div>
	);
}

const WEAR_OPTIONS = [
	{ value: 0, label: "Light" },
	{ value: 1, label: "Left finger" },
	{ value: 2, label: "Right Finger" },
	{ value: 3, label: "Neck 1" },
	{ value: 4, label: "Neck 2" },
	{ value: 5, label: "On Body" },
	{ value: 6, label: "Head" },
	{ value: 7, label: "Legs" },
	{ value: 8, label: "Feet" },
	{ value: 9, label: "Hands" },
	{ value: 10, label: "Arms" },
	{ value: 11, label: "Offhand/Shield" },
	{ value: 12, label: "About body" },
	{ value: 13, label: "Waist" },
	{ value: 14, label: "Left wrist" },
	{ value: 15, label: "Right wrist" },
	{ value: 16, label: "Wield" },
	{ value: 17, label: "Held" },
	{ value: 19, label: "Floating" },
];
const WEAR_OPTION_STYLES = minWidthStyles(WEAR_OPTIONS);

function WearSelector({ selected, onUpdate }: { selected: number, onUpdate: (n: number) => void }) {
	const value = WEAR_OPTIONS.find(({ value }) => value === selected) || { value: 18, label: "Wearing"};
	return (
		<ReactSelect
			options={WEAR_OPTIONS}
			value={value}
			onChange={v => onUpdate(v ? v.value : 18)}
			styles={WEAR_OPTION_STYLES}
		/>
	);
}

function minWidthStyles(options: { label: string }[]) {
	const minWidth = options.reduce((maxLen, item) =>
		Math.max(maxLen, item.label.length), 0);
	return {
		control: (provided: CSSObjectWithLabel) => ({
			...provided,
			minWidth: `calc(55px + ${minWidth/2}rem)`,
			alignItems: "baseline",
		}),
		valueContainer: (provider: CSSObjectWithLabel) => ({
			...provider,
			alignItems: "baseline",
			top: "2px",
		}),
		// singleValue: ({ maxWidth, position, top, transform, ...rest}: CSSObjectWithLabel) => ({...rest}),
	};
}
