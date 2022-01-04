import React, { useState } from "react";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Actions from "../../app/store/area-section";
import { Help } from "../../app/models";
import TabsLayout from "./tabs-layout";
import { TextField } from "../fields";
import {
	DeleteButton,
	KeywordField,
	NumberField,
	Row,
	TextArea,
	ToolRow,
} from "../components";
import styles from "./area.module.css";
import sharedStyles from "../components/shared.module.css";

export default function AreaTab() {
	const dispatch = useAppDispatch();
	const area = useAppSelector(state => state.area);

	const updatedLine = (s: string) => dispatch(Actions.updatedLine(s));

	return (
		<TabsLayout>
			<div>
				<TextField className={styles.areaField} name="#AREA" value={area.line} onUpdate={updatedLine} />
			</div>

			<ToolRow>
				<h2>Helps</h2>
				<button onClick={() => dispatch(Actions.addedHelp())}>Add help</button>
			</ToolRow>
			<ol className={styles.helps}>
				{area.helps.map(h => <li key={h.id} ><HelpForm help={h} /></li>)}
			</ol>
		</TabsLayout>
	);
}

function HelpForm({ help }: { help: Help }) {
	const dispatch = useAppDispatch();
	const [danger, setDanger] = useState(false);
	return (
		<div className={classnames(sharedStyles.container, danger && sharedStyles.dangerTarget)}>
			<ToolRow>
				<NumberField name="Level" inline value={help.level} onUpdate={level => dispatch(Actions.updatedHelp({...help, level}))} />
				<KeywordField name="Keywords" value={help.keywords} onUpdate={keywords => dispatch(Actions.updatedHelp({...help, keywords}))} />
				<DeleteButton onHoverState={setDanger} onClick={() => dispatch(Actions.removedHelp(help.id))}>Remove</DeleteButton>
			</ToolRow>
			<TextArea name="Body" value={help.body} onUpdate={body => dispatch(Actions.updatedHelp({...help, body}))} />
		</div>
	);
}
