import {Avatar, Box, makeStyles, Tooltip, Typography} from '@material-ui/core'
import React, {useState} from 'react';
import {color} from '../../../assets/styles/_color';
import Video from "../Video";
import Audio from "../Audio";
import PanTool from "@material-ui/icons/PanTool";
import MicOffIcon from "@material-ui/icons/MicOff";
import MicIcon from "@material-ui/icons/Mic";
import {useDispatch, useSelector} from "react-redux";
import {setPinParticipant} from "../../../store/actions/layout";
import PinParticipant from "../PinParticipant";
import classnames from "classnames";
import {videoShadow} from "../../../utils";
import AudioLevelIndicator from "../AudioIndicator";
import ConnectionIndicator from "../ConnectionIndicator";
import SubTitle from "../SubTitle";

const useStyles = makeStyles((theme) => ({
    root: {
        background: color.secondary,
        position: "relative",
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '5px',
        "& .largeVideo": {
            height: theme.spacing(20),
            width: theme.spacing(20),
            fontSize: "40pt"
        },
        "& .gridSeparator": {
            boxSizing: "border-box",
            border: "2px solid black"
        },
        "& .activeSpeaker": {
            boxSizing: "border-box",
            border: "2px solid #44A5FF"
        }
    },
    audioBox: {
        background: "transparent",
        position: "absolute",
        top: 0,
        display: 'flex',
        justifyContent: 'flex-end',
        padding: theme.spacing(1),
        color: color.white,
        "& svg": {
            background: color.secondaryDark,
            borderRadius: '50%',
            padding: "5px"
        }
    },
    controls: {
        cursor: "pointer",
        color: "white",
        height: "20px",
        width: "20px",
        position: "absolute",
        margin: "auto",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    textBox: {
        bottom: 0,
        display: 'flex',
        justifyContent: 'flex-start',
        padding: theme.spacing(1),
        color: color.white,
        background: "transparent",
        position: "absolute",
        "& p": {
            padding: '2px 4px'
        }
    },
    avatarBox: {
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        borderRadius: '5px',
    },
    avatar: {
        borderRadius: "50%",
        position: "absolute",
        transition: "box-shadow 0.3s ease",
        height: theme.spacing(10),
        width: theme.spacing(10),
    },
    rightControls: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        padding: theme.spacing(1),
        right: 0
    },
    handRaise: {
        marginLeft: "8px",
        color: color.primary,
        lineHeight: "0!important"
    },
    disable: {
        background: color.red,
        borderColor: `${color.red} !important`,
        "&:hover": {
            opacity: "0.8",
            background: `${color.red} !important`,
        }
    },
    subtitle: {
        position: "absolute",
        bottom: 0
    }
}));

const VideoBox = ({
                    participantTracks,
                    participantDetails,
                    localUserId,
                    width,
                    height,
                    isPresenter,
                    isBorderSeparator,
                    isActiveSpeaker,
                    isFilmstrip,
                    isLargeVideo,
                    isTranscription,
                    videoWidth,
                    videoHeight
                  }) => {
    const classes = useStyles();
    const videoTrack = isPresenter ? participantTracks.find(track => track.getVideoType() === "desktop") : participantTracks.find(track => track.getType()==="video");
    const audioTrack = participantTracks.find(track => track.isAudioTrack());
    const { pinnedParticipantId, raisedHandParticipantIds } = useSelector(state => state.layout);
    const avatarColors = useSelector(state => state.color);
    const audioIndicator = useSelector(state => state.audioIndicator);
    const dispatch = useDispatch();
    const [visiblePinParticipant, setVisiblePinPartcipant] = useState(true);
    let avatarColor = avatarColors[participantDetails?.id];
    let audioLevel = audioIndicator[participantDetails?.id];
    const subtitle  = useSelector(state=>state.subtitle);
    const conference = useSelector(state => state.conference);

    const togglePinParticipant = (id) => {
        dispatch(setPinParticipant(id));
    }

    const borderActiveClasses = classnames({
        'gridSeparator': isBorderSeparator,
        'activeSpeaker': conference.getParticipantCount()>1 && isActiveSpeaker
    });

    const audioIndicatorActiveClasses = classnames(classes.avatar, {
        'largeVideo': isLargeVideo,
    });

    const avatarActiveClasses = classnames(classes.avatarBox, {
        'gridSeparator': isBorderSeparator,
        'activeSpeaker': conference.getParticipantCount()>1 && isActiveSpeaker
    });
    
    return (
        <Box style={{width: `${width}px`, height: `${height}px`}}
             onMouseEnter={() => setVisiblePinPartcipant(true)}
             onMouseLeave={() => setVisiblePinPartcipant(false)} 
             className={classes.root}>
            <Box className={classes.audioBox}>
                { audioTrack?.isMuted() ? <span
              className="material-icons material-icons-outlined"
            >
              mic_off
            </span> : <span
              className="material-icons material-icons-outlined"
            >
              mic_none
            </span>
            }
                { !audioTrack?.isLocal() && <Audio track={audioTrack}/> }
            </Box>
            {
                videoTrack?.isMuted() ? 
                    <Box className={avatarActiveClasses}>
                        <Avatar
                            src={participantDetails?.avatar ? participantDetails?.avatar: null }
                            style={isFilmstrip ? { boxShadow: videoShadow(audioLevel), background: avatarColor } : {background: avatarColor}}
                            className={audioIndicatorActiveClasses}>
                            {participantDetails?.name.slice(0, 1).toUpperCase()}
                        </Avatar>
                    </Box>
                    :
                    <Box style={{width: `${width}px`, height: `${height}px`, borderRadius: '5px', overflow: "hidden"}} className={borderActiveClasses}>
                        <Video isPresenter={isPresenter} width={ isPresenter ? "100%" : videoWidth } height={ isPresenter ? "100%": videoHeight } track={videoTrack} borderRadius = "5px" />
                    </Box>
            }
            <Box className={classes.rightControls}>
                {visiblePinParticipant && 
                <>
                    <PinParticipant participantId={participantDetails?.id} pinnedParticipantId={pinnedParticipantId} togglePinParticipant={togglePinParticipant}/>
                    {/* <ConnectionIndicator participantId={participantDetails?.id} /> */}
                </>
                }
                {raisedHandParticipantIds[participantDetails?.id] &&
                    <Typography className={classes.handRaise} ><PanTool /></Typography>
                }
            </Box>
            <Box className={classes.textBox}>
                <Typography>{localUserId === participantDetails?.id ? "You" : participantDetails?.name}</Typography>
            </Box>
            {!isFilmstrip && <Box>
                <AudioLevelIndicator passedAudioLevel={audioLevel}/>
            </Box>}
            {isTranscription && subtitle.text && <Box className={classes.subtitle}>
                <SubTitle subtitle={subtitle} />
            </Box>}
        </Box>)
}

export default VideoBox;
