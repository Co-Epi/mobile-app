import React, { Children, cloneElement } from 'react'
import { Action } from './action'

export const MachineProvider = ({ service, children, ...props }) => {
    const context = service(props)

    return React.Children.toArray(children).map((child) => React.cloneElement(child, {
        ...props,
        ...context
    }))
}

export const PassThrough = () => ({ children, ...props }) => Children.map(children, child => cloneElement(child, props));

export const buildContainer = ({ components, defaults }) => ({ state, children, ...props }) => {
    const original = children
    children = children ? React.Children.toArray(children) : []

    const Component = components[state.value]
    const Default = defaults[state.value]

    const child = children.find(child => child.type === Component) || <Default />

    return cloneElement(child, {
        state,
        original,
        ...props
    })
}

export const DeclarativeContainer = ({ state, actions, service, components, defaults, children, ...props}) => {
    const Container = buildContainer({ components, defaults })

    return (
        <MachineProvider service={service} {...props}>
            <Container>
                {children}
            </Container>
        </MachineProvider>
    )
}


export const ErrorComponent = () => ({ context: { actions: { retry }, state: { context: { error } } } }) => (
    <Action
        prompt={`There was an Error: ${error.message}`}
        button="Retry"
        action={retry}
    />
)