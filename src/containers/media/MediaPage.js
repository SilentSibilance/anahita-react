import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import StackGrid from 'react-stack-grid';
import InfiniteScroll from 'react-infinite-scroller';
import Link from 'react-router-dom/Link';
import {
  browseMedia,
  resetMedia,
} from '../../actions/media';
import { Person as PERSON } from '../../constants';
import MediumCard from '../../components/cards/MediumCard';
import ActorAvatar from '../../components/ActorAvatar';
import ActorTitle from '../../components/ActorTitle';

const styles = theme => ({
  root: {
    width: '100%',
  },
  title: {
    textTransform: 'capitalize',
  },
  progress: {
    marginLeft: '48%',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  addButton: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
    zIndex: 10,
  },
});

class MediaPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ownerId: 0,
      filter: '',
    };

    this.fetchMedia = this.fetchMedia.bind(this);
  }

  componentWillUnmount() {
    this.props.resetMedia();
  }

  fetchMedia() {
    const { ownerId, filter } = this.state;
    const {
      offset,
      limit,
      namespace,
    } = this.props;

    this.props.browseMedia({
      ownerId,
      filter,
      start: offset,
      limit,
    }, namespace);
  }

  hasMore() {
    const {
      offset,
      total,
      media,
    } = this.props;

    return offset === 0 || (Object.keys(media).length < total);
  }

  canAdd() {
    const { viewer } = this.props;

    if (viewer.usertype === PERSON.TYPE.SUPER_ADMIN) {
      return true;
    }

    if (viewer.usertype === PERSON.TYPE.ADMIN) {
      return true;
    }

    return false;
  }

  render() {
    const {
      classes,
      media,
      namespace,
    } = this.props;

    const hasMore = this.hasMore();

    return (
      <div className={classes.root}>
        {this.canAdd() &&
          <div>
            <Button
              className={classes.addButton}
              variant="fab"
              color="secondary"
              aria-label="add"
              component={Link}
              to={`/${namespace}/add/`}
            >
              <AddIcon />
            </Button>
          </div>
        }
        <Toolbar>
          <Typography
            variant="title"
            color="inherit"
            className={classes.title}
          >
            {namespace}
          </Typography>
        </Toolbar>
        <InfiniteScroll
          loadMore={this.fetchMedia}
          hasMore={hasMore}
          loader={<CircularProgress key={0} className={classes.progress} />}
        >
          <StackGrid
            columnWidth={320}
            gutterWidth={20}
            gutterHeight={20}
          >
            {media.map((medium) => {
              const key = `medium_${medium.id}`;
              // const portrait = medium.imageURL.medium && medium.imageURL.medium.url;

              return (
                <MediumCard
                  key={key}
                  author={
                    <ActorTitle
                      actor={medium.author}
                      typographyProps={{
                          headlineMapping: {
                            title: 'h3',
                          },
                          variant: 'title',
                      }}
                      linked
                    />
                  }
                  authorAvatar={
                    <ActorAvatar
                      actor={medium.author}
                      linked
                    />
                  }
                  owner={
                    <ActorTitle
                      actor={medium.owner}
                      typographyProps={{
                          headlineMapping: {
                            subheading: 'h4',
                          },
                          variant: 'subheading',
                      }}
                      linked
                    />
                  }
                  title={medium.title}
                  alias={medium.alias}
                  description={medium.body}
                  // portrait={portrait}
                  path={`/${namespace}/${medium.id}/`}
                />
              );
            })
            }
          </StackGrid>
        </InfiniteScroll>
      </div>
    );
  }
}

MediaPage.propTypes = {
  classes: PropTypes.object.isRequired,
  browseMedia: PropTypes.func.isRequired,
  resetMedia: PropTypes.func.isRequired,
  media: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired,
  offset: PropTypes.number,
  limit: PropTypes.number,
  total: PropTypes.number,
  viewer: PropTypes.object.isRequired,
  queryFilters: PropTypes.object,
};

MediaPage.defaultProps = {
  queryFilters: {},
  total: 0,
  limit: 20,
  offset: 0,
};

const mapStateToProps = (state) => {
  const {
    media,
    error,
    offset,
    limit,
    total,
  } = state.mediaReducer;

  const { viewer } = state.authReducer;

  return {
    media,
    error,
    offset,
    limit,
    total,
    viewer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    browseMedia: (params, namespace) => {
      dispatch(browseMedia(params, namespace));
    },
    resetMedia: () => {
      dispatch(resetMedia());
    },
  };
};

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps,
)(MediaPage));
