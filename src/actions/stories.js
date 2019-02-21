import { normalize, schema } from 'normalizr';
import { stories as api } from '../api';
import { Stories as STORIES } from '../constants';

// -- reset

function reset() {
  return {
    type: STORIES.BROWSE.RESET,
  };
}

// -- Browse

function browseRequest() {
  return {
    type: STORIES.BROWSE.REQUEST,
  };
}

function browseSuccess(results) {
  const { data } = results;
  const { pagination } = data;

  const story = new schema.Entity('stories');
  const stories = [story];
  const normalized = normalize(data.data, stories);
  const hasMore = data.data.length >= pagination.limit;

  return {
    type: STORIES.BROWSE.SUCCESS,
    stories: normalized.entities.stories,
    ids: normalized.result,
    total: pagination.total,
    hasMore,
  };
}

function browseFailure(error) {
  return {
    type: STORIES.BROWSE.FAILURE,
    error: error.message,
  };
}

function browse(params) {
  return (dispatch) => {
    dispatch(browseRequest());
    return new Promise((resolve, reject) => {
      api.browse(params)
        .then((result) => {
          dispatch(browseSuccess(result));
          return resolve();
        }, (response) => {
          dispatch(browseFailure(response));
          return reject(response);
        }).catch((error) => {
          throw new Error(error);
        });
    });
  };
}

export default {
  reset,
  browse,
};
