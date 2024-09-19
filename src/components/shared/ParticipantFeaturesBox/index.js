import { Box, makeStyles } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import classnames from "classnames";
import { setPinParticipant } from '../../../store/actions/layout';
import { muteParticipant } from '../../../utils';
import PinParticipant from '../PinParticipant';
import MuteParticipant from '../MuteParticipant';
import { color } from '../../../assets/styles/_color';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    zIndex: 1, 
    width: '100%'
  },
  container: {
      width: 'fit-content', 
      height: 'fit-content', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: color.lightgray1,
      padding: '0.5rem 1rem', 
      borderRadius: '1.5rem'
  }
}));

const ParticipantFeaturesBox = ({pinnedParticipant, participantDetails, isPresenter, audioTrack, videoTrack, height}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const conference = useSelector(state => state.conference);

  const toggleParticipantFeature = async(e, id, type) => {
    e.preventDefault();
    switch(type){
      case 'pin':
         dispatch(setPinParticipant(id, isPresenter));
         break;
      case 'audio':
         await muteParticipant(conference, id, type);
         break;
      case 'video':
         await muteParticipant(conference, id, type);
         break;
      default:
        return;
    }
  };

  return (
    <Box className={classnames(classes.root, { rightControls: true })} style={{
        height: `${height}px`
    }}>
          <Box className={classes.container}>
            <Box sx={{mr: 2}}>
              <MuteParticipant mediaType={'audio'} isMuted={audioTrack?.isMuted()} toggleMute={toggleParticipantFeature} id={participantDetails?.id} />
            </Box>
            <Box sx={{mr: 2}}>
              <MuteParticipant mediaType={'video'} isMuted={videoTrack?.isMuted()} toggleMute={toggleParticipantFeature} id={participantDetails?.id}/>
            </Box>
            <Box>
                <PinParticipant
                  participantId={participantDetails?.id}
                  pinnedParticipantId={pinnedParticipant.participantId}
                  togglePinParticipant={toggleParticipantFeature}
                />
            </Box>
          </Box>
        </Box> 
  )
}

export default ParticipantFeaturesBox