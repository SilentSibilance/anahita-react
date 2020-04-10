import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { singularize } from 'inflected';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import ActorInfoForm from '../../components/actor/forms/Info';
import SimpleSnackbar from '../../components/SimpleSnackbar';
import * as actions from '../../actions';
import form from '../../utils/forms';
import formFields from '../../formfields/actor/info';

import ActorsType from '../../proptypes/Actors';
import ActorDefault from '../../proptypes/ActorDefault';

const ActorsAdd = (props) => {
  const {
    addActor,
    actors: {
      current: actor = { ...ActorDefault },
    },
    namespace,
    isFetching,
    success,
    error,
  } = props;

  const [fields, setFields] = useState(formFields);

  const handleOnChange = (event) => {
    const { target } = event;
    const { name, value } = target;

    actor[name] = value;

    const newFields = form.validateField(target, fields);

    setFields({ ...newFields });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    const { target } = event;
    const newFields = form.validateForm(target, fields);

    if (form.isValid(newFields)) {
      const { name, body } = actor;
      addActor({
        name,
        body,
      });
    }

    setFields({ ...newFields });
  };

  if (success) {
    return (
      <Redirect to={`/${namespace}/${actor.id}/`} />
    );
  }

  return (
    <React.Fragment>
      <Card>
        <CardHeader
          title={actor.name}
          avatar={
            <Avatar
              aria-label={actor.name}
              alt={actor.name}
            >
              {actor.name ? actor.name.charAt(0).toUpperCase() : <GroupAddIcon />}
            </Avatar>
          }
        />
        <ActorInfoForm
          formTitle={`${singularize(namespace)} information`}
          actor={actor}
          fields={fields}
          handleOnChange={handleOnChange}
          handleOnSubmit={handleOnSubmit}
          isFetching={isFetching}
          dismissPath={`/${namespace}/`}
        />
      </Card>
      {error &&
        <SimpleSnackbar
          isOpen={Boolean(error)}
          message="Something went wrong!"
          type="error"
        />
      }
    </React.Fragment>
  );
};

ActorsAdd.propTypes = {
  addActor: PropTypes.func.isRequired,
  actors: ActorsType.isRequired,
  namespace: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

const mapStateToProps = (namespace) => {
  return (state) => {
    const {
      isFetching,
      success,
      error,
    } = state[namespace];

    return {
      actors: state[namespace][namespace],
      namespace,
      isFetching,
      success,
      error,
    };
  };
};

const mapDispatchToProps = (namespace) => {
  return (dispatch) => {
    return {
      addActor: (actor) => {
        return dispatch(actions[namespace].add(actor));
      },
    };
  };
};

export default (namespace) => {
  return connect(
    mapStateToProps(namespace),
    mapDispatchToProps(namespace),
  )(ActorsAdd);
};
