import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import styles from "./button.module.css";

interface Props {
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
	onHoverState?: (state: boolean) => void;
	tabIndex?: number;
	buttonRef?: React.RefObject<HTMLButtonElement>
}

export function Button(props: Props) {
	const { children, className, style, onClick, onHoverState, tabIndex, buttonRef } = props;
	return (
		<button
			className={classnames(className, styles.button)}
			style={style}
			onClick={onClick}
			onMouseOver={onHoverState ? () => onHoverState(true): undefined}
			onMouseOut={onHoverState ? () => onHoverState(false): undefined}
			tabIndex={tabIndex}
			ref={buttonRef}
		>
			{children}
		</button>
	);
}

export function LinkButton(props: Props) {
	return (
		<Button
			{...props}
			className={classnames(styles.link, props.className)}
		/>
	);
}

export function DeleteButton(props: Props) {
	const [prompt, setPrompt] = useState<boolean | null>(null);
	const initialButton = useRef<HTMLButtonElement>(null);
	const deleteButton = useRef<HTMLButtonElement>(null);
	const cancelButton = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (prompt) cancelButton.current?.focus();
		else if (prompt == false) initialButton.current?.focus();
	}, [prompt])

	const { onClick, onHoverState, ...rest } = props;

	function onBlur({ relatedTarget }: React.FocusEvent<HTMLSpanElement>) {
		if (initialButton.current !== relatedTarget && deleteButton.current !== relatedTarget && cancelButton.current !== relatedTarget) {
			setPrompt(false);
		}
	}

	return (
		<span className={classnames(styles.deleteWrapper, prompt && styles.prompting)} onBlur={onBlur}>
			<LinkButton
				{...rest}
				onClick={() => setPrompt(true)}
				children={props.children || "Delete"}
				className={classnames(styles.delete, props.className)}
				tabIndex={prompt ? -1 : 0}
				onHoverState={onHoverState}
				buttonRef={initialButton}
			/>
			<span className={styles.confirmation}>
				Confirm delete?
				<div className={styles.buttons}>
					<Button tabIndex={prompt ? 0 : -1} buttonRef={cancelButton} onClick={() => setPrompt(false)}>Cancel</Button>
					<Button tabIndex={prompt ? 0 : -1} buttonRef={deleteButton} onClick={onClick} className={styles.danger} onHoverState={onHoverState}>Yes, delete</Button>
				</div>
			</span>
		</span>
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
