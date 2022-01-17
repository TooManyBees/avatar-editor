import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changedTab } from "../../app/store/ui";
import { selectedMobileId, selectedObjectId } from "../../app/store/ui";
import { MobReset, ObjectReset } from "../../app/models";
import {
	Section,
	VnumLink,
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
				return (
					<li key={reset.id}>
						<VnumLink item={mobile} itemName="Mobile" onClick={() => dispatch(selectedMobileId(reset.mobId))} />
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
				return (
					<li key={reset.id}>
						<VnumLink item={object} itemName="Object" onClick={() => dispatch(selectedObjectId(reset.objectId))} />
					</li>
				);
			})}
		</ol>
	);
}
