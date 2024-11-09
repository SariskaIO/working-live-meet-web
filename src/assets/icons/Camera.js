import React from 'react';
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";

const Camera = ({isMuted}) => {
  return (
    <>
        {
            isMuted ? 
                < VideocamOffIcon />
            :
                <VideocamIcon />
        }
    </>
  )
}

export default Camera