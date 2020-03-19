import React from 'react';

import { Spinner } from 'native-base'
import { Text } from 'native-base'

import { Action } from './action'
import { PassThrough, ErrorComponent, DeclarativeContainer } from './common'
import { LocationService } from '../state/location';
import { PermissionProvider, Granted as PermissionGranted } from './permission'
// import { LOCATION, NOTIFICATIONS } from 'expo-permissions'

const DefaultInit = () => <Spinner />
const DefaultGetLocation = () => <Spinner />
const DefaultWaitLocation = () => <Spinner />
const DefaultSetGeofence = () => <Spinner />
const DefaultWaitGeofenceExit = () => <Spinner />
const DefaultMovementStart = () => <Spinner />
const DefaultWaitMovementStop = () => <Spinner />
const DefaultNotifyMovementStop = () => <Spinner />
const DefaultError = ErrorComponent()


export const Init = PassThrough()
export const GetLocation = PassThrough()
export const WaitLocation = PassThrough()
export const SetGeofence = PassThrough()
export const WaitGeofenceExit = PassThrough()
export const MovementStart = PassThrough()
export const WaitMovementStop = PassThrough()
export const NotifyMovementStop = PassThrough()
export const _Error = PassThrough()

const components = {
    init: Init,
    get_location: GetLocation,
    wait_location: WaitLocation,
    set_geofence: SetGeofence,
    wait_geofence_exit: WaitGeofenceExit,
    movement_start: MovementStart,
    wait_movement_stop: WaitMovementStop,
    notify_movement_stop: NotifyMovementStop,
    error: _Error
}

const defaults = {
    init: DefaultInit,
    get_location: DefaultGetLocation,
    wait_location: DefaultWaitLocation,
    set_geofence: DefaultSetGeofence,
    wait_geofence_exit: DefaultWaitGeofenceExit,
    movement_start: DefaultMovementStart,
    wait_movement_stop: DefaultWaitMovementStop,
    notify_movement_stop: DefaultNotifyMovementStop,
    error: DefaultError
}

export const Location = ({ children, ...props }) => (
    <DeclarativeContainer
        service={LocationService}
        components={components}
        defaults={defaults}
        {...props}
    >
        {children}
    </DeclarativeContainer>
)

export const PermissionedLocation = ({ children }) => (
  // TODO
  error("")
    // <PermissionProvider permission={LOCATION}>
    //     <PermissionGranted>
    //         <PermissionProvider permission={NOTIFICATIONS}>
    //             <Location>
    //                 {children}
    //             </Location>
    //         </PermissionProvider>
    //     </PermissionGranted>
    // </PermissionProvider>
)

export default Location