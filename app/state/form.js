import React from 'react'

import { Machine, assign } from 'xstate'
import { useMachine } from '@xstate/react';

import { InvokeState, ErrorState, WaitState, ThroughState } from './common'

const wait = async () => new Promise(r => setTimeout(r, 5000))


export const FormMachine = ({
    id = `swiper_${Math.random()}`,
    load = async () => ({}),
    submit = async (args) => {
        console.log('submit',args)
        await wait()
        return ({})
    },
    submit_done = async () => {
        return console.log('submit_done') || ({})
    },
    submitLabel = 'Save'
} = {}) => Machine({
    id,
    initial: 'init',
    states: {
        init: ThroughState({
            target: 'load'
        }),
        load: InvokeState({
            src: async () => ({data: (await load())}),
            target: 'input'
        }),
        input: WaitState({
            on: {
                CHANGE: 'change',
                SUBMIT: 'submit'
            },
            actions: assign({
                data: (context, { data }) => ({
                    ...context.data,
                    ...data
                })
            })
        }),
        change: ThroughState({
            target: 'input'
        }),
        submit: InvokeState({
            src: async (context, data) => {
                console.log('invoke submit', context,data)
                return submit(context)
            },
            target: 'submit_done'
        }),
        submit_done: InvokeState({
            src: submit_done,
            target: 'init'
        }),
        error: ErrorState()
    }
}).withContext({
    data: {},
    submitLabel
})

export const FormService = (options) => {
    const [state, send] = useMachine(FormMachine(options))
    const actions = {
        change: (data) => {
            send({
                type: 'CHANGE',
                data
            })
        },
        submit: () => send('SUBMIT')
    }

    return ({ state, actions })
}