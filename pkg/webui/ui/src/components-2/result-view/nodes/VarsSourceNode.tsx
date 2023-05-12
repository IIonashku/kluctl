import { VarsSource } from "../../../models";
import { NodeData } from "./NodeData";
import React from "react";
import { Category, Cloud, Dvr, Http, Lock, Settings, Source } from "@mui/icons-material";
import { GitIcon } from "../../../icons/GitIcon";
import { PropertiesTable } from "../../PropertiesTable";
import { CodeViewer } from "../../CodeViewer";
import { Box } from "@mui/material";
import { CommandResultProps } from "../CommandResultView";

import * as yaml from 'js-yaml';
import { SidePanelTab } from "../SidePanel";

interface VarsSourceHandler {
    type: string
    label: () => React.ReactNode
    icon: () => React.ReactNode
    sourceProps: () => {name: string, value: React.ReactNode}[]
}

export class VarsSourceNodeData extends NodeData {
    varsSource: VarsSource

    labelsYaml?: string
    renderedVarsYaml: string

    constructor(props: CommandResultProps, id: string, varsSource: VarsSource) {
        super(props, id, false, false);
        this.varsSource = varsSource

        let labels = this.varsSource.clusterConfigMap?.labels
        if (!labels) {
            labels = this.varsSource.clusterSecret?.labels
        }
        if (labels) {
            this.labelsYaml = yaml.dump(labels)
        }

        this.renderedVarsYaml = yaml.dump(this.varsSource.renderedVars)
    }

    getVarsSourceHandler(): VarsSourceHandler {
        if (this.varsSource.values) {
            return {
                type: "values",
                label: () => {
                    return "values: " + Object.keys(this.varsSource.renderedVars).length
                },
                icon: () => <Category fontSize={"large"}/>,
                sourceProps: () => []
            }
        } else if (this.varsSource.file) {
            return {
                type: "file",
                label: () => {
                    return this.varsSource.file
                },
                icon: () => <Source fontSize={"large"}/>,
                sourceProps: () => [
                    {name: "File", value: this.varsSource.file}
                ]
            }
        } else if (this.varsSource.git) {
            return {
                type: "git",
                label: () => {
                    const s = this.varsSource.git!.url.split("/")
                    const name = s[s.length-1]
                    return <>
                        {name}<br/>
                        {this.varsSource.git!.path}
                    </>
                },
                icon: () => <GitIcon/>,
                sourceProps: () => {
                    const sourceProps = []
                    sourceProps.push({name: "Url", value: this.varsSource.git!.url})
                    sourceProps.push({name: "Path", value: this.varsSource.git!.path})
                    let ref = "HEAD"
                    if (this.varsSource.git!.ref) {
                        ref = this.varsSource.git!.ref!
                    }
                    sourceProps.push({name: "Ref", value: ref})
                    return sourceProps
                }
            }
        } else if (this.varsSource.clusterConfigMap || this.varsSource.clusterSecret) {
            const vs = (this.varsSource.clusterConfigMap ? this.varsSource.clusterConfigMap : this.varsSource.clusterSecret)!
            const type = this.varsSource.clusterConfigMap ? "cm" : "secret"
            const icon = this.varsSource.clusterConfigMap ? <Settings fontSize={"large"}/> : <Lock fontSize={"large"}/>
            return {
                type: type,
                label: () => {
                    return this.varsSource.clusterConfigMap?.name!
                },
                icon: () => icon,
                sourceProps: () => {
                    const sourceProps = []
                    sourceProps.push({name: "Name", value: vs.name})
                    sourceProps.push({name: "Namespace", value: vs.namespace})
                    sourceProps.push({name: "Key", value: vs.key})
                    if (vs.labels) {
                        sourceProps.push({name: "Labels", value: <CodeViewer code={this.labelsYaml!} language={"yaml"}/>})
                    }
                    return sourceProps
                }
            }
        } else if (this.varsSource.systemEnvVars) {
            return {
                type: "systemEnvVar",
                label: () => {
                    return "systemEnvVars"
                },
                icon: () => <Dvr fontSize={"large"}/>,
                sourceProps: () => {
                    // TODO
                    return []
                }
            }
        } else if (this.varsSource.http) {
            return {
                type: "http",
                label: () => {
                    return this.varsSource.http!.url
                },
                icon: () => <Http fontSize={"large"}/>,
                sourceProps: () => {
                    const sourceProps = []
                    sourceProps.push({name: "Url", value: this.varsSource.http!.url})
                    sourceProps.push({name: "Method", value: this.varsSource.http!.method || "GET"})
                    if (this.varsSource.http!.jsonPath) {
                        sourceProps.push({name: "JsonPath", value: this.varsSource.http!.jsonPath})
                    }
                    return sourceProps
                }
            }
        } else if (this.varsSource.awsSecretsManager) {
            return {
                type: "awsSecretsManager",
                label: () => {
                    return this.varsSource.awsSecretsManager!.secretName
                },
                icon: () => <Cloud fontSize={"large"}/>,
                sourceProps: () => {
                    const sourceProps = []
                    sourceProps.push({name: "SecretName", value: this.varsSource.awsSecretsManager!.secretName})
                    if (this.varsSource.awsSecretsManager!.region) {
                        sourceProps.push({ name: "Region", value: this.varsSource.awsSecretsManager!.region })
                    }
                    if (this.varsSource.awsSecretsManager!.profile) {
                        sourceProps.push({ name: "Profile", value: this.varsSource.awsSecretsManager!.profile })
                    }
                    return sourceProps
                }
            }
        } else if (this.varsSource.vault) {
            return {
                type: "vault",
                label: () => {
                    return <>
                        {this.varsSource.vault!.address}<br/>
                        {this.varsSource.vault!.path}
                    </>
                },
                icon: () => <Cloud fontSize={"large"}/>,
                sourceProps: () => {
                    const sourceProps = []
                    sourceProps.push({name: "Address", value: this.varsSource.vault!.address})
                    sourceProps.push({name: "Path", value: this.varsSource.vault!.path})
                    return sourceProps
                }
            }
        } else {
            return {
                type: "unknown",
                label: () => {
                    return "values: " + Object.keys(this.varsSource.renderedVars).length
                },
                icon: () => <Category fontSize={"large"}/>,
                sourceProps: () => []
            }
        }
    }

