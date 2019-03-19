import _ from 'lodash';
import { Actors as ACTORS } from '../constants';
import ACTOR_DEFAULT from '../proptypes/ActorDefault';
import utils from './utils';

const DEFAULT_STATE = {
  isFetching: false,
  isFetchingAvatar: false,
  isFetchingCover: false,
  actors: {
    byId: {},
    allIds: [],
    current: ACTOR_DEFAULT,
  },
  error: '',
  total: 0,
  hasMore: true,
  success: false,
};

export default function (higherOrderState, action) {
  const state = {
    ...DEFAULT_STATE,
    ...higherOrderState,
  };

  switch (action.type) {
    case ACTORS.BROWSE.RESET:
      return {
        ...state,
        ...DEFAULT_STATE,
      };
    case ACTORS.BROWSE.REQUEST:
    case ACTORS.READ.REQUEST:
    case ACTORS.EDIT.REQUEST:
    case ACTORS.ADD.REQUEST:
      return {
        ...state,
        isFetching: true,
        success: false,
        error: '',
      };
    case ACTORS.DELETE.REQUEST:
      return {
        ...state,
        current: action.current,
        isFetching: true,
        success: false,
        error: '',
      };
    case ACTORS.AVATAR.ADD.REQUEST:
    case ACTORS.AVATAR.DELETE.REQUEST:
      return {
        ...state,
        isFetchingAvatar: true,
        success: false,
        error: '',
      };
    case ACTORS.COVER.ADD.REQUEST:
    case ACTORS.COVER.DELETE.REQUEST:
      return {
        ...state,
        isFetchingCover: true,
        success: false,
        error: '',
      };
    case ACTORS.BROWSE.SUCCESS:
      return {
        ...state,
        actors: {
          byId: {
            ...state.actors.byId,
            ...action.actors,
          },
          allIds: _.union(state.actors.allIds, action.ids),
          current: ACTOR_DEFAULT,
        },
        total: action.total,
        hasMore: action.hasMore,
        isFetching: false,
      };
    case ACTORS.READ.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actors: utils.editItem(state.actors, action.actor),
        success: false,
      };
    case ACTORS.EDIT.SUCCESS:
    case ACTORS.ADD.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actors: utils.editItem(state.actors, action.actor),
        success: true,
      };
    case ACTORS.DELETE.SUCCESS:
      return {
        ...state,
        isFetching: false,
        actors: utils.deleteItem(state.actors, state.current),
        success: true,
      };
    case ACTORS.AVATAR.ADD.SUCCESS:
    case ACTORS.AVATAR.DELETE.SUCCESS:
    case ACTORS.COVER.ADD.SUCCESS:
      return {
        ...state,
        isFetchingAvatar: false,
        isFetchingCover: false,
        success: true,
        error: '',
        actors: utils.editItem(state.actors, action.actor),
      };
    case ACTORS.BROWSE.FAILURE:
    case ACTORS.READ.FAILURE:
    case ACTORS.EDIT.FAILURE:
    case ACTORS.ADD.FAILURE:
    case ACTORS.DELETE.FAILURE:
    case ACTORS.AVATAR.ADD.FAILURE:
    case ACTORS.AVATAR.DELETE.FAILURE:
      return {
        ...state,
        hasMore: false,
        isFetchingAvatar: false,
        isFetchingCover: false,
        isFetching: false,
        success: false,
        error: action.error,
      };
    default:
      return state;
  }
}
