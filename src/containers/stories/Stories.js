import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import InfiniteScroll from 'react-infinite-scroller';
import actions from '../../actions/stories';

import StoryCard from '../../components/cards/Story';
import StoriesType from '../../proptypes/Stories';

const LIMIT = 20;

class StoriesContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      hasMore: true,
      stories: {
        byId: {},
        allIds: [],
      },
    };

    this.offset = 0;
    this.fetchStories = this.fetchStories.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { stories, hasMore } = nextProps;
    this.setState({ hasMore, stories });
  }

  componentWillUnmount() {
    const { resetStories } = this.props;
    resetStories();
  }

  fetchStories() {
    const {
      browseStories,
      queryFilters,
    } = this.props;

    browseStories({
      ownerId: queryFilters.oid,
      filter: queryFilters.filter,
      start: this.offset,
      limit: LIMIT,
    });

    this.offset += LIMIT;
  }

  render() {
    const {
      stories,
      hasMore,
    } = this.state;

    return (
      <Grid
        container
        justify="center"
      >
        <Grid item xs={12} md={4}>
          <InfiniteScroll
            loadMore={this.fetchStories}
            hasMore={hasMore}
            loader={
              <Grid
                container
                justify="center"
                alignItems="center"
                key="stories-progress"
              >
                <Grid item>
                  <CircularProgress />
                </Grid>
              </Grid>
            }
          >
            {stories.allIds.map((storyId) => {
              const story = stories.byId[storyId];
              const key = `story_${story.id}`;
              return (
                <StoryCard
                  story={story}
                  key={key}
                />
              );
            })
            }
          </InfiniteScroll>
        </Grid>
      </Grid>
    );
  }
}

StoriesContainer.propTypes = {
  browseStories: PropTypes.func.isRequired,
  resetStories: PropTypes.func.isRequired,
  stories: StoriesType.isRequired,
  queryFilters: PropTypes.object,
  hasMore: PropTypes.bool.isRequired,
};

StoriesContainer.defaultProps = {
  queryFilters: {
    filter: '',
    oid: '',
  },
};

const mapStateToProps = (state) => {
  const {
    stories,
    hasMore,
    error,
  } = state.stories;

  return {
    stories,
    hasMore,
    error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseStories: (params) => {
      dispatch(actions.browse(params));
    },
    resetStories: () => {
      dispatch(actions.reset());
    },
  };
};

export default (connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoriesContainer));
