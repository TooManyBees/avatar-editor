import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changedTab } from "../../app/store/ui";
import { selectedMobileId, selectedObjectId } from "../../app/store/ui";
import { MobReset, ObjectReset } from "../../app/models";
import {
	LinkButton,
	Section,
} from "../components";
import styles from "../components/ReciprocalResets.module.css";

interface Props {
	roomId: string;
}

export default function ReciprocalResets(props: Props) {
	const { roomId } = props;
	const objectResets = useAppSelector(state => state.resets.resets.object).filter(r => r.roomId === roomId);
	const mobResets = useAppSelector(state => state.resets.resets.mobile).filter(r => r.roomId === roomId);

	if (objectResets.length + mobResets.length === 0) return null;

	return (
		<Section header={<h2>Loading in this room</h2>}>
			{mobResets.length > 0 && <MobResets resets={mobResets} />}
			{objectResets.length > 0 && <ObjectResets resets={objectResets} />}
		</Section>
	);
}

function MobResets(props: { resets: MobReset[] }) {
	const dispatch = useAppDispatch();
	const mobiles = useAppSelector(state => state.mobiles.mobiles);

	return (
		<ol className={styles.list}>
			{props.resets.map(reset => {
				const mobile = mobiles.find(m => m.id === reset.mobId);
				if (!mobile) return null;
				const vnum = mobile?.vnum?.toString() || "";
				const name = mobile?.shortDesc || "<unnamed mobile>";
				return (
					<li key={reset.id}>
						<LinkButton className={styles.link} onClick={() => dispatch(selectedMobileId(reset.mobId))}>
							<span className={styles.annotation}>(Mobile{vnum && <>&nbsp;<span className={styles.vnum}>{vnum}</span></>})</span> {name}
						</LinkButton>
					</li>
				);
			})}
		</ol>
	);
}

function ObjectResets(props: { resets: ObjectReset[] }) {
	const dispatch = useAppDispatch();
	const objects = useAppSelector(state => state.objects.objects);

	return (
		<ol className={styles.list}>
			{props.resets.map(reset => {
				const object = objects.find(o => o.id === reset.objectId);
				if (!object) return null;
				const vnum = object?.vnum?.toString() || "";
				const name = object?.shortDesc || "<unnamed object>";
				return (
					<li key={reset.id}>
						<LinkButton className={styles.link} onClick={() => dispatch(selectedObjectId(reset.objectId))}>
							<span className={styles.annotation}>(Object{vnum && <>&nbsp;<span className={styles.vnum}>{vnum}</span></>})</span> {name}
						</LinkButton>
					</li>
				);
			})}
		</ol>
	);
}
