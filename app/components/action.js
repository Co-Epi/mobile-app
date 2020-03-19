import React from 'react'

import {Text, Button} from 'native-base'

export const Action = ({prompt, button, action}) => (
    <>
        <Text>
            {prompt}
        </Text>
        <Button 
            light
            onPress={action}
        >
            <Text>
                {button}
            </Text>
        </Button>
    </>
)