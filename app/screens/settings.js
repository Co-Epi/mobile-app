import React from 'react';
import { Container, Body, Title, Content } from 'native-base'
import { Header } from '../components/ui'
import { Form } from '../components/form'
import { SwitchActions } from 'react-navigation';
import { getItemAsync, setItemAsync } from 'expo-secure-store';

export default ({navigation}) => (
    <Container>
        <Header
            title="Settings"
        />
        <Form
            load={async () => JSON.parse(await getItemAsync('settings'))}
            schema={[{
                fields: [{
                    key: 'geofence_radius',
                    type: 'number',
                    label: 'Geofence Radius (meters)'
                }, {
                    key: 'movement_timeout',
                    type: 'number',
                    label: 'Movement Timeout (seconds)'
                }]

            }]}
            submit={async ({ data }) => {
                await setItemAsync('settings',JSON.stringify({
                    ...(JSON.parse(await getItemAsync('settings'))),
                    ...data
                }))
            }}
            submit_done={(params = {
                key: 'value'
            }) => navigation.dispatch(SwitchActions.jumpTo({routeName: 'Location', params}))}
            submitLabel="Update"
        />
    </Container>
)
