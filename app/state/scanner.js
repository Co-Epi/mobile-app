import {Machine} from 'xstate'
import {useMachine} from '@xstate/react'

import {InitState, InvokeState, ErrorState, WaitState} from './common'


export const ScannerMachine = ({
    id = `scanner_${Math.random()}`,
    process = async (context, event) => console.log('process',context),
    post = async (context, event) => console.log('post',context),
    START = 'prompt'
} = {}) => Machine({
    id,
    initial: 'init',
    states: {
        init: InitState({
            START
        }),
        prompt: WaitState({
            on: {
                SCAN: 'scan'
            }
        }),
        scan: WaitState({
            on: {
                PROCESS: 'process'
            }
        }),
        process: InvokeState({
            id: `process_${id}`,
            target: 'post',
            src: process
        }),
        post: WaitState({
            onEntry: post,
            on: {
                '': 'init',
            }
        }),
        error: ErrorState()
    }
}).withContext({})

export const ScannerService = (options) => {
    const [state, send] = useMachine(ScannerMachine(options))
    const actions = {
        scan: () => send('SCAN'),
        process: (data) => send({
            type: 'PROCESS',
            data
        }),
        repeat: () => send('REPEAT'),
        retry: () => send('RETRY')
    }

    return ({state, actions})
}