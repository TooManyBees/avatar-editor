import React from "react";
import classnames from "classnames";
import styles from "./button.module.css";

interface Props {
	children?: React.ReactNode;
	className?: string;
	onClick?: () => void;
	onHoverState?: (state: boolean) => void;
}

export function Button(props: Props) {
	const { children, className = "", onClick, onHoverState } = props;
	return (
		<button
			className={`${className} ${styles.button}`}
			onClick={onClick}
			onMouseOver={onHoverState ? () => onHoverState(true): undefined}
			onMouseOut={onHoverState ? () => onHoverState(false): undefined}
		>
			{children}
		</button>
	);
}

export function LinkButton(props: Props) {
	return (
		<span>
			<Button
				{...props}
				className={classnames(styles.link, props.className)}
			/>
		</span>
	);
}

export function DeleteButton(props: Props) {
	return (
		<LinkButton
			{...props}
			children={props.children || "Delete"}
			className={classnames(styles.delete, props.className)}
		/>
	);
}

export function AddButton(props: Props) {
	return (
		<LinkButton
			{...props}
			children={props.children || "Add"}
			className={classnames(styles.add, props.className)}
		/>
	);
}
