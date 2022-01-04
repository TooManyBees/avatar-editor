import React, { CSSProperties } from "react";
import classnames from "classnames";
import styles from "./shared.module.css";

interface Props {
	children: React.ReactNode;
	className?: string;
	style?: CSSProperties;
}

interface SectionProps extends Props {
	header?: React.ReactNode;
}

export function Section(props: SectionProps) {
	return (
		<div className={classnames(styles.section, props.className)} style={props.style}>
			{props.header && <div className={styles.header}>{props.header}</div>}
			{props.children}
		</div>
	);
}

export function Row(props: Props) {
	return (
		<div className={classnames(styles.row, props.className)} style={props.style}>
			{props.children}
		</div>
	);
}

export function ToolRow(props: Props) {
	return (
		<div className={classnames(styles.toolRow, props.className)} style={props.style}>
			{props.children}
		</div>
	);
}
