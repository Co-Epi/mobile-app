import { Machine } from 'xstate'
import { useMachine } from '@xstate/react'

import { InitState, InvokeState, ErrorState, WaitState, ThroughState } from './common'
// import { getCurrentPositionAsync, startLocationUpdatesAsync, Accuracy, startGeofencingAsync, stopLocationUpdatesAsync, stopGeofencingAsync, hasStartedLocationUpdatesAsync, GeofencingEventType, getLastKnownPositionAsync } from 'expo-location'
// import { getItemAsync, setItemAsync } from 'expo-secure-store'
// import { defineTask } from 'expo-task-manager'
// import { Notifications } from 'expo'

const BACKGROUND_LOCATION = 'BACKGROUND_LOCATION'
const GEOFENCE_LOCATION = 'GEOFENCE_LOCATION'
const BACKGROUND_MOVEMENT = 'BACKGROUND_MOVEMENT'

const GEOFENCE_RADIUS = 50
const GEOFENCE_TIMEOUT = 60 * 1000

let actions, state, send;

function getDistanceFromLatLng(lat1, lng1, lat2, lng2, miles) { // miles optional
    if (typeof miles === "undefined") { miles = false; }
    function deg2rad(deg) { return deg * (Math.PI / 180); }
    function square(x) { return Math.pow(x, 2); }
    var r = 6371; // radius of the earth in km
    lat1 = deg2rad(lat1);
    lat2 = deg2rad(lat2);
    var lat_dif = lat2 - lat1;
    var lng_dif = deg2rad(lng2 - lng1);
    var a = square(Math.sin(lat_dif / 2)) + Math.cos(lat1) * Math.cos(lat2) * square(Math.sin(lng_dif / 2));
    var d = 2 * r * Math.asin(Math.sqrt(a));
    if (miles) { return d * 0.621371; } //return miles
    else { return d; } //return km
}


defineTask(BACKGROUND_LOCATION, async ({ data, error }) => {
    if (error) {
        console.error(error)
        // Error occurred - check `error.message` for more details.
        return;
    }
    if (data) {
        console.log(BACKGROUND_LOCATION, data)
        const { locations: [location] } = data;
        await stopLocationUpdatesAsync(BACKGROUND_LOCATION).catch(e => console.info('stop error', e))
        actions.location(location)
    }
})

defineTask(GEOFENCE_LOCATION, async ({ data, error }) => {
    if (error) {
        console.error(error)
        return
    }
    if (data) {
        console.log(GEOFENCE_LOCATION, GeofencingEventType, data)
        const { eventType, region } = data;
        if (eventType === GeofencingEventType.Exit){
            console.log('EXITED GEOFENCE')
            const location = await getLastKnownPositionAsync()
            console.log('last location',location)
            await setItemAsync('location', JSON.stringify(location))
            await stopGeofencingAsync(GEOFENCE_LOCATION)
            while (!actions){
                await new Promise((r) => setTimeout(r, 100))
            }
            actions.exitGeofence(location)
        }
    }
})

defineTask(BACKGROUND_MOVEMENT, async ({ data, error }) => {
    if (error) {
        console.error(error)
        return
    }
    if (data) {
        error("TODO")
        // const last = JSON.parse(await getItemAsync('location'))
        // const { locations: [location] } = data;

        // const distance = getDistanceFromLatLng(
        //     last.coords.latitude,
        //     last.coords.longitude,
        //     location.coords.latitude,
        //     location.coords.longitude
        // ) * 1000 //km to m
        // console.log(BACKGROUND_MOVEMENT, distance, location.timestamp - last.timestamp)
        // console.warn('location update: ' + distance + ' meters')
        // const settings = JSON.parse(await getItemAsync('settings'))
        // if (distance > settings.geofence_radius) {
        //     console.warn('distance > radius, reset timeout')
        //     await setItemAsync('location', JSON.stringify(location))
        // } else if (location.timestamp - last.timestamp > settings.movement_timeout) {
        //     await stopLocationUpdatesAsync(BACKGROUND_MOVEMENT)
        //     actions.movementStop(location)
        // } else {
        //     console.warn('distance < radius, ' + Math.ceil((settings.movement_timeout - (location.timestamp - last.timestamp)) / 1000) + ' sec till timeout')
        // }
    }
})

export const LocationMachine = ({
    id = `location_${Math.random()}`,
    gpsOptions = {},
} = {}) => Machine({
    id,
    initial: 'init',
    states: {
        init: InitState({
            START: 'get_location'
        }),
        get_location: InvokeState({
            src: async () => await startLocationUpdatesAsync(BACKGROUND_LOCATION, {
                accuracy: Accuracy.Balanced
            }),
            target: 'wait_location'
        }),
        wait_location: WaitState({
            on: {
                LOCATION: 'set_geofence'
            }
        }),
        set_geofence: InvokeState({
            src: async ({ location: { coords: { latitude, longitude } } }) => {
                const settings = JSON.parse(await getItemAsync('settings'))
                await startGeofencingAsync(GEOFENCE_LOCATION, [{
                    latitude,
                    longitude,
                    radius: settings.geofence_radius,
                    notifyOnEnter: false
                }])
            },
            target: 'wait_geofence_exit'
        }),
        wait_geofence_exit: WaitState({
            on: {
                EXIT_GEOFENCE: 'movement_start'
            }
        }),
        movement_start: InvokeState({
            src: async () => startLocationUpdatesAsync(BACKGROUND_MOVEMENT, {
                accuracy: Accuracy.Balanced
            }),
            target: 'wait_movement_stop'
        }),
        wait_movement_stop: WaitState({
            on: {
                MOVEMENT_STOP: 'notify_movement_stop'
            }
        }),
        notify_movement_stop: InvokeState({
            src: async () => await Notifications.presentLocalNotificationAsync({
                title: `New Location`,
                body: `It looks like you've moved to a new location, remember to wash your hands!`
            }),
            target: 'set_geofence'
        }),
        error: ErrorState()
    }
}).withContext({
    gpsOptions
})

export const LocationService = (options) => {
    //if (!actions){
        [state, send] = useMachine(LocationMachine(options))
        actions = {
            location: (location) => send({
                type: 'LOCATION',
                data: { location }
            }),
            exitGeofence: () => send('EXIT_GEOFENCE'),
            movementStop: (location) => send({
                type: 'MOVEMENT_STOP',
                data: { location }
            })
        }
    //}

    return ({ state, actions })
}