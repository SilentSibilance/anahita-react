import React from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import EntityBody from '../EntityBody';
import CommentType from '../../proptypes/Comment';

const styles = (theme) => {
  return {
    root: {
      backgroundColor: theme.palette.grey[100],
    },
    title: {
      fontSize: 16,
      fontWeight: 500,
      marginBottom: theme.spacing(2),
    },
    authorName: {
      fontSize: 16,
    },
    content: {
      paddingTop: 0,
    },
  };
};

const CommentCard = (props) => {
  const {
    comment,
    classes,
    actions,
    menu,
    isEditing,
    commentForm,
  } = props;

  const { author, creationTime } = comment;

  if (isEditing) {
    return (
      <React.Fragment>
        {commentForm}
      </React.Fragment>
    );
  }

  return (
    <Card square className={classes.root}>
      <CardHeader
        avatar={
          <ActorAvatar
            actor={author}
            linked={Boolean(author.id)}
            size="small"
          />
        }
        title={
          <ActorTitle
            actor={author}
            linked={Boolean(author.id)}
          />
        }
        subheader={
          <ReactTimeAgo
            date={new Date(creationTime)}
          />
        }
        action={menu}
      />
      <CardContent className={classes.content}>
        <EntityBody size="small">
          {comment.body}
        </EntityBody>
      </CardContent>
      {actions &&
        <CardActions>
          {actions}
        </CardActions>
      }
    </Card>
  );
};

CommentCard.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menu: PropTypes.node,
  comment: CommentType.isRequired,
  commentForm: PropTypes.node,
  isEditing: PropTypes.bool,
};

CommentCard.defaultProps = {
  actions: null,
  menu: null,
  commentForm: null,
  isEditing: false,
};

export default withStyles(styles)(CommentCard);
