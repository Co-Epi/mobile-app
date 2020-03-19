import React from 'react'

import {List, ListItem} from 'native-base'

import { ListService } from '../state/infinilist'
import { MachineProvider } from './common'

const ListComponent = ({ state, actions, ItemComponent, inverted, ...props }) => (
    <List
        inverted={inverted}
        onEndReached={actions.load}
        dataArray={state.context.data}
        renderItem={({item, index}) => 
            <ListItem key={index}>
                <ItemComponent item={item}/>
            </ListItem>
        }
        keyExtractor={({key}) => `${key}`}
        onEndReachedThreshold={0.5}
        {...props}
    />
)

export const InfinityList = (props) => (
    <MachineProvider service={ListService} {...props}>
        <ListComponent />
    </MachineProvider>
)