import React from 'react';

import { Spinner } from 'native-base'
import { StyleSheet } from 'react-native';


import { Action } from './action'
import { PassThrough, Parent, ErrorComponent, DeclarativeContainer } from './common'
import { ScannerService } from '../state/scanner';
import { BarCodeScanner } from 'expo-barcode-scanner'
import { PermissionProvider, Granted as PermissionGranted } from './permission'
import { CAMERA } from 'expo-permissions'

const DefaultInit = () => <Spinner />

const DefaultPrompt = ( { actions: { scan } } ) => (
    <Action
        prompt={`Press the button below to scan a barcode`}
        button="Scan"
        action={scan}
    />
)

const DefaultScan = ( { actions: { process } } ) => (
    <BarCodeScanner
        onBarCodeScanned={process}
        style={StyleSheet.absoluteFillObject}
    />
)

const DefaultProcess = () => <Spinner />

const DefaultPost = () => <Spinner />

const DefaultError = ErrorComponent

export const Init = PassThrough()
export const Prompt = PassThrough()
export const Scan = PassThrough()
export const Process = PassThrough()
export const Post = PassThrough()
export const _Error = PassThrough()

const components = {
    init: Init,
    prompt: Prompt,
    scan: Scan,
    process: Process,
    post: Post,
    error: _Error
}

const defaults = {
    init: DefaultInit,
    prompt: DefaultPrompt,
    scan: DefaultScan,
    process: DefaultProcess,
    post: DefaultPost,
    error: DefaultError
}

export const Scanner = ({ children, ...props }) => (
    <DeclarativeContainer
        service={ScannerService}
        components={components}
        defaults={defaults}
        {...props}
    >
        {children}
    </DeclarativeContainer>
)

export const PermissionedScanner = ({ children }) => (
    <PermissionProvider permission={CAMERA}>
        <PermissionGranted>
            <Scanner>
                {children}
            </Scanner>
        </PermissionGranted>
    </PermissionProvider>
)

export default Scanner