import {Machine, assign} from 'xstate'
import {InitState, InvokeState, ErrorState, WaitState, BranchState, DoneState, ThroughState} from './common'
import { useMachine } from '@xstate/react'

const wait = async () => new Promise(r => setTimeout(r, 100))

async function* gen (){
    console.log('make generator')
    let j = 0
    while(true){
        await wait()
        const data = []
        for (let i = 0; i < 5; i++){
            data.push(j++)
        }
        yield data.map(i => ({
            text: 'Card ' + i
        }))
    }
}

export const SwiperMachine = ({
    id = `swiper_${Math.random()}`,
    generator = gen,
} = {}) => Machine({
    id,
    type: 'parallel',
    states: {
        load: {
            initial: 'init',
            states : {
                init: ThroughState({
                    target: 'dispatch',
                    actions: assign({
                        page: () => generator(),
                        interact : () => 'green',
                        swipes : () => 0,
                        load : () => true,
                        done : () => false,
                        green : () => [],
                        blue : () => []
                    })
                }),
                dispatch: BranchState({
                    conditions: {
                        done: ({done}) => {
                            return done
                        },
                        green: ({green, load, interact, done}) => {
                            return (!done && !green.length || (load && interact === 'blue'))
                        },
                        blue: ({blue, load, interact, done}) => !done && !blue.length || (load && interact === 'green'),
                        wait: ({load, done}) => !done && !load
                    }
                }),
                wait: WaitState({
                    on: {
                        SWIPED: 'dispatch'
                    }
                }),
                load_done: ThroughState({
                    target: 'dispatch',
                    actions: assign({
                        load: () => false
                    })
                }),
                green: InvokeState({
                    src: async ({page}) => {
                        const {value: green, done} = await page.next()
                        return ({green, done})
                    },
                    target: 'load_done'
                }),
                blue: InvokeState({
                    src: async () => {
                        const {value: blue, done} = await page.next()
                        return ({blue, done})
                    },
                    target: 'load_done'
                }),
                done: WaitState({
                    on: {
                        RESET_LOADING: 'init'
                    }
                }),
                error: ErrorState()
            }
        },
        interact: {
            initial: 'init',
            states: {
                init: InvokeState({
                    src : async () => await wait(),
                    target: 'checkInit'
                }),
                checkInit: BranchState({
                    conditions: {
                        swipe : ({load}) => !load,
                        init : ({load}) => load
                    }
                }),
                green: WaitState({
                    on: {
                        SWIPE: 'swipe',
                    }
                }),
                blue: WaitState({
                    on: {
                        SWIPE: 'swipe'
                    }
                }),
                swipe: BranchState({
                    conditions: {
                        done: ({swipes, done, interact, ...rest }) => (done && swipes === rest[interact].length),
                        switch: ({swipes}) => swipes === 9,
                        blue: ({interact}) => interact === 'blue',
                        green: ({interact}) => interact === 'green'
                    },
                    actions: assign({
                        swipes: ({swipes}) => swipes + 1
                    })
                }),
                switch: BranchState({
                    conditions: {
                        blue: ({interact}) => interact === 'green',
                        green: ({interact}) => interact === 'blue',
                        done: ({done}) => done
                    },
                    actions: assign({
                        swipes: () => 0,
                        green: ({interact, green}) => interact === 'green' ? [] : green,
                        blue: ({interact, blue}) => interact === 'blue' ? [] : blue,
                        interact: ({interact}) => interact === 'green' ? 'blue' : 'green',
                        load: () => true
                    })
                }),
                done: WaitState({
                    on: {
                        RESET_INTERACT: 'init'
                    }
                }),
                error: ErrorState()
            }
        }
    }
})

export const SwiperService = (options) => {
    const [state, send] = useMachine(SwiperMachine(options))
    const actions = {
        swipe: (item, swipeRight) => {
            if (swipeRight && options.select){
                options.select(item)
            }
            console.log('direction?', item, swipeRight)
            send('SWIPE')   
            setTimeout(() => send('SWIPED'), 0)
        },
        reset: () => {
            send('RESET_LOADING')
            send('RESET_INTERACT')
        }
    }

    return ({state, actions})
}