import React, { cloneElement } from 'react';

import { Modal as NativeModal, View } from 'react-native';
import { PassThrough, MachineProvider } from './common'
import { ModalService } from '../state/modal';

console.log('provider, modal', NativeModal, MachineProvider)

export const Control = PassThrough()

export const Content = ({ children = null, state, actions, ...props }) => console.log('content', children, props) || (
    <View>
    <NativeModal
        visible={state.matches('show')}
        onRequestClose={() => {}}
        {...props}
    >
        <View>
            {cloneElement(children, {
                state,
                actions
            })} 
        </View>
    </NativeModal>
    </View>
)

export const Modal = ({ children, ...props }) => (
    <MachineProvider
        service={ModalService}
        {...props}
    >
        {children}
    </MachineProvider>
)

export default Modal