import { Box, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import { useHistory, useLocation} from 'react-router-dom';
import { color } from '../../assets/styles/_color';
import { useSelector} from "react-redux";
import FancyButton from '../../components/shared/FancyButton';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: color.secondaryDark,
        "& h3":{
            fontSize: '2rem',
            marginBottom: theme.spacing(4),
            [theme.breakpoints.down("sm")]: {
                fontSize: '1.5rem'
            }
            }
        },
        title: {
            color: color.white,
        },
    }))
const Leave = () => {
    const meetingTitle  = useSelector(state=>state.profile?.meetingTitle);
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const { isRemoved } = location.state || {};

    return (
        <Box className={classes.root}>
            <Typography variant="h3" className={classes.title}>{`You have ${isRemoved ? 'been removed from' : 'left'} the meeting`}</Typography>
            <Box>
            {!isRemoved ?  <FancyButton 
                    onClick={()=>history.push(`/${meetingTitle}`)}
                    buttonText = 'Rejoin'
                /> : null }
                &nbsp; &nbsp;
                <FancyButton 
                    onClick={()=>history.push(`/`)}
                    buttonText = 'Go to Home'
                />
            </Box>
        </Box>
    )
}

export default Leave
