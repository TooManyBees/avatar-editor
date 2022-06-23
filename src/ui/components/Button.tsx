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
	decoration?: string;
	ariaLabel?: string;
	title?: string;
	disabled?: boolean;
}

export function Button(props: Props) {
	const {
		children,
		className,
		style,
		onClick,
		onHoverState,
		tabIndex,
		buttonRef,
		ariaLabel,
		decoration,
		title,
		disabled = false,
	} = props;

	return (
		<button
			className={classnames(className, styles.button)}
			style={style}
			onClick={onClick}
			onFocus={onHoverState ? () => onHoverState(true) : undefined}
			onBlur={onHoverState ? () => onHoverState(false) : undefined}
			onMouseOver={onHoverState ? () => onHoverState(true): undefined}
			onMouseOut={onHoverState ? () => onHoverState(false): undefined}
			tabIndex={tabIndex}
			aria-label={ariaLabel}
			title={title}
			ref={buttonRef}
			disabled={disabled}
		>
			{decoration && <><span aria-hidden="true">{decoration}</span> </>}{children}
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

interface HasVnum {
	vnum: number | null;
	shortDesc?: string;
	name?: string;
}

interface VnumLinkProps {
	item: HasVnum;
	itemName: string;
	annotation?: string;
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
	tabIndex?: number;
}

export function VnumLink(props: VnumLinkProps) {
	const { item, itemName, annotation, ...rest} = props;
	const vnum = item.vnum?.toString() || "";
	const name = item.shortDesc || item.name;
	const title = name
		? `Jump to to ${itemName.toLowerCase()} ${vnum || ""} ${name}`
		: `Jump to to unnamed ${itemName.toLowerCase()} ${vnum || ""}`;
	return (
		<LinkButton {...rest} title={title} className={styles.vnumLink}>
			<em>({annotation || itemName}{vnum && <>&nbsp;<span className={styles.vnum}>{vnum}</span></>})</em>
			&nbsp;{name || `<unnamed ${itemName.toLowerCase()}>`}
		</LinkButton>
	);
}

interface DeleteButtonProps extends Props {
	absolute?: boolean;
}

export function DeleteButton(props: DeleteButtonProps) {
	const [prompt, setPrompt] = useState<boolean | null>(null);
	const initialButton = useRef<HTMLButtonElement>(null);
	const deleteButton = useRef<HTMLButtonElement>(null);
	const cancelButton = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (prompt) cancelButton.current?.focus();
		else if (prompt == false) initialButton.current?.focus();
	}, [prompt])

	const { onClick, onHoverState, absolute, ...rest } = props;

	function onBlur({ relatedTarget }: React.FocusEvent<HTMLSpanElement>) {
		if (prompt == null) return;
		if (initialButton.current !== relatedTarget && deleteButton.current !== relatedTarget && cancelButton.current !== relatedTarget) {
			setPrompt(false);
		}
	}

	return (
		<span className={classnames(styles.deleteWrapper, prompt && styles.prompting, absolute && styles.absolute)} onBlur={onBlur}>
			<LinkButton
				{...rest}
				onClick={() => setPrompt(true)}
				children={props.children || "Delete"}
				className={classnames(styles.delete, props.className)}
				tabIndex={prompt ? -1 : 0}
				onHoverState={onHoverState}
				buttonRef={initialButton}
				decoration="✖"
			/>
			<span className={styles.confirmation} aria-live={prompt ? "assertive" : undefined}>
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
			decoration="+"
		/>
	);
}
