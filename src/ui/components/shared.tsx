import React from "react";
import classnames from "classnames";
import styles from "./shared.module.css";

interface RowProps {
	children: React.ReactNode;
	className?: string;
}

export function ToolRow(props: RowProps) {
	return (
		<div className={classnames(styles.toolRow, props.className)}>
			{props.children}
		</div>
	);
}
