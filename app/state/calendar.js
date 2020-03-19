
import {Machine, assign} from 'xstate'
import {useMachine} from '@xstate/react';

import {InitState, InvokeState, ErrorState, WaitState, BranchState, DoneState, ThroughState} from './common'
import * as Calendar from 'expo-calendar';
import * as SecureStore from 'expo-secure-store';

const INCEPTION = 1570257695198 // when Ryan wrote this library
const TWO_WEEKS = 1000 * 60 * 60 * 24 * 14

const makeTimes = (horizon) => ({
    pastTime : new Date(INCEPTION),
    recentTime : new Date(Date.now() - horizon),
    nowTime : new Date(),
    futureTime : new Date(Date.now() + horizon)
})

export const CalendarMachine = ({
    id = `calendar_${Math.random()}`,
    title = id,
    horizon = TWO_WEEKS,
    color = 'blue'
} = {}) => Machine({
    id,
    initial: 'init',
    states : {
        init: ThroughState({
            target: 'load'
        }),
        load: InvokeState({
            src: async () => {
                
                const id = (await SecureStore.getItemAsync(title)) 
                        || (await Calendar.createCalendarAsync({
                            title, 
                            color,
                            entityType: Calendar.EntityTypes.EVENT,
                            sourceId: (await Calendar.getCalendarsAsync())[0].source.id,
                            source: {
                                isLocalAccount: true,
                                name: title
                            },
                            name: title,
                            accessLevel: Calendar.CalendarAccessLevel.OWNER,
                            ownerAccount: title
                        }))
                await SecureStore.setItemAsync(title, id)
                return ({id})
            },
            target: 'refresh'
        }),
        refresh: InvokeState({
            src: async ({id}) => {
                const {pastTime, recentTime, nowTime, futureTime} = makeTimes(horizon)

                const past = await Calendar.getEventsAsync([id], pastTime, recentTime)
                const recent = await Calendar.getEventsAsync([id], recentTime, nowTime)
                const future = await Calendar.getEventsAsync([id], nowTime, futureTime)

                return ({past, recent, future})
            },
            target: 'display'
        }),
        display: WaitState({
            on: {
                CREATE: 'create',
                REMOVE: 'remove'
            }
        }),
        create: InvokeState({
            src: async ({id, create}) => {
                await Calendar.createEventAsync(id, create)
                return ({create : null})
            },
            target : 'refresh'
        }),
        remove: InvokeState({
            src: async ({id, remove}) => {
                await Calendar.deleteEventAsync(remove)
                return ({remove : null})
            },
            target : 'refresh'
        }),
        error: ErrorState()
    }
}).withContext({
    id
})

export const CalendarService = (options) => {
    const [state, send] = useMachine(CalendarMachine(options))
    const actions = {
        create: (create) => {
            send({
                type: 'CREATE',
                data: {create}
            })
        }
    }

    return ({state, actions})
}