    buildSidePanelTitle(): React.ReactNode {
        return this.getVarsSourceHandler().label()
    }

    buildIcon(): [React.ReactNode, string] {
        const h = this.getVarsSourceHandler()
        return [h.icon(), h.type]
    }

    buildSidePanelTabs(): SidePanelTab[] {
        const tabs = [
            {label: "Summary", content: this.buildSummaryPage()},
            {label: "Vars", content: this.buildVarsPage()}
        ]
        this.buildDiffAndHealthPages(tabs)
        return tabs
    }

    buildSummaryPage(): React.ReactNode {
        const h = this.getVarsSourceHandler()

        const props = [
            {name: "Type", value: h.type},
            ...h.sourceProps(),
            {name: "IgnoreMissing", value: (!!this.varsSource.ignoreMissing) + ""},
            {name: "NoOverride", value: (!!this.varsSource.noOverride) + ""},
        ]

        if (this.varsSource.when) {
            props.push({name: "When", value: this.varsSource.when})
        }

        return <>
            <PropertiesTable properties={props}/>
        </>
    }

    buildVarsPage(): React.ReactNode {
        return <Box sx={{
            overflowY: 'scroll', // Enable vertical scrolling
            //maxHeight: '400px', // Set a fixed height
            border: '1px solid #ccc', // Optional border
            padding: '10px', // Optional padding
        }}>
            <pre>
                <CodeViewer code={this.renderedVarsYaml} language={"yaml"}/>
            </pre>
        </Box>
    }
}
