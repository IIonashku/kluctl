import Box from '@mui/material/Box';
import { SvgIcon, Typography } from "@mui/material";
import { FC, useEffect, useState } from 'react';
import { ReactComponent as TargetSvg } from './../../iconss/target/target.svg';
import { ReactComponent as Cpu } from './../../iconss/target/cpu.svg';
import { ReactComponent as Finger } from './../../iconss/target/fingerScan.svg';
import { ReactComponent as Heart } from './../../iconss/target/heart.svg';
import { ReactComponent as More } from './../../iconss/target/more.svg';
import { ReactComponent as Question } from './../../iconss/target/question.svg';
import { ProjectSummary, TargetSummary } from "../../models";
import Tooltip from '@mui/material/Tooltip';
import { Height } from '@mui/icons-material';

export const History = () => {
    return   <Box  sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: "12px 10px",
        width: "247px",
        height: "126px",
        borderRadius: "12px",
        background: "#DFEBE9",
        border: "1px solid #59A588",
        boxShadow: "4px 4px 10px #1E617A",
       
    }}>
        <Box sx={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-start"
        }}>
             <SvgIcon sx={{
                    width: "45px",
                    height: "45px",
                    mr: "15px"
            }} component={TargetSvg} inheritViewBox />
            <Box >
                {/* <Typography sx={{
                            fontWeight: 800,
                            fontSize: "20px",
                            lineHeight: "27px",
                            color: "#222222",
                            minWidth: "auto"
                            }} variant="body1">
                           {targets.target.targetName || "no-name"}
                </Typography>
                <Typography sx={{
                            fontWeight: 500,
                            fontSize: "14px",
                            lineHeight: "19px",
                            color: "#222222",
                            minWidth: "auto"
                            }} variant="body1">
                           feature-forms-12345
                </Typography> */}
            </Box>
        </Box>
        <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Box sx={{
                    display: "flex",
                }}>
                {/* <Tooltip title={"Cluster ID: " + targets.target.clusterId}>
                    <SvgIcon sx={{
                        width: "24px",
                        height: "24px",
                        mr: "4px"
                    }}
                    component={Cpu}
                    inheritViewBox />
                </Tooltip>
                <Tooltip title={"Discriminator: " + targets.target.discriminator}>
                     <SvgIcon sx={{
                        width: "24px",
                        height: "24px",
                        mr: "4px"
                   }} 
                   component={Finger} 
                   inheritViewBox />
                 </Tooltip>
                </Box>
                <Box sx={{
                    
                }}>
                    <Tooltip title={"Cluster ID: " + targets.target.clusterId}>
                    <SvgIcon sx={{
                        width: "24px",
                        height: "24px",
                        mr: "4px"
                    }}
                    component={Heart}
                    inheritViewBox />
                </Tooltip>
                <Tooltip title={"Discriminator: " + targets.target.discriminator}>
                     <SvgIcon sx={{
                        width: "24px",
                        height: "24px",
                        mr: "4px"
                   }} 
                   component={More} 
                   inheritViewBox />
                 </Tooltip> */}
                </Box> 
                   
        </Box>
    </Box>
}