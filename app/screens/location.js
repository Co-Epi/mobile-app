import React from 'react';
import { Container } from 'native-base'
import { Header } from '../components/ui'
import { PermissionedLocation, SetGeofence, GetLocation, WaitLocation, WaitMovementStop, WaitGeofenceExit } from '../components/location'
import { Text } from 'native-base'

const GetLocationUI = ({ state: { context: { location } } }) => (
    <>
        <Text>Getting initial location</Text>
        <Text>
            {JSON.stringify(location)}
        </Text>
    </>
)

const WaitLocationUI = ({ state: { context: { location } } }) => (
    <>
        <Text>Waiting for Location</Text>
        <Text>
            {JSON.stringify(location)}
        </Text>
    </>
)

const WaitMovementStopUI = ({ state: { context: { location } } }) => (
    <>
        <Text>Outside of geofence, waiting for movement to stop</Text>
        <Text>
            {JSON.stringify(location)}
        </Text>
    </>
)

const WaitGeofenceExitUI = ({ state: { context: { location } } }) => (
    <>
        <Text>Waiting to Exit Geofence TAG 8:37</Text>
        <Text>
            {JSON.stringify(location)}
        </Text>
    </>
)
export default () => (
    <Container>
        <Header
            title="Location"
        />
        <PermissionedLocation>
            <GetLocation>
                <GetLocationUI />
            </GetLocation>
            <WaitLocation>
                <WaitLocationUI />
            </WaitLocation>
            <WaitGeofenceExit>
                <WaitGeofenceExitUI />
            </WaitGeofenceExit>
            <WaitMovementStop>
                <WaitMovementStopUI />
            </WaitMovementStop>
        </PermissionedLocation>
    </Container>
)
