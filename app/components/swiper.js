import React, {cloneElement} from 'react';

import Spinner from './spinner'
import { DeckSwiper, Card, CardItem, Text, Left, Body, Icon, View } from 'native-base';
import { SwiperService } from '../state/swiper';
import { MachineProvider, PassThrough } from './common';


const DeckCard = ({ item, color }) => (
    <View style={{
        flex: 1,
        justifyContent: 'space-evenly'
    }}>
        <Card style={{ width: "100%", height: '100%', elevation: 3 }}>
            <CardItem>
                <Left>
                    <Body>
                        <Text>{item.text}</Text>
                        <Text note>NativeBase</Text>
                    </Body>
                </Left>
            </CardItem>
            <CardItem cardBody>
                <Text>
                    Body
                </Text>
            </CardItem>
            <CardItem>
                <Icon name="heart" style={{ color }} />
            </CardItem>
        </Card>
    </View>
)

const GreenBlue = ({ color, data, nextData, swipe = () => { }, empty = false, Card = DeckCard }) => data.length ? <DeckSwiper
    key={color}
    style={{
        position: 'relative'
    }}
    dataSource={data}
    looping={false}
    onSwipeRight={item => swipe(item, true)}
    onSwipeLeft={item => swipe(item)}
    renderEmpty={() => nextData[0] ? <Card item={nextData[0]} color={color} /> : null}
    renderItem={item => <Card item={item} color={color} />}
/> : <Spinner />


export const DefaultDone = ({ reset }) => (
    <View style={{
        flex: 1,
        justifyContent: 'space-evenly'
    }}>
        <Card style={{ width: "100%", height: '100%', elevation: 3 }}>
            <CardItem cardBody>
                <Text>
                    No more items
                </Text>
            </CardItem>
            <CardItem>
                <Icon name="heart" />
            </CardItem>
        </Card>
    </View>
)

export const Done = PassThrough()
export const Loading = PassThrough()

const makeConditional = (Wrapper, Default, children, state, original, props) => {
    const child = children.find(child => child.type === Wrapper) || <Default />

    return cloneElement(child, {
        state,
        original,
        ...props
    })
}

export const SwiperContainer = ({ state, actions, children, card, ...props }) => {
    console.log('state.value', state.value)
    const original = children
    children = children ? React.Children.toArray(children) : []

    if (state.matches({interact: 'init'}) || state.matches({interact : 'checkInit'})){
        return <Spinner/>
    } else if (state.matches({ load: 'done', interact: 'done' })){
        return makeConditional(Done, DefaultDone, children, state, original, {state, actions, ...props})
    } else if (state.matches('init') || state.matches({ interact: 'green', load: 'green' }) || state.matches({ interact: 'blue', load: 'blue' })) {
        return makeConditional(Loading, Spinner, children, state, original, {state, actions, ...props})
    } else if (state.matches({ interact: 'green' })) {
        return <GreenBlue color={'green'} data={state.context.green} nextData={state.context.blue} swipe={actions.swipe} Card={card} />
    } else if (state.matches({interact: 'blue'})){
        return <GreenBlue color={'blue'} data={state.context.blue} nextData={state.context.green} swipe={actions.swipe} Card={card}/>
    } else {
        return <Text>ERROR</Text>
    }
}

export const Swiper = ({ children, ...props }) => (
    <MachineProvider service={SwiperService} {...props}>
        <SwiperContainer>
            {children}
        </SwiperContainer>
    </MachineProvider>
)