import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SpecialU } from "../../app/models/specials";
import { ShopU } from "../../app/models/shops";
import {
	Mobile,
	Objekt,
	Resets,
	Room,
} from "../../app/models";
import { TabsContents } from "./tabs-layout";
import {
	NumberField,
	SectionList,
	SelectVnum,
	TextField,
	ToolRow,
} from "../components";
import { SelectSpecial } from "../mobiles";
import SelectDirection from "../rooms/SelectDirection";
import styles from "./orphans.module.css";

export default function OrphansTab() {
	const orphanedSpecials = useAppSelector(state => state.mobiles.orphanedSpecials);
	const orphanedShops = useAppSelector(state => state.shops.orphaned);
	const resets = useAppSelector(state => state.resets.resets);

	const mobiles = useAppSelector(state => state.mobiles.mobiles);
	const objects = useAppSelector(state => state.objects.objects);
	const rooms = useAppSelector(state => state.rooms.rooms);

	return (
		<TabsContents>
			<OrphanedSpecials specials={orphanedSpecials} mobiles={mobiles} />
			<OrphanedShops shops={orphanedShops} />
			<OrphanedResets resets={resets} mobiles={mobiles} objects={objects} rooms={rooms} />
		</TabsContents>
	);
}

function OrphanedSpecials({ specials, mobiles }: { specials: SpecialU[], mobiles: Mobile[] }) {
	if (specials.length === 0) return null;
	return (
		<SectionList header={<h2>Orphaned Specials</h2>}>
			{specials.map(special => <li key={special.id}>
				<SelectVnum name="Mobile" selectedId={special.mobVnum.toString()} items={mobiles} onUpdate={() => {}} />
				<SelectSpecial value={special.special} onUpdate={() => {}}/>
			</li>)}
		</SectionList>
	);
}

function OrphanedShops({ shops }: { shops: ShopU[] }) {
	if (shops.length === 0) return null;
	return (
		<SectionList header={<h2>Orphaned Shops</h2>}>

		</SectionList>
	);
}

interface OrphanedResetsProps {
	resets: Resets,
	mobiles: Mobile[],
	objects: Objekt[],
	rooms: Room[],
}

function OrphanedResets({ resets, mobiles, objects, rooms }: OrphanedResetsProps) {
	const mobResets = resets.mobile.filter(r => r.orphan);
	const objResets = resets.object.filter(r => r.orphan);
	const inObjResets = resets.inObject.filter(r => r.orphan);
	const doorResets = resets.door.filter(r => r.orphan);
	const randomResets = resets.randomExit.filter(r => r.orphan);

	const numResets = mobResets.length + objResets.length + inObjResets.length + doorResets.length + randomResets.length;
	if (numResets === 0) return null;

	return (
		<>
			{mobResets.length > 0 && <SectionList header={<h2>Mob resets</h2>}>
				{mobResets.map(reset => <React.Fragment key={reset.id}>
					<li>
						<ToolRow>
							<SelectVnum name="Mobile" selectedId={reset.mobId} items={mobiles} onUpdate={() => {}} />
							<SelectVnum name="Room" selectedId={reset.roomId} items={rooms} onUpdate={() => {}} />
						</ToolRow>
						<TextField name="Comment" value={reset.comment} onUpdate={() => {}} />
					</li>
					<hr />
				</React.Fragment>)}
			</SectionList>}
			{objResets.length > 0 && <SectionList header={<h2>Object resets</h2>}>
				{objResets.map(reset => <React.Fragment key={reset.id}>
					<li>
						<ToolRow>
							<SelectVnum name="Object" selectedId={reset.objectId} items={objects} onUpdate={() => {}} />
							<SelectVnum name="Room" selectedId={reset.roomId} items={rooms} onUpdate={() => {}} />
						</ToolRow>
						<TextField name="Comment" value={reset.comment} onUpdate={() => {}} />
					</li>
					<hr />
				</React.Fragment>)}
			</SectionList>}
			{inObjResets.length > 0 && <SectionList header={<h2>Container resets</h2>}>
				{inObjResets.map(reset => <React.Fragment key={reset.id}>
					<li>
						<ToolRow>
							<SelectVnum name="Object" selectedId={reset.objectId} items={objects} onUpdate={() => {}} />
							<SelectVnum name="Container" selectedId={reset.containerId} items={objects} onUpdate={() => {}} />
						</ToolRow>
						<TextField name="Comment" value={reset.comment} onUpdate={() => {}} />
					</li>
					<hr />
				</React.Fragment>)}
				</SectionList>}
			{doorResets.length > 0 && <SectionList header={<h2>Door resets</h2>}>
				{doorResets.map(reset => <React.Fragment key={reset.id}>
					<li>
						<ToolRow>
							<SelectVnum name="Room" selectedId={reset.roomId} items={rooms} onUpdate={() => {}} />
							<SelectDirection value={reset.direction} onUpdate={() => {}} />
						</ToolRow>
						<TextField name="Comment" value={reset.comment} onUpdate={() => {}} />
					</li>
					<hr />
				</React.Fragment>)}
			</SectionList>}
			{randomResets.length > 0 && <SectionList header={<h2>Random exit resets</h2>}>
				{randomResets.map(reset => <React.Fragment key={reset.id}>
					<li>
						<ToolRow>
							<SelectVnum name="Room" selectedId={reset.roomId} items={rooms} onUpdate={() => {}} />
							<NumberField name="Number of exits" value={reset.numExits} onUpdate={() => {}} />
						</ToolRow>
						<TextField name="Comment" value={reset.comment} onUpdate={() => {}} />
					</li>
					<hr />
				</React.Fragment>)}
			</SectionList>}
		</>
	);
}
