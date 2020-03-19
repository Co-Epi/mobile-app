import React from 'react'

import { StatusBar } from 'react-native'
import { Header as NativeBaseHeader, Title, Body, Left, Right, Icon } from 'native-base'

export const Header = ({ title }) => (
    <NativeBaseHeader style={{
        marginTop: StatusBar.currentHeight
    }}>
        <Left />
        <Body>
            <Title>
                {title}
            </Title>
        </Body>
        <Right />
    </NativeBaseHeader>
)

const TabToIcon = {
    Location: 'ios-locate',
    Settings: 'ios-cog',
    'Hygiene Tips': 'ios-medkit',
}

export const TabBarIcon = (navigator) => ({ focused, tintColor }) => (
    <Icon
        name={TabToIcon[navigator.state.key]}
        style={{
            color: tintColor
        }}
    />
)
