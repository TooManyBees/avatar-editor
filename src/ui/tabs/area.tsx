import React, { useState } from "react";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
	updatedLevelRange,
	updatedAuthor,
	updatedName,
	addedHelp,
	updatedHelp,
	removedHelp,
} from "../../app/store/area-section";
import { Help } from "../../app/models";
import { TabsContents } from "./tabs-layout";
import {
	AddButton,
	DeleteButton,
	KeywordField,
	NumberField,
	Row,
	SectionList,
	TextArea,
	TextField,
	ToolRow,
} from "../components";
import styles from "./area.module.css";
import sharedStyles from "../components/shared.module.css";

export default function AreaTab() {
	const dispatch = useAppDispatch();
	const area = useAppSelector(state => state.area);

	return (
		<TabsContents>
			<ToolRow>
				<TextField name="Level Range" maxLength={6} style={{width: "5rem"}} value={area.levelRange} onUpdate={levelRange => dispatch(updatedLevelRange(levelRange))} />
				<TextField name="Author" maxLength={7} style={{width: "6rem"}} value={area.author} onUpdate={author => dispatch(updatedAuthor(author))} />
				<TextField name="Name" value={area.name} onUpdate={name => dispatch(updatedName(name))} />
			</ToolRow>

			<SectionList header={<><h2>Helps</h2><AddButton onClick={() => dispatch(addedHelp())}>Add help</AddButton></>}>
				{area.helps.map(h => <HelpForm key={h.id} help={h} />)}
			</SectionList>
		</TabsContents>
	);
}

function HelpForm({ help }: { help: Help }) {
	const dispatch = useAppDispatch();
	const [danger, setDanger] = useState(false);
	return (
		<li className={classnames(styles.help, danger && sharedStyles.dangerTarget)}>
			<ToolRow>
				<NumberField name="Level" value={help.level} onUpdate={level => dispatch(updatedHelp({...help, level}))} />
				<KeywordField name="Keywords" value={help.keywords} onUpdate={keywords => dispatch(updatedHelp({...help, keywords}))} />
			</ToolRow>
			<TextArea name="Body" value={help.body} colors="help" onUpdate={body => dispatch(updatedHelp({...help, body}))} />
			<DeleteButton onHoverState={setDanger} absolute onClick={() => dispatch(removedHelp(help.id))}>Remove</DeleteButton>
		</li>
	);
}
