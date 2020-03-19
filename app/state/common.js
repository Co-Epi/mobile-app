import {Machine, assign} from 'xstate'
// import * as Permissions from 'expo-permissions';


export const InitState = ({
    START = 'done',
    RETRY = 'init',
    entry = [(context) => context.onInit ? context.onInit(context) : null],
    actions
} = {}) => ({
    entry,
    on : {
        '': START,
        START,
        RETRY
    }
})

export const ThroughState = ({
    target = (() => {throw new Error('ThroughState requires target')})(),
    actions = assign((context, {data = {}}) => ({
        ...context,
        ...data
    }))
} = {}) => ({
    on : {
        '': {
            target,
            actions
        }
    }
})

export const WaitState = ({
    onEntry = () => {},
    on = {},
    actions = assign((context, {data = {}}) => ({
        ...context,
        ...data
    }))
} = {}) => ({
    entry: [onEntry],
    on : {
        ...(Object.keys(on).reduce((newOn, key) => ({
            ...newOn,
            [key]: {
                target: on[key],
                actions
            }
        }),{}))
    }
})

export const BranchState = ({
    conditions = {},
    actions = assign((context, {data = {}}) => ({
        ...context,
        ...data
    }))
} = {}) => ({
    on : {
        '': Object.keys(conditions).map(target => ({
            target,
            cond: conditions[target],
            actions
        })).concat([{
            target: 'error',
            actions: assign({
                error: () => new Error(`Stuck in Branch`),
                errorContext: () => ({conditions})
            })
        }])
    }
})

export const DoneState = ({
    on = {},
    entry = [(context) => context.onDone ? context.onDone(context) : null]
} = {}) => ({
    entry,
    on
})

export const ErrorState = ({
    entry = [(context) => console.error(context)],
    RETRY = 'init'
} = {}) => ({
    entry, 
    on : {
        RETRY
    }
})

export const InvokeState = ({
    id = `invoke_${Math.random()}`,
    src = async () => new Promise(res => setTimeout(res, 100)),
    target = 'done',
    onDone = {
        actions: assign((context, {data = {}}) => ({
            ...context,
            ...data
        }))
    },
    onError = {
        target: 'error',
        actions: assign({
            error: (context, {data = new Error('unidentified error')}) => data
        })
    }
} = {}) => ({
    invoke: {
        id,
        src,
        onDone : {
            target,
            ...onDone
        },
        onError
    }
})

export const TaskMachine = ({
    id = `task_${Math.random()}`,
    task = async () => new Promise(res => setTimeout(res, 100))
} = {}) => Machine({
    id,
    initial: 'init',
    states: {
        init: InitState({
            START: 'task'
        }),
        task: InvokeState({id, src : task}),
        done: DoneState(),
        error: ErrorState()
    }
}).withContext({})

export const StepMachine = ({
    id = `steps_${Math.random()}`,
    steps = [async () => new Promise(res => setTimeout(res, 100))]
} = {}) => Machine({
    id,
    initial: 'init',
    states: {
        init: InitState({
            START: 'step_0'
        }),
        ...(steps.reduce((states, src, idx) => ({
            ...states,
            [`step_${idx}`] : InvokeState({
                id: `${id}_step_${idx}`, 
                src,
                target: (idx + 1) === steps.length ? `step_${idx}` : 'done'
            })
        }), {})),
        done: DoneState(),
        error: ErrorState()
    } 
}).withContext({})

export const PermissionMachine = ({
    id = `permission_${Math.random()}`,
    permission = (() => {throw new Error('must declare permission desired')})()
} = {}) => Machine({

}).withContext({})