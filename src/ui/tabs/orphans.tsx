import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SpecialU } from "../../app/models/specials";
import { ShopU } from "../../app/models/shops";
import { restoredShop, restoredSpecial } from "../../app/store/mobiles";
import {
	restoredMobReset,
	restoredObjectReset,
	restoredInObjectReset,
	restoredDoorReset,
	restoredRandomExitReset,
} from "../../app/store/resets";
import { selectedMobileId, selectedObjectId, selectedRoomId } from "../../app/store/ui";
import {
	DoorReset,
	InObjectReset,
	Mobile,
	MobReset,
	ObjectReset,
	Objekt,
	RandomExitReset,
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
import { SelectObjectType } from "../mobiles/ShopFields";
import SelectDirection from "../rooms/SelectDirection";
import styles from "./orphans.module.css";

export default function OrphansTab() {
	const orphanedSpecials = useAppSelector(state => state.mobiles.orphanedSpecials);
	const orphanedShops = useAppSelector(state => state.mobiles.orphanedShops);
	const resets = useAppSelector(state => state.resets.resets);

	const mobiles = useAppSelector(state => state.mobiles.mobiles);
	const objects = useAppSelector(state => state.objects.objects);
	const rooms = useAppSelector(state => state.rooms.rooms);

	return (
		<TabsContents>
			<h1 style={{marginTop: "0.5rem"}}>Orphaned items</h1>
			<aside className={styles.description}>
				Orphaned content are vnum references that don't link to any mobiles, objects, or
				rooms in this area. You can reassign them to any mob/object/room in the area. They
				will still be written into the final <code>.are</code> file even if they stay orphaned.
			</aside>
			<OrphanedSpecials specials={orphanedSpecials} mobiles={mobiles} />
			<OrphanedShops shops={orphanedShops} mobiles={mobiles} />
			<OrphanedResets resets={resets} mobiles={mobiles} objects={objects} rooms={rooms} />
		</TabsContents>
	);
}

const NO_OP = () => {};

interface FixedVnum {
	id: string;
	vnum: number | null;
	name: string;
}

function OrphanedSpecials({ specials, mobiles }: { specials: SpecialU[], mobiles: Mobile[] }) {
	const dispatch = useAppDispatch();
	const [fixed, setFixed] = useState<FixedVnum[]>([]);
	if (specials.length === 0 && fixed.length === 0) return null;

	function onUpdate(mobId: string, special: SpecialU) {
		const mobile = mobiles.find(m => m.id === mobId);
		if (mobile) {
			dispatch(restoredSpecial([mobId, special]));
			setFixed([...fixed, { vnum: mobile.vnum, name: mobile.shortDesc, id: mobile.id }]);
		}
	}

	return (
		<SectionList header={<h2>Specials</h2>}>
			{fixed.map(({ id, vnum, name }) => (
				<li key={id}>
					<a href="#" className={styles.link} onClick={() => dispatch(selectedMobileId(id))}>
						Shop assigned to <code>{vnum}</code> {name}
					</a>
				</li>
			))}
			{specials.map(special => <li key={special.id}>
				<ToolRow>
					<SelectVnum name="Mobile" selectedId={special.mobVnum.toString()} items={mobiles} onUpdate={mobId => onUpdate(mobId, special)} />
					<SelectSpecial disabled value={special.special} onUpdate={NO_OP}/>
				</ToolRow>
			</li>)}
		</SectionList>
	);
}

function OrphanedShops({ shops, mobiles }: { shops: ShopU[], mobiles: Mobile[] }) {
	const dispatch = useAppDispatch();
	const [fixed, setFixed] = useState<FixedVnum[]>([]);
	if (shops.length === 0 && fixed.length === 0) return null;

	function onUpdate(mobId: string, shop: ShopU) {
		const mobile = mobiles.find(m => m.id === mobId);
		if (mobile) {
			dispatch(restoredShop([mobId, shop]));
			setFixed([...fixed, { vnum: mobile.vnum, name: mobile.shortDesc, id: mobile.id }]);
		}
	}

	return (
		<SectionList header={<h2>Shops</h2>}>
			{fixed.map(({ id, vnum, name }) => (
				<li key={id}>
					<a href="#" className={styles.link} onClick={() => dispatch(selectedMobileId(id))}>
						Shop assigned to <code>{vnum}</code> {name}
					</a>
				</li>
			))}
			{shops.map(shop => <React.Fragment key={shop.id}>
				<li>
					<ToolRow>
						<SelectVnum name="Mobile" selectedId={shop.mobVnum.toString()} items={mobiles} onUpdate={mobId => onUpdate(mobId, shop)} />
					</ToolRow>
					<ToolRow>
						<SelectObjectType disabled value={shop.oType1} onUpdate={NO_OP} />
						<SelectObjectType disabled value={shop.oType2} onUpdate={NO_OP} />
						<SelectObjectType disabled value={shop.oType3} onUpdate={NO_OP} />
						<SelectObjectType disabled value={shop.oType4} onUpdate={NO_OP} />
						<SelectObjectType disabled value={shop.oType5} onUpdate={NO_OP} />
					</ToolRow>
				</li>
				<hr />
			</React.Fragment>)}
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

	return (
		<>
			<MobResets resets={mobResets} mobiles={mobiles} rooms={rooms} />
			<ObjResets resets={objResets} objects={objects} rooms={rooms} />
			<InObjResets resets={inObjResets} objects={objects} />
			<DoorResets resets={doorResets} rooms={rooms} />
			<RandomExitResets resets={randomResets} rooms={rooms} />
		</>
	);
}


function MobResets({ resets, mobiles, rooms }: { resets: MobReset[], mobiles: Mobile[], rooms: Room[] }) {
	const dispatch = useAppDispatch();
	const [fixed, setFixed] = useState<FixedVnum[]>([]);
	if (resets.length === 0 && fixed.length === 0) return null;

	function onUpdate(mobId: string, reset: MobReset) {
		const mobile = mobiles.find(m => m.id === mobId);
		if (mobile) {
			dispatch(restoredMobReset([mobId, reset]));
			setFixed([...fixed, { id: mobId, name: mobile.shortDesc, vnum: mobile.vnum }]);
		}
	}

	return (
		<SectionList header={<h2>Mob resets</h2>}>
			{fixed.map(({ id, vnum, name }) => (
				<li key={id}>
					<a href="#" className={styles.link} onClick={() => dispatch(selectedMobileId(id))}>
						Shop assigned to <code>{vnum}</code> {name}
					</a>
				</li>
			))}
			{resets.map(reset => <React.Fragment key={reset.id}>
				<li>
					<ToolRow>
						<SelectVnum name="Mobile" selectedId={reset.mobId} items={mobiles} onUpdate={mobId => onUpdate(mobId, reset)} />
						<SelectVnum name="Room" disabled selectedId={reset.roomId} items={rooms} onUpdate={NO_OP} />
					</ToolRow>
					<TextField name="Comment" disabled value={reset.comment} onUpdate={NO_OP} />
				</li>
				<hr />
			</React.Fragment>)}
		</SectionList>
	);
}

function ObjResets({ resets, objects, rooms }: { resets: ObjectReset[], objects: Objekt[], rooms: Room[]}) {
	const dispatch = useAppDispatch();
	const [fixed, setFixed] = useState<FixedVnum[]>([]);
	if (resets.length === 0 && fixed.length === 0) return null;

	function onUpdate(objectId: string, reset: ObjectReset) {
		const object = objects.find(o => o.id === objectId);
		if (object) {
			dispatch(restoredObjectReset([objectId, reset]));
			setFixed([...fixed, { id: objectId, name: object.shortDesc, vnum: object.vnum }]);
		}
	}

	return (
		<SectionList header={<h2>Object resets</h2>}>
			{fixed.map(({ id, vnum, name }) => (
				<li key={id}>
					<a href="#" className={styles.link} onClick={() => dispatch(selectedObjectId(id))}>
						Shop assigned to <code>{vnum}</code> {name}
					</a>
				</li>
			))}
			{resets.map(reset => <React.Fragment key={reset.id}>
				<li>
					<ToolRow>
						<SelectVnum name="Object" selectedId={reset.objectId} items={objects} onUpdate={objectId => onUpdate(objectId, reset)} />
						<SelectVnum name="Room" disabled selectedId={reset.roomId} items={rooms} onUpdate={NO_OP} />
					</ToolRow>
					<TextField name="Comment" disabled value={reset.comment} onUpdate={NO_OP} />
				</li>
				<hr />
			</React.Fragment>)}
		</SectionList>
	);
}

function InObjResets({ resets, objects }: { resets: InObjectReset[], objects: Objekt[] }) {
	const dispatch = useAppDispatch();
	const [fixed, setFixed] = useState<FixedVnum[]>([]);
	if (resets.length === 0 && fixed.length === 0) return null;

	function onUpdate(containerId: string, reset: InObjectReset) {
		const container = objects.find(o => o.id === containerId);
		if (container) {
			dispatch(restoredInObjectReset([containerId, reset]));
			setFixed([...fixed, { id: containerId, name: container.shortDesc, vnum: container.vnum }]);
		}
	}

	return (
		<SectionList header={<h2>Container resets</h2>}>
			{fixed.map(({ id, vnum, name }) => (
				<li key={id}>
					<a href="#" className={styles.link} onClick={() => dispatch(selectedObjectId(id))}>
						Shop assigned to <code>{vnum}</code> {name}
					</a>
				</li>
			))}
			{resets.map(reset => <React.Fragment key={reset.id}>
				<li>
					<ToolRow>
						<SelectVnum name="Container" selectedId={reset.containerId} items={objects} onUpdate={containerId => onUpdate(containerId, reset)} />
						<SelectVnum name="Contents" disabled selectedId={reset.objectId} items={objects} onUpdate={NO_OP} />
					</ToolRow>
					<TextField name="Comment" disabled value={reset.comment} onUpdate={NO_OP} />
				</li>
				<hr />
			</React.Fragment>)}
		</SectionList>
	);
}

function DoorResets({ resets, rooms }: { resets: DoorReset[], rooms: Room[] }) {
	const dispatch = useAppDispatch();
	const [fixed, setFixed] = useState<FixedVnum[]>([]);
	if (resets.length === 0 && fixed.length === 0) return null;

	function onUpdate(roomId: string, reset: DoorReset) {
		const room = rooms.find(r => r.id === roomId);
		if (room) {
			dispatch(restoredDoorReset([roomId, reset]));
			setFixed([...fixed, { id: roomId, name: room.name, vnum: room.vnum }]);
		}
	}

	return (
		<SectionList header={<h2>Door resets</h2>}>
			{fixed.map(({ id, vnum, name }) => (
				<li key={id}>
					<a href="#" className={styles.link} onClick={() => dispatch(selectedRoomId(id))}>
						Shop assigned to <code>{vnum}</code> {name}
					</a>
				</li>
			))}
			{resets.map(reset => <React.Fragment key={reset.id}>
				<li>
					<ToolRow>
						<SelectVnum name="Room" selectedId={reset.roomId} items={rooms} onUpdate={roomId => onUpdate(roomId, reset)} />
						<SelectDirection disabled value={reset.direction} onUpdate={NO_OP} />
					</ToolRow>
					<TextField name="Comment" disabled value={reset.comment} onUpdate={NO_OP} />
				</li>
				<hr />
			</React.Fragment>)}
		</SectionList>
	);
}

function RandomExitResets({ resets, rooms }: { resets: RandomExitReset[], rooms: Room[] }) {
	const dispatch = useAppDispatch();
	const [fixed, setFixed] = useState<FixedVnum[]>([]);
	if (resets.length === 0 && fixed.length === 0) return null;

	function onUpdate(roomId: string, reset: RandomExitReset) {
		const room = rooms.find(r => r.id === roomId);
		if (room) {
			dispatch(restoredRandomExitReset([roomId, reset]));
			setFixed([...fixed, { id: roomId, name: room.name, vnum: room.vnum }]);
		}
	}

	return (
		<SectionList header={<h2>Random exit resets</h2>}>
			{resets.map(reset => <React.Fragment key={reset.id}>
				<li>
					<ToolRow>
						<SelectVnum name="Room" selectedId={reset.roomId} items={rooms} onUpdate={roomid => onUpdate(roomid, reset)} />
						<NumberField name="Number of exits" disabled value={reset.numExits} onUpdate={NO_OP} />
					</ToolRow>
					<TextField name="Comment" disabled value={reset.comment} onUpdate={NO_OP} />
				</li>
				<hr />
			</React.Fragment>)}
		</SectionList>
	);
}
