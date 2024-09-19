import {Box, makeStyles, Tooltip} from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";
import React from "react";
import {color} from "../../../assets/styles/_color";
import { Pin } from "../../../assets/icons";
import Mic from "../../../assets/icons/Mic";
import Audio from "../Audio";
import Camera from "../../../assets/icons/Camera";

const useStyles = makeStyles((theme) => ({
    root: {
        boxSizing: "border-box",
        border: "2px solid black",
        background: color.white,
        position: "relative",
        display: 'flex',
        flexDirection: 'column',
        zIndex: "99999"
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
    const classes = useStyles();
    return (<Box className={classes.controls}>
        { isMuted ? 
            <Tooltip title="Partcipant is muted">
                <Box className={classes.unpin}>
                    { mediaType === 'audio' ? <Mic isMuted={true} /> : <Camera isMuted={true} /> }
                </Box>
            </Tooltip> :
            <Tooltip title="Mute Partcipant">
                 <Box onClick={(e) => toggleMute(e, id, mediaType)} className={classes.pin}>
                 { mediaType === 'audio' ? <Mic isMuted={false} /> : <Camera isMuted={false} /> }
                </Box>
            </Tooltip>}
    </Box>);
}

export default MuteParticipant;
