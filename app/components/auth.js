import React from 'react'
import { MachineProvider } from './common'
import { AuthService } from '../state/auth'
import { Button, Text, View, Spinner } from 'native-base'

export const AuthButtons = ({ state: { value, context: { strategies } }, actions: { auth } }) => console.log('value', value) || (
    <View style={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        {   value === 'wait' ? 
            strategies.map((strategy, index) => (
                    <Button key={`strategy_${index}`}
                        onPress={() => console.log('press', strategy) || auth(strategy)}
                    >
                        <Text>
                            {strategy.button}
                        </Text>
                    </Button>
            )) : <Spinner/>
        }
    </View>
)

export const Auth = ({ children, ...props }) => (
    <MachineProvider
        service={AuthService}
        {...props}
    >
        {children}
        <AuthButtons />
    </MachineProvider>
)

export default Auth