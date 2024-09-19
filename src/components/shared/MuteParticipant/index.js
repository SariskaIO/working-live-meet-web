import {Box, makeStyles, Tooltip} from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";
import React from "react";
import {color} from "../../../assets/styles/_color";
import { Pin } from "../../../assets/icons";
import Mic from "../../../assets/icons/Mic";
import Audio from "../Audio";
import Camera from "../../../assets/icons/Camera";
import { useSelector } from "react-redux";
import StyledTooltip from "../StyledTooltip";
import { isParticipantLocal } from "../../../utils";

const useStyles = makeStyles((theme) => ({
    root: {
        boxSizing: "border-box",
        border: "2px solid black",
        background: color.white,
        position: "relative",
        display: 'flex',
        flexDirection: 'column',
        zIndex: 11
    },
    controls: {
        cursor: "pointer",
        color: "#aaa",
        height: "24px",
        width: "24px",
    },
    unpin: {
        fill: "#27CED7",
        "& svg": {
            fill: color.white,
        }
    },
    pin: {
        fill: color.white,
        "& svg": {
            fill: color.white
        }
    }
}));

const MuteParticipant =  ({mediaType, isMuted, toggleMute, id})=>{
    const conference = useSelector((state) => state.conference);
    const classes = useStyles();
    let isLocal =  isParticipantLocal(conference, id);

    const handleMute = (e, id, mediaType) => {
        e.preventDefault();
        if(isLocal){
            return;
        }else{
            toggleMute(e, id, mediaType)
        }
    }

    return (<Box className={classes.controls} >
        { isMuted ? 
            <StyledTooltip title={`${mediaType} is muted`} disabled={conference?.isModerator() ? isLocal : true}>
                <Box className={classes.unpin}>
                    { mediaType === 'audio' ? <Mic isMuted={true} /> : <Camera isMuted={true} /> }
                </Box>
            </StyledTooltip> :
            <StyledTooltip title={`mute ${mediaType}`} disabled={conference?.isModerator() ? isLocal : true}>
                 <Box onClick={(e) => {handleMute(e, id, mediaType)}} className={classes.pin}>
                 { mediaType === 'audio' ? <Mic isMuted={false} /> : <Camera isMuted={false} /> }
                </Box>
            </StyledTooltip>}
    </Box>);
}

export default MuteParticipant;
