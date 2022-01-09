import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changedTab } from "../../app/store/ui";
import { selectedMobileId, selectedObjectId } from "../../app/store/ui";
import { InObjectReset, EquipmentReset, MobReset, Mobile } from "../../app/models";
import { sortByVnum } from "../../app/models/helpers";
import {
	LinkButton,
	Section,
} from "../components";
import styles from "../components/ReciprocalResets.module.css";

interface Props {
	objectId: string;
	vnum: number | null;
}

export default function ReciprocalResets(props: Props) {
	const { objectId, vnum } = props;
	const inObjectResets = useAppSelector(state => state.resets.resets.inObject).filter(r => r.objectId === objectId);
	const mobResets = useAppSelector(state => state.resets.resets.mobile).filter(r => r.equipment.some(e => e.objectId === objectId));
	const skinMob = vnum ? useAppSelector(state => state.mobiles.mobiles).find(m => m.vnum === vnum && m.act.includes(262144)) : null;

	let numMobs = mobResets.length;
	if (skinMob) numMobs += 1;

	if (inObjectResets.length + numMobs === 0) return null;

	return <>
		{inObjectResets.length > 0 &&
			<Section header={<h2>Loads in container</h2>}>
				<ol className={styles.list}>
					<ObjectResets resets={inObjectResets} />
				</ol>
			</Section>
		}
		{numMobs > 0 &&
			<Section header={<h2>Loads on mobiles</h2>}>
				<ol className={styles.list}>
					<EqResets resets={mobResets} />
					{skinMob && <SkinMob mobile={skinMob} />}
				</ol>
			</Section>
		}
	</>;
}

function ObjectResets(props: { resets: InObjectReset[] }) {
	const dispatch = useAppDispatch();
	const objects = useAppSelector(state => state.objects.objects);

	return <>
		{props.resets.map(reset => {
			const object = objects.find(o => o.id === reset.containerId);
			if (object) {
				const vnum = object.vnum?.toString() || "";
				const name = object.shortDesc || "<unnamed object>";
				return (
					<li key={reset.id}>
						<LinkButton className={styles.link} onClick={() => dispatch(selectedObjectId(reset.containerId))}>
							<span className={styles.vnum}>{vnum} </span>{name}
						</LinkButton>
					</li>
				);
			} else {
				return (
					<li key={reset.id}>
						<LinkButton className={styles.link} onClick={() => dispatch(changedTab("orphans"))}>
							&lt;an object that wasn't found in this area&gt;
						</LinkButton>
					</li>
				);
			}
		})}
	</>
}

function EqResets(props: {resets: MobReset[] }) {
	const dispatch = useAppDispatch();
	const allMobiles = useAppSelector(state => state.mobiles.mobiles);
	const mobiles: Mobile[] = [];
	for (let reset of props.resets) {
		let mobile = allMobiles.find(m => m.id === reset.mobId);
		if (mobile && !mobiles.includes(mobile)) mobiles.push(mobile);
	}
	sortByVnum(mobiles);

	return (
		<ol className={styles.list}>
			{mobiles.map(mobile => {
				const vnum = mobile.vnum?.toString() || "";
				const name = mobile.shortDesc || "<unnamed mobile>";
				return (
					<li key={mobile.id}>
						<LinkButton className={styles.link} onClick={() => dispatch(selectedMobileId(mobile.id))}>
							<span className={styles.vnum}>{vnum} </span>{name}
						</LinkButton>
					</li>
				);
			})}
		</ol>
	);
}

function SkinMob({ mobile }: { mobile: Mobile }) {
	const dispatch = useAppDispatch();
	const name = mobile.shortDesc || "<unnamed mobile>";
	return (
		<li>
			<LinkButton className={styles.link} onClick={() => dispatch(selectedMobileId(mobile.id))}>
				Skins from <span className={styles.vnum}>{mobile.vnum} </span>{name}
			</LinkButton>
		</li>
	)
}
