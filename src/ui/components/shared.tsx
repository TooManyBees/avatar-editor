import React, { CSSProperties } from "react";
import classnames from "classnames";
import styles from "./shared.module.css";

interface RowProps {
	children: React.ReactNode;
	className?: string;
	style?: CSSProperties;
}

export function Row(props: RowProps) {
	return (
		<div className={classnames(styles.row, props.className)} style={props.style}>
			{props.children}
		</div>
	);
}

export function ToolRow(props: RowProps) {
	return (
		<div className={classnames(styles.toolRow, props.className)} style={props.style}>
			{props.children}
		</div>
	);
}
