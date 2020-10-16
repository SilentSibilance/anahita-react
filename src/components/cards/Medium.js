import React from 'react';
import PropTypes from 'prop-types';
import ReactTimeAgo from 'react-time-ago';
import withStyles from '@material-ui/core/styles/withStyles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import MediumType from '../../proptypes/Medium';
import ActorTitle from '../actor/Title';
import ActorAvatar from '../actor/Avatar';
import CardHeaderOwner from './Owner';
import Player from '../Player';
import ReadMore from '../ReadMore';
import contentfilter from '../contentfilter';

import {
  getAuthor,
  getURL,
  getPortraitURL,
  getCoverURL,
} from '../utils';

const styles = (theme) => {
  return {
    cover: {
      height: 0,
      paddingTop: '30%',
    },
    portrait: {
      height: 0,
      paddingTop: '100%',
    },
    title: {
      fontSize: 24,
      marginBottom: theme.spacing(2),
    },
    authorName: {
      fontSize: 16,
    },
    ownerName: {
      fontSize: 12,
    },
  };
};

const MediumCard = (props) => {
  const {
    classes,
    medium,
    actions,
    menu,
    handleView,
  } = props;

  const portrait = getPortraitURL(medium);
  const cover = getCoverURL(medium);
  const url = getURL(medium);
  const author = getAuthor(medium);

  return (
    <Card component="article">
      {medium.author && medium.owner.id !== medium.author.id &&
        <CardHeaderOwner node={medium} />
      }
      {cover &&
        <ButtonBase
          // href={url}
          component="a"
          style={{
            width: '100%',
            display: 'inline',
          }}
          onClick={(e) => {
            return handleView(e, medium);
          }}
        >
          <CardMedia
            className={classes.cover}
            image={cover}
            title={medium.name}
            src="picture"
          />
        </ButtonBase>
      }
      <CardHeader
        avatar={
          <ActorAvatar
            actor={author}
            linked={Boolean(author.id)}
          />
        }
        title={
          <ActorTitle
            actor={author}
            linked={Boolean(author.id)}
          />
        }
        subheader={
          <Link
            href={url}
            onClick={(e) => {
              return handleView(e, medium);
            }}
          >
            <ReactTimeAgo
              date={new Date(medium.creationTime)}
            />
          </Link>
        }
        action={menu}
      />
      {portrait &&
        <ButtonBase
          // href={url}
          component="a"
          style={{
            width: '100%',
            display: 'inline',
          }}
          onClick={(e) => {
            return handleView(e, medium);
          }}
        >
          <CardMedia
            className={classes.portrait}
            title={medium.name}
            image={portrait}
            src="picture"
          />
        </ButtonBase>
      }
      {medium.body &&
        <Player text={medium.body} />
      }
      <CardContent component="article">
        {medium.name &&
          <Typography
            variant="h2"
            className={classes.title}
          >
            <Link href={url}>
              {medium.name}
            </Link>
          </Typography>
        }
        {medium.body &&
          <ReadMore>
            {contentfilter({
              text: medium.body,
              filters: [
                'hashtag',
                'mention',
                'url',
              ],
            })}
          </ReadMore>
        }
      </CardContent>
      {actions &&
        <CardActions>
          {actions}
        </CardActions>
      }
    </Card>
  );
};

MediumCard.propTypes = {
  classes: PropTypes.object.isRequired,
  actions: PropTypes.node,
  menu: PropTypes.node,
  medium: MediumType.isRequired,
  handleView: PropTypes.func.isRequired,
};

MediumCard.defaultProps = {
  actions: null,
  menu: null,
};

export default withStyles(styles)(MediumCard);
