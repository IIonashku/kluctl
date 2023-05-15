

import { SvgIcon, Typography } from "@mui/material";
import Box from '@mui/material/Box';
import {  ProjectSummary } from "../../models";
import Divider from '@mui/material/Divider';
import { api } from "../../api";
import { BlockTargets } from "./BlockTarget"
import { useLoaderData } from "react-router-dom";
import { ReactComponent as Project } from './../../iconss/target/project.svg';
import { WrapperLine, LineToTarget } from './lines/ToTargetsLines'
import { History } from "./History"


const widthCall = "434px"
const widthBlock = "247px"

const a = [1,2,3,4,5]
export async function projectsLoader() {
    const projects = await api.listProjects()
    return projects
}
export const Target = () => {

     const projects = useLoaderData() as ProjectSummary[];
     console.log("projects 2", projects)
    return (
        <Box sx={{
            width: "100%",
            padding: "0 30px",
            margin: 0,
        }}>
             <Divider sx={{ background: "#39403E", height: '0.5px'}}/>
            <Box sx={{
                display: "flex"
            }}>
            {
                ["Projects", "Targets", "History"].map((el, idx, arr)=>{
                    return (
                        <Box key={idx} sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "22px 0",
                            width: widthCall
                        }}>
                        <Typography sx={{
                            fontWeight: 700,
                            fontSize: "20px",
                            lineHeight: "27px",
                            color: "#222222",
                            minWidth: "auto",
                            pl: idx === 0 ? "0" : "15px"
                         }} variant="body1">
                            {el}
                        </Typography>
                          <Divider orientation="vertical"  sx={{ display: arr.length === ++idx ? "none" : "block",  background: "#39403E", width: '0.5px', height: "41px"}}/>
                        </Box>
                    )
                })
            }
           </Box>
            <Divider sx={{ background: "#39403E", height: '0.5px'}}/>
           {/* line project */}
                {
                    projects.map(({project, targets}, idx)=>{
                        return (
                            <>
                          <Box key={idx} sx={{display: "flex", p: "35px 0", alignItems: "center"}}>
                              <Box sx={{
                                   width: widthCall,
                                   display:"flex",
                                   alignItems: "center"
                                }}>
                                <Box sx={{
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    p: "20px 15px",
                                    width: widthBlock,
                                    borderRadius: "12px",
                                    background: "#DFEBE9",
                                    border: "1px solid #59A588",
                                    boxShadow: "4px 4px 10px #1E617A",
                                }}>
                                    <SvgIcon sx={{
                                        width: "50px",
                                        height: "50px",
                                        mr: "15px"
                                    }} component={Project} inheritViewBox />
                                    <Typography sx={{
                                        fontWeight: 800,
                                        fontSize: "20px",
                                        lineHeight: "27px",
                                        color: "#222222",
                                        minWidth: "auto"
                                    }} variant="body1">
                                            {project.subDir}
                                    </Typography>
                                </Box>
                                    <WrapperLine>
                                         <LineToTarget countLines={targets.length}/>
                                    </WrapperLine> 
                                </Box>
                              
                                <Box sx={{
                                   width: widthCall,
                                   display: "flex",
                                   flexDirection: "column",
                                   gridGap: "20px",
                                }}>
                                    {
                                        targets.map((data, idx)=>{
                                            const two = targets.length % 2 != 0
                                            
                                            return (
                                                <>
                                                <BlockTargets 
                                                    idx={idx}
                                                    targets={data} 
                                                    length={targets.length} 
                                                    two={two}
                                                    iconName="target" 
                                                />
                                                </>
                                            )
                                        })
                                    }
                                 
                                </Box>
                                <Box sx={{
                                   width: "auto",
                                   display: "flex",
                                   flexDirection: "column",
                                   gridGap: "20px",
                                }}>
                                    {targets.map((ts, i) => {
                                        return <Box key={i} display={"flex"} height={"auto"} >
                                            {ts.commandResults?.map((rs, i) => {
                                                return <Box key={i} height={"100%"} paddingX={1}>
                                                    <History />
                                                    {/* <CommandResultItem ps={ps} ts={ts} rs={rs}
                                                                    onSelectCommandResult={(rs) => doSetSelectedCommandResult(rs)}/> */}
                                                </Box>
                                          })}
                            </Box>
                        })}
                    </Box>
                        </Box>
                        <Divider sx={{ background: "#39403E", height: '0.5px'}}/>
                        </>
                        )
                    })
                }
        </Box>
    )
} 