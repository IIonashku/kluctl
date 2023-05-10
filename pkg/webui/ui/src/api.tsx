import {
    CommandResult,
    CommandResultSummary,
    ObjectRef,
    ProjectKey,
    ProjectSummary,
    ResultObject,
    ShortName,
    TargetKey
} from "./models";
import _ from "lodash";
import React from "react";
import { Box, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import "./staticbuild.d.ts"
import { loadScript } from "./loadscript";

const apiUrl = "/api"

export enum ObjectType {
    Rendered = "rendered",
    Remote = "remote",
    Applied = "applied",
}

export interface Api {
    getShortNames(): Promise<ShortName[]>
    listProjects(): Promise<ProjectSummary[]>
    listResults(filterProject?: string, filterSubDir?: string): Promise<CommandResultSummary[]>
    getResult(resultId: string): Promise<CommandResult>
    getResultObject(resultId: string, ref: ObjectRef, objectType: string): Promise<any>
    validateNow(project: ProjectKey, target: TargetKey): Promise<Response>
}

class RealApi implements Api {
    async getShortNames(): Promise<ShortName[]> {
        let url = `${apiUrl}/getShortNames`
        return fetch(url)
            .then(handleErrors)
            .then((response) => response.json());
    }

    async listProjects(): Promise<ProjectSummary[]> {
        let url = `${apiUrl}/listProjects`
        return fetch(url)
            .then(handleErrors)
            .then((response) => response.json());
    }

    async listResults(filterProject?: string, filterSubDir?: string): Promise<CommandResultSummary[]> {
        let url = `${apiUrl}/listResults`
        const params = new URLSearchParams()
        if (filterProject) {
            params.set("filterProject", filterProject)
        }
        if (filterSubDir) {
            params.set("filterSubDir", filterSubDir)
        }
        url += "?" + params.toString()
        return fetch(url)
            .then(handleErrors)
            .then((response) => response.json());
    }

    async getResult(resultId: string) {
        let url = `${apiUrl}/getResult?resultId=${resultId}`
        return fetch(url)
            .then(handleErrors)
            .then(response => response.text())
            .then(json => {
                return new CommandResult(json)
            });
    }

    async getResultObject(resultId: string, ref: ObjectRef, objectType: string) {
        let url = `${apiUrl}/getResultObject?resultId=${resultId}&${buildRefParams(ref)}&objectType=${objectType}`
        return fetch(url)
            .then(handleErrors)
            .then(response => response.json());
    }

    async validateNow(project: ProjectKey, target: TargetKey) {
        const key = {
            "project": project,
            "target": target,
        }

        let url = `${apiUrl}/validateNow`
        return fetch(url, {
            method: "POST",
            body: JSON.stringify(key),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(handleErrors);
    }
}

class StaticApi implements Api {
    async getShortNames(): Promise<ShortName[]> {
        await loadScript("./shortnames.js")
        return staticShortNames
    }
    async listProjects(): Promise<ProjectSummary[]> {
        await loadScript("./projects.js")
        return staticProjects
    }
    async listResults(filterProject?: string, filterSubDir?: string): Promise<CommandResultSummary[]> {
        await loadScript("./summaries.js")
        return staticSummaries.filter(s => {
            if (filterProject && filterProject != s.project.normalizedGitUrl) {
                return false
            }
            if (filterSubDir && filterSubDir != s.project.subDir) {
                return false
            }
            return true
        })
    }
    async getResult(resultId: string): Promise<CommandResult> {
        await loadScript(`./result-${resultId}.js`)
        return staticResults.get(resultId)
    }
    async getResultObject(resultId: string, ref: ObjectRef, objectType: string): Promise<any> {
        const result = await this.getResult(resultId)
        const object = result.objects?.find(x => _.isEqual(x.ref, ref))
        if (!object) {
            throw new Error("object not found")
        }
        switch (objectType) {
            case ObjectType.Rendered:
                return object.rendered
            case ObjectType.Remote:
                return object.remote
            case ObjectType.Applied:
                return object.applied
            default:
                throw new Error("unknown object type " + objectType)
        }
    }
    validateNow(project: ProjectKey, target: TargetKey): Promise<Response> {
        throw new Error("not implemented")
    }
}

export let api: Api
if (isStaticBuild) {
    api = new StaticApi()
} else {
    api = new RealApi()
}

function handleErrors(response: Response) {
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return response
}

function buildRefParams(ref: ObjectRef): string {
    const params = new URLSearchParams()
    params.set("kind", ref.kind)
    params.set("name", ref.name)
    if (ref.group) {
        params.set("group", ref.group)
    }
    if (ref.version) {
        params.set("version", ref.version)
    }
    if (ref.namespace) {
        params.set("namespace", ref.namespace)
    }
    return params.toString()
}

export function buildRefString(ref: ObjectRef): string {
    if (ref.namespace) {
        return `${ref.namespace}/${ref.kind}/${ref.name}`
    } else {
        if (ref.name) {
            return `${ref.kind}/${ref.name}`
        } else {
            return ref.kind
        }
    }
}

export function buildRefKindElement(ref: ObjectRef, element?: React.ReactElement): React.ReactElement {
    const tooltip = <Box zIndex={1000}>
        <Typography>ApiVersion: {[ref.group, ref.version].filter(x => x).join("/")}</Typography><br/>
        <Typography>Kind: {ref.kind}</Typography>
    </Box>
    return <Tooltip title={tooltip}>
        {element ? element : <Typography>{ref.kind}</Typography>}
    </Tooltip>
}

export function buildObjectRefFromObject(obj: any): ObjectRef {
    const apiVersion: string = obj.apiVersion
    const s = apiVersion.split("/", 2)
    let ref = new ObjectRef()
    if (s.length === 1) {
        ref.version = s[0]
    } else {
        ref.group = s[0]
        ref.version = s[1]
    }
    ref.kind = obj.kind
    ref.namespace = obj.metadata.namespace
    ref.name = obj.metadata.name
    return ref
}

export function findObjectByRef(l: ResultObject[] | undefined, ref: ObjectRef, filter?: (o: ResultObject) => boolean): ResultObject | undefined {
    return l?.find(x => {
        if (filter && !filter(x)) {
            return false
        }
        return _.isEqual(x.ref, ref)
    })
}

export function usePromise<T>(p?: Promise<T>): T  {
    if (p === undefined) {
        throw new Promise<T>(() => undefined)
    }

    const promise = p as any
    if (promise.status === 'fulfilled') {
        return promise.value;
    } else if (promise.status === 'rejected') {
        throw promise.reason;
    } else if (promise.status === 'pending') {
        throw promise;
    } else {
        promise.status = 'pending';
        p.then(
            result => {
                promise.status = 'fulfilled';
                promise.value = result;
            },
            reason => {
                promise.status = 'rejected';
                promise.reason = reason;
            },
        );
        throw promise;
    }
}