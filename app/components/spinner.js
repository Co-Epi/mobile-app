import React from 'react'

import { Spinner, View } from 'native-base'

export default () => (
    <View
        style={{
            flex: 1,
            justifyContent: "space-around"
        }}
    >
        <Spinner/>
    </View>
)