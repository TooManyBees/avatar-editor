import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changedTab } from "../../app/store/ui";
import { selectedId as selectedObjectId } from "../../app/store/objects";
import { InObjectReset } from "../../app/models";
import {
	LinkButton,
	Section,
} from "../components";
import styles from "../common/ReciprocalResets.module.css";

interface Props {
	containerId: string;
}

export default function ReciprocalResets(props: Props) {
	const { containerId } = props;
	const resets = useAppSelector(state => state.resets.resets.inObject).filter(r => r.containerId === containerId);

	if (resets.length === 0) return null;

	return (
		<Section header={<h2>Loading in this container</h2>}>
			<ObjectResets resets={resets} />
		</Section>
	);
}

function ObjectResets(props: { resets: InObjectReset[] }) {
	const dispatch = useAppDispatch();
	const objects = useAppSelector(state => state.objects.objects);

	function selectObject(id: string) {
		dispatch(selectedObjectId(id));
		dispatch(changedTab("objects"));
	}

	return (
		<ol className={styles.list}>
			{props.resets.map(reset => {
				const object = objects.find(o => o.id === reset.objectId);
				if (!object) return null;
				const vnum = object?.vnum?.toString() || "";
				const name = object?.shortDesc || "<unnamed object>";
				return (
					<li key={reset.id}>
						<LinkButton className={styles.link} onClick={() => selectObject(reset.objectId)}>
							<span className={styles.vnum}>{vnum} </span>{name}
						</LinkButton>
					</li>
				);
			})}
		</ol>
	);
}
