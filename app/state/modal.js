import {Machine} from 'xstate'
import {useMachine} from '@xstate/react';

import {InvokeState, WaitState, BranchState, ErrorState} from './common'

export const ModalMachine = ({
    id = `modal_${Math.random()}`,
    init = async () => 'show'
} = {}) => Machine({
    id,
    initial: 'init',
    states : {
        init: InvokeState({
            src: async () => ({
                init: await init()
            }),
            target: 'process'
        }),
        process : BranchState({
            conditions: {
                hide: ({init}) => init === 'hide',
                show: ({init}) => init === 'show'
            }
        }),
        hide: WaitState({
            on: {
                SHOW: 'show'
            }
        }),
        show: WaitState({
            on: {
                HIDE: 'hide'
            }
        }),
        error: ErrorState()
    }
}).withContext({
    init: 'hide'
})

export const ModalService = (options) => {
    const [state, send] = useMachine(ModalMachine(options))
    const actions = {
        show: () => send('SHOW'),
        hide: () => send('HIDE')
    }

    return ({state, actions})
}