import React from 'react';

import { Spinner } from 'native-base'
import { StyleSheet } from 'react-native';


import { Action } from './action'
import { PassThrough, ErrorComponent, DeclarativeContainer } from './common'
import { CalendarService } from '../state/calendar';
import { PermissionProvider, Granted as PermissionGranted } from './permission'
import { CALENDAR } from 'expo-permissions'
import {List, ListItem, Text} from 'native-base'
import {timezone} from 'expo-localization'

const DefaultInit = () => <Spinner />

const DefaultLoad = () => <Spinner />

const DefaultRefresh = () => <Spinner />

const DefaultDisplaySection = ({header, items}) => (
    <>
        <ListItem itemDivider>
            <Text>{header}</Text>
        </ListItem>
        {items.map(({title}) => (
            <ListItem key={`${header}_${title}`}>
                <Text>{title}</Text>
            </ListItem>
        ))}
    </>
)

const DefaultDisplay = ({state: {context: {past, recent, future}}, actions}) => (
    <>
        <List>
            <DefaultDisplaySection
                header="Upcoming"
                items={future}
            />
            <DefaultDisplaySection
                header="Recent"
                items={recent}
            />
            <DefaultDisplaySection
                header="Past"
                items={past}
            />
        </List>
        <Action
            prompt='Create new event'
            button='Create'
            action={() => {
                const rand = `${Math.random()}`
                const now = new Date()
                actions.create({
                    title: rand,
                    startDate : new Date(now.getTime() + 3600000),
                    endDate : new Date(now.getTime() + 7200000),
                    timezone
                })
            }}
        />
    </>
)

const DefaultCreate = () => <Spinner />

const DefaultRemove = () => <Spinner />

const DefaultError = ErrorComponent()

export const Init = PassThrough()
export const Load = PassThrough()
export const Refresh = PassThrough()
export const Display = PassThrough()
export const Create = PassThrough()
export const Remove = PassThrough()
export const _Error = PassThrough()

const components = {
    init: Init,
    load: Load,
    refresh: Refresh,
    display: Display,
    create: Create,
    remove: Remove,
    error: _Error
}

const defaults = {
    init: DefaultInit,
    load: DefaultLoad,
    refresh: DefaultRefresh,
    display: DefaultDisplay,
    create: DefaultCreate,
    remote: DefaultRemove,
    error: DefaultError
}

export const Calendar = ({ children, ...props }) => (
    <DeclarativeContainer
        service={CalendarService}
        components={components}
        defaults={defaults}
        {...props}
    >
        {children}
    </DeclarativeContainer>
)

export const PermissionedCalendar = ({ children }) => (
    <PermissionProvider permission={CALENDAR}>
        <PermissionGranted>
            <Calendar>
                {children}
            </Calendar>
        </PermissionGranted>
    </PermissionProvider>
)

export default Calendar