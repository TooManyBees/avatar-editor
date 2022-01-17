import React, { useState } from "react";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Actions from "../../app/store/resets";
import { MobReset as MobResetType, EquipmentReset, Objekt, Room } from "../../app/models";
import {
	AddButton,
	DeleteButton,
	NumberField,
	SectionList,
	SelectVnum,
	ToolRow,
} from "../components";
import styles from "./MobResets.module.css";
import sharedStyles from "../components/shared.module.css";

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
		<SectionList header={<><h2>Resets</h2> ({resets.length}) <AddButton onClick={() => dispatch(Actions.addedMobReset(mobId))}>Add reset</AddButton></>}>
			{resets.map(reset => (
				<MobReset key={reset.id} reset={reset} rooms={rooms} objects={objects} />
			))}
		</SectionList>
	);
}

function MobReset({ reset, rooms, objects }: { reset: MobResetType, rooms: Room[], objects: Objekt[] }) {
	const dispatch = useAppDispatch();
	const [danger, setDanger] = useState(false);
	return <>
		<li className={classnames(styles.reset, danger && sharedStyles.dangerTarget)}>
			<ToolRow>
				<NumberField inline name="Limit" value={reset.limit} min={0} onUpdate={limit => dispatch(Actions.updatedMobReset({...reset, limit}))} />
				in
				<SelectVnum items={rooms} selectedId={reset.roomId} onUpdate={roomId => dispatch(Actions.updatedMobReset({...reset, roomId}))} />
			</ToolRow>
			<SectionList className={styles.eqList} header={<><h3>Equipment</h3> ({reset.equipment.length}) <AddButton onClick={() => dispatch(Actions.addedEquipmentReset(reset.id))}>Add equipment</AddButton></>}>
				{reset.equipment.map(eqReset => <EqReset key={eqReset.id} reset={eqReset} mobResetId={reset.id} objects={objects} />)}
			</SectionList>
			<DeleteButton absolute onHoverState={setDanger} onClick={() => dispatch(Actions.removedMobReset(reset.id))}>Remove reset &amp; gear</DeleteButton>
		</li>
		<hr className={styles.separator} />
	</>;
}

function EqReset({ mobResetId, reset, objects }: { mobResetId: string, reset: EquipmentReset, objects: Objekt[] }) {
	const dispatch = useAppDispatch();
	const [danger, setDanger] = useState(false);

	return (
		<ToolRow key={reset.id} className={classnames(styles.eqReset, danger && sharedStyles.dangerTarget)}>
			<SelectVnum items={objects} selectedId={reset.objectId} onUpdate={id => dispatch(Actions.updatedEquipmentReset([reset.id, {...reset, objectId: id}]))} />
			on
			<WearSelector selected={reset.wearLocation} onUpdate={l => dispatch(Actions.updatedEquipmentReset([reset.id, {...reset, wearLocation: l}]))} />
			<NumberField inline name="Limit (0 for none)" value={reset.limit} onUpdate={l => dispatch(Actions.updatedEquipmentReset([reset.id, {...reset, limit: l}]))} />
			<DeleteButton absolute onHoverState={setDanger} onClick={() => dispatch(Actions.removedEquipmentReset([mobResetId, reset.id]))}>Remove item</DeleteButton>
		</ToolRow>
	);
}

const WEAR_OPTIONS = [
	{ value: -1, label: "Inventory" },
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
	const value = WEAR_OPTIONS.find(({ value }) => value === selected) || { value: -1, label: "Inventory"};
	return (
		<ReactSelect
			options={WEAR_OPTIONS}
			value={value}
			onChange={v => onUpdate(v ? v.value : -1)}
			styles={WEAR_OPTION_STYLES}
			menuPlacement="auto"
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
