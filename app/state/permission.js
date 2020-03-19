import {Machine} from 'xstate'
import {useMachine} from '@xstate/react'

import {InitState, WaitState, InvokeState, BranchState, ErrorState} from './common'
// import {applicationId} from 'expo-application'
import {Platform, Linking} from 'react-native'

// import {
//     startActivityAsync, 
//     ACTION_APPLICATION_DETAILS_SETTINGS, 
//     ACTION_APPLICATION_SETTINGS
// } from 'expo-intent-launcher';

// import * as Permissions from 'expo-permissions';

const openAppSettings = () => {
    switch (Platform.OS){
        case 'android':
            return openAppSettingsAndroid()
        case 'ios':
            return openAppSettingsIOS()
        default:
            throw new Error(`unknown os: ${osName}`)
    }
}

const openAppSettingsIOS = () => {
  // TODO
    // Linking.openURL(`app-settings:${applicationId}`)
}

const openAppSettingsAndroid = async () => {
    if (!applicationId) return startActivityAsync(ACTION_APPLICATION_SETTINGS)

    return startActivityAsync(ACTION_APPLICATION_DETAILS_SETTINGS, {
        data: `package:${applicationId}`
    })
}

export const PermissionMachine = ({
    id = `permission_${Math.random()}`,
    permission = (() => {throw new Error('must declare permission desired')})(),
    START = 'ask'
} = {}) => Machine({
    id,
    initial: 'init',
    states: {
        init: InitState({
            START
        }),
        prompt: WaitState({
            on: {
                ASK: 'ask'
            }
        }),
        ask: InvokeState({
            id: `ask_${id}`,
            target: 'eval',
            src: async () => await Permissions.askAsync(permission)
        }),
        eval: BranchState({
            conditions: {
                granted: (context) => context.status === 'granted',
                denied: (context) => context.status !== 'granted'
            }
        }),
        granted: {},
        denied: WaitState({
            on: {
                SETTINGS: 'settings'
            }
        }),
        settings: WaitState({
            onEntry : openAppSettings,
            on: {
                ASK: 'ask'
            }
        }),
        error: ErrorState()
    }
}).withContext({})

export const PermissionService = ({id, permission, START}) => {
    const [state, send] = useMachine(PermissionMachine({id, permission, START}))
    const actions = {
        ask: () => send('ASK'),
        retry: () => send('RETRY'),
        settings: () => send('SETTINGS')
    }

    return ({state, actions})
}