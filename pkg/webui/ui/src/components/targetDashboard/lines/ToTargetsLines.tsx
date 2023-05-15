import { ReactElement, FC } from "react"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const widthCall = "434px"
const widthBlock = "247px"

const WrappPoint = styled("div")`
     ::before {
        content: '';
        display: block;
        position: absolute;
        top: 50%;
        left: 9px;
        transform: translate(0, -50%);
        width: 12px;
        height: 12px;
        border: 2px solid #000;
        border-radius: 100px;
        background: #fff;
        z-index: 100;
    }
`
const WrappLineTop = styled("div")`
    position: absolute;
    bottom: 50%;
    width: 100%;
    height: 50%;
`
const WrappLineBottom = styled("div")`
      position: absolute;
    top: 50%;
    width: 100%;
    height: 50%;
`
const FirstLineTop = styled("div")`
    position: absolute;
    border-bottom: 2px solid #000;
    border-right: 2px solid #000;
    border-radius: 0 0 20px  0;
    height: 23px;
    width: calc(50% - 7px);
    bottom: -1px;
    left: 9px;
`
const NextLineTop = styled("div", {shouldForwardProp: (prop) => prop !== 'topX'})<{topX: number}>`
    position: absolute;
    border-top: 2px solid #000;
    border-left: 2px solid #000; 
    /* border: 1px solid red; */
    border-radius: 20px 0 0  0;
    height: ${({topX}) => `${topX > 0 ?  topX === 1 ? '160px' : '180px' : "60px"}`};
    width: calc(50% - 7px);
    bottom: ${({topX}) => `calc(${topX + 1} * ${topX > 0 ? topX === 1 ? '30px' : '62px' : "20px"})`};
    left: 50%;
`
const FirstLineBottom = styled("div")`
    position: absolute;
    border-top: 2px solid #000;
    border-right: 2px solid #000;
    border-radius: 0 20px 0 0;
    height: 23px;
    width: calc(50% - 7px);
    top: -1px;
    left: 9px;
`
const NextLineBottom  = styled("div")`
    position: absolute;
    border-bottom: 2px solid #000;
    border-left: 2px solid #000;
    border-radius:  0 0  0 20px;
    height: 60px;
    width: calc(50% + 2px);
    top: 20px;
    left: 50%;
`
const LineCenter = styled("div")`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - 9px * 2);
    height: 2px;
    background: #000;
    ::after {
        content: '';
        display: block;
        position: absolute;
        top: -5px;
        right: 0;
        width: 12px;
        height: 12px;
        border: 2px solid #000;
        border-radius: 100px;
        background: #fff;
    }
`
export const WrapperLine: FC<{children: ReactElement}> = ({children}) => {
    return (
        <Box
            sx={{
                position:"relative",
                height: "50px",
                width: `calc(${widthCall} - ${widthBlock})`
            }}
        >{children}</Box>
    )
}
export const LineToTarget: FC<{countLines: number}> = ({countLines}) => {
    console.log("countLines", countLines, countLines % 2 == 0)
    const two = countLines % 2 != 0
    const arrFor = (countLines / 2) - 1
    const arr = Array.from({length: arrFor}, (_, index) => index + 1);
    console.log(arr, arrFor, 'arr a')
    if(countLines === 1) {
        return  <WrappPoint><LineCenter /></WrappPoint>
    }
    return (
        <WrappPoint>
        <WrappLineTop>
          <FirstLineTop />
        </WrappLineTop>
        {two && <LineCenter />}
        <WrappLineBottom>
          <FirstLineBottom />
        </WrappLineBottom>
        </WrappPoint>
    )
}