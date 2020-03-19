import {Machine, assign} from 'xstate'
import {useMachine} from '@xstate/react';

import {InvokeState, ErrorState, WaitState, ThroughState} from './common'

const wait = async () => new Promise(r => setTimeout(r, 5000))

async function* gen (){
    let j = 0
    while(true){
        await wait()
        const data = []
        for (let i = 0; i < 5; i++){
            data.push(j++)
        }
        yield data.map(i => ({
            text: 'Card ' + i,
            key: i
        }))
    }
}



export const ListMachine = ({
    id = `list_${Math.random()}`,
    page = gen()
} = {}) => Machine({
    id,
    initial: 'init',
    states : {
        init: ThroughState({
            target: 'load'
        }),
        load: InvokeState({
            src: async () => await page.next(),
            target: 'process'
        }),
        process: ThroughState({
            target: 'wait',
            actions: assign({
                data: ({data, value}) => data.concat(value) 
            })
        }),
        wait: WaitState({
            on: {
                LOAD: 'load'
            }
        }),
        error: ErrorState()
    }
}).withContext({
    data: []
})

export const ListService = (options) => {
    const [state, send] = useMachine(ListMachine(options))
    const actions = {
        load: () => {
            send('LOAD')
        }
    }

    return ({state, actions})
}