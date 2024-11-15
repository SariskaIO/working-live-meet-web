import {
  Box,
  makeStyles,
  Typography,
  Tooltip,
  Button,
} from "@material-ui/core";
import React, { useState, useEffect, useRef } from "react";
import { color } from "../../../assets/styles/_color";
import MeetingSVG from "../../../assets/svg/undraw_meeting_re_i53h.svg";
import FancyButton from "../FancyButton";
import Video from "../Video";
import Audio from "../Audio";
import PanTool from "@material-ui/icons/PanTool";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import {
  calculateSteamHeightAndExtraDiff,
  isMobileOrTab,
  startPipMode,
  exitPipMode,
} from "../../../utils";
import SubTitle from "../SubTitle";
import { useDocumentSize } from "../../../hooks/useDocumentSize";
import ParticipantFeaturesBox from "../ParticipantFeaturesBox";
import MutedVideo from "../MutedVideo";
import StyledTooltip from "../../shared/StyledTooltip";
import AudioLevelIndicator from "../AudioIndicator";
import { layout } from "../../../store/reducers/layout";

const VideoBox = ({
  participantTracks,
  participantDetails,
  localUserId,
  width,
  height,
  isPresenter,
  isActiveSpeaker,
  isFilmstrip,
  isLargeVideo,
  isTranscription,
  numParticipants,
}) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "8px",
      background: color.secondary,
      display: "flex",
      flexDirection: "column",
      transform: "translateZ(0)",
      "& .largeVideo": {
        height: theme.spacing(20),
        width: theme.spacing(20),
        fontSize: "40pt",
      },
      [theme.breakpoints.down("sm")]: {
        background: numParticipants > 1 ? color.secondary : "transparent",
      },
    },
    audioBox: {
      background: numParticipants > 1 ? color.secondary : "transparent",
      position: "absolute",
      top: 0,
      zIndex: 1,
      display: "flex",
      justifyContent: "flex-end",
      padding: theme.spacing(1),
      color: color.white,
      "& svg": {
        background: color.secondary,
        borderRadius: "50%",
        padding: "5px",
        [theme.breakpoints.down("sm")]: {
          background: numParticipants > 1 ? color.secondary : "transparent",
        },
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.25, 1, 1, 0.25),
      },
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
      right: 0,
      padding: "8px",
    },
    videoBorder: {
      boxSizing: "border-box",
      border: `3px solid ${color.primaryLight}`,
      borderRadius: "8px",
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: "9",
    },
    textBox: {
      bottom: 0,
      display: "flex",
      justifyContent: "flex-start",
      padding: theme.spacing(1),
      color: color.white,
      background: "transparent",
      position: "absolute",
      "& p": {
        padding: "2px 4px",
      },
    },
    avatarBox: {
      height: "100%",
      width: "100%",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
    },
    avatar: {
      borderRadius: "50%",
      position: "absolute",
      transition: "box-shadow 0.3s ease",
      height: numParticipants === 1 ? theme.spacing(20) : theme.spacing(10),
      width: numParticipants === 1 ? theme.spacing(20) : theme.spacing(10),
      fontSize: numParticipants === 1 && "40pt",
    },
    rightControls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      padding: theme.spacing(1),
      right: 0,
      zIndex: "9999",
    },
    handRaise: {
      marginLeft: "8px",
      color: color.primary,
      lineHeight: "0!important",
    },
    disable: {
      background: color.red,
      borderColor: `${color.red} !important`,
      "&:hover": {
        opacity: "0.8",
        background: `${color.red} !important`,
      },
    },
    subtitle: {
      position: "absolute",
      bottom: 0,
    },

    videoWrapper: {
      position: "absolute",
      right: 0,
      left: 0,
      top: 0,
      bottom: 0,
      margin: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      color: "#B8B8B8",
      textAlign: "center",
      padding: theme.spacing(4),
    },
    iconContainer: {
      marginBottom: theme.spacing(2),
      "& svg": {
        width: 100,
        height: 100,
        color: "#636363",
      },
    },
    button: {
      marginTop: theme.spacing(2),
      backgroundColor: "#1a73e8",
      color: "white",
      "&:hover": {
        backgroundColor: "#1765d1",
      },
      // ...customStyles,
    },
    buttonStyle: {
      color: color.white,
      textDecoration: "none",
      border: `1px solid ${color.primaryLight}`,
      padding: "4px 40px",
      borderRadius: "10px",
      textTransform: "capitalize",
      marginTop: theme.spacing(3),
      width: "251px", // Set your width here
      transition: "0.1s all ease",
      fontSize: "15px", // Customize font size here
      "&:hover": {
        background: color.mainGradient,
        color: color.white,
        border: "1px solid transparent",
      },
      "&:active": {
        background: color.mainGradient,
        color: color.white,
        border: `1px solid ${color.primaryLight}`,
      },
      "&:focus": {
        background: color.mainGradient,
        color: color.white,
        border: `1px solid ${color.primaryLight}`,
      },
      "&.MuiButton-root.Mui-disabled": {
        color: color.white,
        border: `1px solid ${color.primaryLight}`,
      },
    },
  }));
  const classes = useStyles();
  const isPipEnabled = useSelector((state) => state.layout?.pipEnabled);
  const { pinnedParticipant, raisedHandParticipantIds } = useSelector(
    (state) => state.layout
  );
  const [buttonText, setButtonText] = useState();
  const [isCollaborationActive, setIsCollaborationActive] = useState(false);
  const remoteTrack = useSelector((state) => state.remoteTrack);
  const remoteTracks = remoteTrack[Object.keys(remoteTrack)[0]];
  const remoteVideoTrack = remoteTracks?.find(
    (track) => track.getType() === "video"
  );
  let videoTrack = isPresenter
    ? participantTracks?.find((track) => track?.getVideoType() === "desktop")
    : participantTracks?.find((track) => track?.getType() === "video");
  if (isLargeVideo && pinnedParticipant.isPresenter === false) {
    videoTrack = participantTracks?.find(
      (track) => track.getType() === "video"
    );
  }
  const audioTrack = participantTracks?.find((track) => track?.isAudioTrack());
  const [visibleParticipantFeatures, setVisibleParticipantFeatures] =
    useState(false);
  const subtitle = useSelector((state) => state.subtitle);
  const conference = useSelector((state) => state.conference);
  const { documentWidth, documentHeight } = useDocumentSize();

  const avatarActiveClasses = classnames(classes.avatarBox);
  const { videoStreamHeight, videoStreamDiff } =
    calculateSteamHeightAndExtraDiff(
      width,
      height,
      documentWidth,
      documentHeight,
      isPresenter,
      isActiveSpeaker
    );

  const getVideoContainerWidth = (videoStreamHeight) => {
    if (isMobileOrTab()) {
      if (isPresenter) return "100%";
    }
    return `${(videoStreamHeight * 16) / 9}px`;
  };
  return (
    <Box
      style={{ width: `${width}px`, height: `${height}px` }}
      onMouseEnter={() => setVisibleParticipantFeatures(true)}
      onMouseLeave={() => setVisibleParticipantFeatures(false)}
      className={classes.root}
    >
      {conference?.getParticipantCount() > 1 &&
        isActiveSpeaker &&
        !isPresenter && <div className={classes.videoBorder}></div>}
      <Box className={classnames(classes.audioBox, { audioBox: true })}>
        {!audioTrack?.isLocal() && <Audio track={audioTrack} />}
      </Box>
      {visibleParticipantFeatures ? (
        <ParticipantFeaturesBox
          pinnedParticipant={pinnedParticipant}
          participantDetails={participantDetails}
          isPresenter={isPresenter}
          audioTrack={audioTrack}
          videoTrack={videoTrack}
          height={height}
        />
      ) : null}
      {videoTrack?.isMuted() ? (
        <Box className={avatarActiveClasses}>
          <MutedVideo
            isFilmstrip={isFilmstrip}
            participantDetails={participantDetails}
            numParticipants={numParticipants}
            isLargeVideo={isLargeVideo}
          />
        </Box>
      ) : isPipEnabled ? (
        <Box
          style={{
            width: getVideoContainerWidth(videoStreamHeight),
            height: `${videoStreamHeight}px`,
            left: `-${videoStreamDiff / 2}px`,
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: "black",
            margin: "auto",
            padding: "16px",
            title: "none",
          }}
          className={classes.videoWrapper}
        >
          <div
            className={classes.iconContainer}
            style={{ marginBottom: "12px" }}
          >
            <img
              src={MeetingSVG}
              alt="Meeting illustration"
              style={{
                width: "300px",
                height: "300px",
                marginBottom: "-50px",
                marginTop: "-80px",
              }}
            />
          </div>

          <Typography variant="h5" style={{ marginBottom: "8px" }}>
            Your Meet call is in another window
          </Typography>

          <Typography variant="body5">
            Using picture-in-picture lets you stay in the call while you do
            other things
          </Typography>

          <StyledTooltip>
            <Button
              style={{ zIndex: 100 }}
              className={classes.buttonStyle}
              onClick={() => {
                console.log("isPipEnabled value:", isPipEnabled);
                exitPipMode();
              }}
            >
              Bring the call back here
            </Button>
          </StyledTooltip>
          <Video
            isPresenter={isPresenter}
            isPipEnabled={isPipEnabled}
            track={isPipEnabled ? null : videoTrack}
          />
        </Box>
      ) : (
        <Box
          style={{
            width: getVideoContainerWidth(videoStreamHeight),
            height: `${videoStreamHeight}px`,
            left: `-${videoStreamDiff / 2}px`,
            position: "absolute",
          }}
          className={classes.videoWrapper}
        >
          <Video
            isPresenter={isPresenter}
            isPipEnabled={isPipEnabled}
            track={videoTrack}
          />
        </Box>
      )}
      <Box
        className={classnames(classes.rightControls, { rightControls: true })}
      >
        {raisedHandParticipantIds[participantDetails?.id] && (
          <Typography className={classes.handRaise}>
            <PanTool />
          </Typography>
        )}
      </Box>
      <Box className={classnames(classes.textBox, { userDetails: true })}>
        <Typography>
          {localUserId === participantDetails?.id
            ? "You"
            : participantDetails?.name}
        </Typography>
      </Box>
      {!isFilmstrip && (
        <Box>
          <AudioLevelIndicator participantDetails={participantDetails} />
        </Box>
      )}
      {isTranscription && subtitle.text && (
        <Box className={classes.subtitle}>
          <SubTitle subtitle={subtitle} />
        </Box>
      )}
    </Box>
  );
};

export default VideoBox;
