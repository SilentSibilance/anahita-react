import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import TextFieldUsername from './textfields/TextFieldUsername';
import TextFieldEmail from './textfields/TextFieldEmail';
import { Person as PERSON } from '../constants';

const styles = theme => ({
  root: {
    width: '100%',
  },
  formPaper: {
    padding: '20px',
  },
  formControl: {
    marginTop: theme.spacing.unit * 3,
    display: 'block',
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit,
  },
});

const PersonAddForm = (props) => {
  const {
    classes,
    formTitle,
    isSuperAdmin,
    handleFieldChange,
    handleFormSubmit,
    givenName,
    givenNameError,
    givenNameHelperText,
    familyName,
    familyNameError,
    familyNameHelperText,
    username,
    usernameHelperText,
    usernameError,
    email,
    emailHelperText,
    emailError,
    usertype,
    usertypeError,
    error,
    isFetching,
    dismissPath,
  } = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.formPaper} elevation={0}>
        {formTitle &&
          <Typography
            variant="title"
            color="primary"
            className={classes.formTitle}
          >
            {formTitle}
          </Typography>
        }
        <form onSubmit={handleFormSubmit}>
          { error &&
            <Typography
              variant="caption"
              color="error"
              paragraph
            >
                {error}
            </Typography>
          }
          <TextField
            name="givenName"
            value={givenName}
            onChange={handleFieldChange}
            label="First Name"
            error={givenNameError}
            helperText={givenNameHelperText}
            autoFocus
            fullWidth
            margin="normal"
          />
          <TextField
            name="familyName"
            value={familyName}
            onChange={handleFieldChange}
            label="Last Name"
            error={familyNameError}
            helperText={familyNameHelperText}
            fullWidth
            margin="normal"
          />
          <TextFieldUsername
            value={username}
            onChange={handleFieldChange}
            error={usernameError}
            helperText={usernameHelperText}
          />
          <TextFieldEmail
            value={email}
            onChange={handleFieldChange}
            error={emailError}
            helperText={emailHelperText}
          />
          <FormControl className={classes.formControl}>
            <InputLabel
              htmlFor="person-usertype"
            >
              {'User Type'}
            </InputLabel>
            <Select
              native
              name="usertype"
              value={usertype}
              error={usertypeError}
              onChange={handleFieldChange}
              input={<Input id="person-usertype" />}
            >
              <option value={PERSON.TYPE.REGISTERED}>
                {'Registered'}
              </option>
              <option value={PERSON.TYPE.ADMIN}>
                {'Administrator'}
              </option>
              {isSuperAdmin &&
                <option value={PERSON.TYPE.SUPER_ADMIN}>
                  {'Super Administrator'}
                </option>
              }
            </Select>
          </FormControl>
          {dismissPath &&
          <Button
            className={classes.button}
            component={Link}
            to={dismissPath}
          >
            {'Dismiss'}
          </Button>
          }
          <Button
            type="submit"
            variant="raised"
            color="primary"
            className={classes.button}
            disabled={isFetching}
          >
            {'Save'}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

PersonAddForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formTitle: PropTypes.string,
  isSuperAdmin: PropTypes.bool.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  givenName: PropTypes.string,
  givenNameError: PropTypes.bool,
  givenNameHelperText: PropTypes.string,
  familyName: PropTypes.string,
  familyNameError: PropTypes.bool,
  familyNameHelperText: PropTypes.string,
  username: PropTypes.string,
  usernameHelperText: PropTypes.string,
  usernameError: PropTypes.bool,
  email: PropTypes.string,
  emailHelperText: PropTypes.string,
  emailError: PropTypes.bool,
  usertype: PropTypes.oneOf([
    PERSON.TYPE.REGISTERED,
    PERSON.TYPE.ADMIN,
    PERSON.TYPE.SUPER_ADMIN,
  ]).isRequired,
  usertypeError: PropTypes.bool,
  isFetching: PropTypes.bool,
  error: PropTypes.string,
  dismissPath: PropTypes.string,
};

PersonAddForm.defaultProps = {
  formTitle: '',
  givenName: '',
  givenNameError: false,
  givenNameHelperText: '',
  familyName: '',
  familyNameError: false,
  familyNameHelperText: '',
  username: '',
  usernameError: false,
  usernameHelperText: '',
  email: '',
  emailError: false,
  emailHelperText: '',
  usertypeError: false,
  error: '',
  isFetching: false,
  dismissPath: '',
};

export default withStyles(styles)(PersonAddForm);
