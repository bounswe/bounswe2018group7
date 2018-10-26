import React from "react";
import PropTypes from "prop-types";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import styles from "./styles";

const PTextInput = props => {
  const {
    label,
    autoFocus,
    inputId,
    margin,
    value,
    onChange,
    error,
    helperText,
    className,
    fullWidth,
    type,
    whiteColor,
    disabled,
    multiline,
    rows,
    inputProps,
    inputLabelProps
  } = props;

  const labelWhiteProps = whiteColor ? { style: { color: "white" } } : {};

  return (
    <TextField
      id={inputId}
      label={label}
      type={type}
      autoFocus={autoFocus}
      className={className}
      value={value}
      onChange={onChange}
      margin={margin}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      InputProps={inputProps}
      InputLabelProps={inputLabelProps ? inputLabelProps : labelWhiteProps}
      FormHelperTextProps={inputProps}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
    />
  );
};

PTextInput.propTypes = {
  label: PropTypes.string,
  autoFocus: PropTypes.bool,
  inputId: PropTypes.string,
  margin: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  type: PropTypes.string,
  whiteColor: PropTypes.bool,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  inputProps: PropTypes.object,
  inputLabelProps: PropTypes.object
};

export default withStyles(styles)(PTextInput);
