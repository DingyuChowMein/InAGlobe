import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from '@material-ui/core/TextField';
// @material-ui/icons
import Clear from "@material-ui/icons/Clear";
import Check from "@material-ui/icons/Check";
// core components
import styles from "../../assets/jss/material-dashboard-react/components/customInputStyle.js";

const useStyles = makeStyles(styles);

export default function CustomInput(props) {
	const classes = useStyles();
	const {
		formControlProps,
		labelText,
		id,
		inputProps,
		error,
		success,
		extraLines
	} = props;

	// const labelClasses = classNames({
	// 	[" " + classes.labelRootError]: error,
	// 	[" " + classes.labelRootSuccess]: success && !error
	// });
	const underlineClasses = classNames({
		[classes.underlineError]: error,
		[classes.underlineSuccess]: success && !error,
		[classes.underline]: true
	});
	const marginTop = classNames({
		[classes.marginTop]: labelText === undefined
	});
	return (
		<FormControl
			{...formControlProps}
			className={formControlProps.className + " " + classes.formControl}
		>
			{!extraLines ? (
				<TextField 
					classes={{
						root: marginTop,
						disabled: classes.disabled,
						underline: underlineClasses
					}}
					label={labelText}
					id={id}
					{...inputProps}
				/>
			) : (
				<TextField 
					classes={{
						root: marginTop,
						disabled: classes.disabled,
						underline: underlineClasses
					}}
					label={labelText}
					multiline
					id={id}
					{...inputProps}
				/>
			)}
			{error ? (
				<Clear className={classes.feedback + " " + classes.labelRootError} />
			) : success ? (
				<Check className={classes.feedback + " " + classes.labelRootSuccess} />
			) : null}
		</FormControl>
	);
}

CustomInput.propTypes = {
	labelText: PropTypes.node,
	labelProps: PropTypes.object,
	id: PropTypes.string,
	inputProps: PropTypes.object,
	formControlProps: PropTypes.object,
	error: PropTypes.bool,
	success: PropTypes.bool
};