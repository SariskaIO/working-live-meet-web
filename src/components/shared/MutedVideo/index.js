import { Avatar, makeStyles } from '@material-ui/core'
import React from 'react'
import classnames from 'classnames';
import { profile } from '../../../store/reducers/profile';
import { videoShadow } from '../../../utils';
import { useSelector } from 'react-redux';


const MutedVideo = ({isFilmstrip, participantDetails, numParticipants, isLargeVideo}) => {
    const useStyles = makeStyles((theme) => ({
        avatar: {
            borderRadius: "50%",
            position: "absolute",
            transition: "box-shadow 0.3s ease",
            height: numParticipants === 1 ? theme.spacing(20) : theme.spacing(10),
            width: numParticipants === 1 ? theme.spacing(20) :theme.spacing(10),
            fontSize: numParticipants ===1 && '40pt'
          }
    }))
    
    const classes = useStyles();
    const audioIndicator = useSelector((state) => state.audioIndicator);
    let audioLevel = audioIndicator[participantDetails?.id];
    let avatarColor = participantDetails?.avatar || profile?.color;

  const audioIndicatorActiveClasses = classnames(classes.avatar, {
    largeVideo: isLargeVideo,
  });

  return (
    <Avatar
            src={null}
            style={
              isFilmstrip
                ? {
                    boxShadow: videoShadow(audioLevel),
                    background: avatarColor,
                  }
                : { background: avatarColor }
            }
            className={audioIndicatorActiveClasses}
          >
            {participantDetails?.name?.slice(0, 1)?.toUpperCase()}
          </Avatar>
  )
}

export default MutedVideo