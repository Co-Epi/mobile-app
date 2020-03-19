import React from 'react';

import { Spinner } from 'native-base'
import { Action } from './action'

import { PassThrough, ErrorComponent, DeclarativeContainer } from './common'
import { PermissionService } from '../state/permission';

const DefaultInit = () => <Spinner />

const DefaultPrompt = ({ permission, actions: { ask } } ) => (
    <Action
        prompt={`Please grant ${permission} by pressing the button below`}
        button={`Allow ${permission}`}
        action={ask}
    />
)

const DefaultAsk = () => <Spinner />

const DefaultEval = () => <Spinner />

const DefaultGranted = ({ original }) => original

const DefaultDenied = ({ permission, actions: { settings } } ) => 
 (
    <Action
        prompt={`You will not be able to use this feature until you grant permission: ${permission}, please open your app settings to grant the permission`}
        button="Open Settings"
        action={settings}
    />
)

const DefaultSettings = ( { permission, actions: { retry } } ) => (
    <Action
        prompt={`Click Retry when you have granted the ${permission} permission`}
        button="Retry"
        action={retry}
    />
)

const DefaultError = ErrorComponent()

export const Init = PassThrough()
export const Prompt = PassThrough()
export const Ask = PassThrough()
export const Eval = PassThrough()
export const Granted = PassThrough()
export const Denied = PassThrough()
export const Settings = PassThrough()
export const _Error = PassThrough()

const components = {
    init: Init,
    prompt: Prompt,
    ask: Ask,
    eval: Eval,
    granted: Granted,
    denied: Denied,
    settings: Settings,
    error: _Error
}

const defaults = {
    init: DefaultInit,
    prompt: DefaultPrompt,
    ask: DefaultAsk,
    eval: DefaultEval,
    granted: DefaultGranted,
    denied: DefaultDenied,
    settings: DefaultSettings,
    error: DefaultError
}

export const PermissionProvider = ({children, ...props}) => (
    <DeclarativeContainer 
        service={PermissionService}
        components={components}
        defaults={defaults}
        {...props}
        >
        {children}
    </DeclarativeContainer>
)