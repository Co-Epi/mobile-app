import React from 'react'

import {Button, Text} from 'native-base'

export default ({onPress, label}) => (
    <Button onPress={onPress}>
        <Text>
            {label}
        </Text>
    </Button>
)