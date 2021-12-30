import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Actions from "../../app/store/area-section";
import { Help } from "../../app/models";
import TabsLayout from "./tabs-layout";
import { NumberField, SelectField, TextArea, TextField } from "../fields";
import KeywordField from "../components/KeywordField";
import styles from "./area.module.css";

export default function AreaTab() {
	const dispatch = useAppDispatch();
	const area = useAppSelector(state => state.area);

	const updatedLine = (s: string) => dispatch(Actions.updatedLine(s));

	return (
		<TabsLayout>
			<div>
				<TextField className={styles.areaField} name="#AREA" value={area.line} onUpdate={updatedLine} />
			</div>

			<ol>
				{area.helps.map(h => <li key={h.id}><HelpForm help={h} /></li>)}
				<button onClick={() => dispatch(Actions.addedHelp())}>Add help</button>
			</ol>
		</TabsLayout>
	);
}

function HelpForm({ help }: { help: Help }) {
	const dispatch = useAppDispatch();
	return <>
		<NumberField name="Level" value={help.level} onUpdate={level => dispatch(Actions.updatedHelp({...help, level}))} />
		<KeywordField name="Keywords" value={help.keywords} onUpdate={keywords => dispatch(Actions.updatedHelp({...help, keywords}))} />
		<TextArea name="Body" value={help.body} onUpdate={body => dispatch(Actions.updatedHelp({...help, body}))} />
		<button onClick={() => dispatch(Actions.removedHelp(help.id))}>Remove</button>
	</>;
}
