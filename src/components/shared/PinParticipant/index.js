import {Box, makeStyles, Tooltip} from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";
import React from "react";
import {color} from "../../../assets/styles/_color";
import { Pin } from "../../../assets/icons";
import { isParticipantLocal } from "../../../utils";
import { useSelector } from "react-redux";

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
        color: "white",
        height: "24px",
        width: "24px",
    },
    unpin: {
        color: "#27CED7",
        "& svg": {
            fill: color.primaryLight,
        }
    },
    pin: {
        fill: color.white,
        "& svg": {
            fill: color.white
        }
    }
}));

const PinParticipant =  ({pinnedParticipantId, togglePinParticipant, participantId})=>{
    const classes = useStyles();
    const conference = useSelector((state) => state.conference);
    let isLocal =  isParticipantLocal(conference, participantId);
    return (<Box className={classes.controls}>
        { pinnedParticipantId === participantId ? 
            <Tooltip title={isLocal ? "unpin self" : "unpin partcipant"}>
                <Box onClick={(e)=>togglePinParticipant(e, null, 'pin')} className={classes.unpin}>
                    <Pin />
                </Box>
            </Tooltip> :
            <Tooltip title={isLocal ? "pin self" : "pin partcipant"}>
                 <Box onClick={(e)=>togglePinParticipant(e, participantId, 'pin')} className={classes.pin}>
                    <Pin />
                </Box>
            </Tooltip>}
    </Box>);
}

export default PinParticipant;
