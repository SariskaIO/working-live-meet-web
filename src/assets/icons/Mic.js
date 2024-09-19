import React from 'react';
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";

const Mic = ({isMuted}) => {
  return (
    <>
        {
            isMuted ? 
                < MicOffIcon />
            :
                <MicIcon />
        }
    </>
  )
}

export default Mic