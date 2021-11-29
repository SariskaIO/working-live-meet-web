import {Avatar, Box, makeStyles, Typography} from '@material-ui/core'
import React from 'react';
import {color} from '../../../assets/styles/_color';
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined';
import MicOffOutlinedIcon from '@material-ui/icons/MicOffOutlined';
import {useSelector} from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '24px'
    },
    title: {
        color: color.secondary,
        fontSize: '0.85rem'
    },
    localBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing(2, 0),
        color: color.secondary,
        "&>svg": {
            color: color.secondary,
        }
    },
    userBox: {
        display: 'flex',
        alignItems: 'center',
        "&>div": {
            width: '30px',
            height: '30px',
            fontSize: '1rem'
        },
        "&>p": {
            fontSize: '0.9rem',
            paddingLeft: '15px'
        }
    },
    hostBox: {		
        width: 'auto !important',		
        marginLeft: '10px'		
    }
}))

const ParticipantDetails = () => {
    const classes = useStyles();
    const conference = useSelector(state => state.conference);
    const avatarColors = useSelector(state => state.color);
    const remoteTracks = useSelector(state => state.remoteTrack);
    const localTracks = useSelector(state => state.localTrack);
    const layout = useSelector(state => state.layout);
    const localUser = conference.getLocalUser();

    return (
        <Box className={classes.root}>
            <Box className={classes.localBox}>
                <Box className={classes.userBox}>
                    <Avatar src={ localUser?.avatar ? localUser?.avatar: null}  >{localUser?.name?.slice(0, 1).toUpperCase()}</Avatar>
                    <Box className={classes.hostBox}></Box>
                    <Typography>{ localUser?.name } (You)</Typography>
                    <Typography variant="caption">{!Object.keys(layout.moderator)?.length && <b> (Host)</b>}</Typography>
                </Box>
                {localTracks.find(track=>track.isAudioTrack())?.isMuted() ? <MicOffOutlinedIcon/> : <MicNoneOutlinedIcon/> }
            </Box>
            <Box>
                {conference.getParticipantsWithoutHidden().map(participant=>
                    <Box className={classes.localBox}>
                        <Box className={classes.userBox}>
                            <Avatar src={ participant?._identity?.user?.avatar ? participant?._identity?.user?.avatar: null} style={{background: avatarColors[participant._id]}} >{participant?._identity?.user?.name.toUpperCase().slice(0, 1)}</Avatar>
                            <Box className={classes.hostBox}>		                            <Typography>{participant?._identity?.user?.name}</Typography>
                                <Typography>{participant?._identity?.user?.name}</Typography>		
                                <Typography variant="caption">{layout.moderator[participant?._identity?.user?.id] && <b> (Host)</b>}</Typography>		
                            </Box>
                        </Box>
                        {remoteTracks[participant._id]?.find(track=>track.isAudioTrack())?.isMuted() ? <MicOffOutlinedIcon/> : <MicNoneOutlinedIcon/> }
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default ParticipantDetails
