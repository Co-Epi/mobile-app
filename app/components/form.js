import React, { Fragment, useState } from 'react'

import { View } from 'react-native'

import { Form as NativeForm, Item, Separator, Input, Text, Label, Spinner, Button, Col, Grid } from 'native-base'
import { ErrorComponent, PassThrough, DeclarativeContainer } from './common'
import { FormService } from '../state/form'



const DefaultInit = () => <Spinner />

const DefaultLoad = () => <Spinner />

const DefaultInput = (props) => (
    <Grid>
        <Col>
            <FormInput {...props} />
            <FormButton {...props} />
        </Col>
    </Grid>
)

const DefaultChange = (props) => (
    <Col>
        <FormInput {...props} />
        <FormButton disabled={true} {...props} />
    </Col>
)

const DefaultSubmit = (props) => (
    <>
        <FormInput {...props} />
        <FormButton disabled={true} spinner={true} {...props} />
    </>
)
const DefaultSubmitDone = () => <Spinner />

const DefaultError = ErrorComponent()

export const Init = PassThrough()
export const Load = PassThrough()
export const _Input = PassThrough()
export const Change = PassThrough()
export const Submit = PassThrough()
export const SubmitDone = PassThrough()
export const _Error = PassThrough()

const components = {
    init: Init,
    load: Load,
    input: _Input,
    change: Change,
    submit: Submit,
    submit_done: SubmitDone,
    error: _Error
}

const defaults = {
    init: DefaultInit,
    load: DefaultLoad,
    input: DefaultInput,
    change: DefaultChange,
    submit: DefaultSubmit,
    submit_done: DefaultSubmitDone,
    error: DefaultError
}

export const Form = ({ children, ...props }) => (
    <DeclarativeContainer
        service={FormService}
        components={components}
        defaults={defaults}
        {...props}
    >
        {children}
    </DeclarativeContainer>
)

const TextInput = ({ item: { label, placeholder, key, multiline, numberOfLines }, change, value }) => {
    const [height, setHeight] = useState(0);
    const offset = 40

    return (
        <Item style={{
            height: height + offset
        }} stackedLabel>
            <Label>
                {label}
            </Label>
            <Input
                style={{
                    height: 100
                }}
                onContentSizeChange={(event) => {
                    setHeight( Math.ceil(event.nativeEvent.contentSize.height))
                }}
                onChange={(event) => {
                    change({ [key]: event.nativeEvent.text })
                }}
                placeholder={placeholder}
                value={value}
                multiline={multiline}
                numberOfLines={numberOfLines}
                blurOnSubmit={true}
                returnKeyType={"done"}
            />
        </Item>
    )
}


const NumberInput = ({ item: { label, key }, change, value }) => {

    return (
        <Item stackedLabel>
            <Label>
                {label}
            </Label>
            <Input
                keyboardType="number-pad"
                style={{
                    height: 100
                }}
                onChange={(event) => {
                    change({ [key]: Math.floor(event.nativeEvent.text) || '' })
                }}
                value={`${value}`}
                blurOnSubmit={true}
                returnKeyType={"done"}
            />
        </Item>
    )
}

const SectionHeader = ({ label }) => (
    <Item>
        <Separator bordered>
            <Label>
                {label}
            </Label>
        </Separator>
    </Item>
)

const SectionFields = ({ fields, change, data }) => (
    <NativeForm>
        {fields.map((item, index) => {
            const Component = COMPONENTS[item.type]
            return <Component key={index} item={item} value={data[item.key]} change={change} />
        })}
    </NativeForm>
)

const COMPONENTS = {
    text: TextInput,
    number: NumberInput
}

const FormInput = ({
    state: {
        context: {
            data
        }
    },
    actions: {
        change
    },
    schema = []
}) => (
        <Col>
            {schema.map(({ label, fields }, idx) => (
                <Fragment key={idx}>
                    <SectionHeader
                        key={`section_header_${idx}`}
                        label={label} />
                    <SectionFields
                        key={`section_fields_${idx}`}
                        fields={fields}
                        change={change}
                        data={data} />
                </Fragment>
            ))}
        </Col>
    )

const FormButton = ({ disabled, spinner, state: { context: { submitLabel } }, actions: { submit } }) => (
    <Button block light disabled={disabled} onPress={submit}>
        {
            spinner ? <Spinner /> : <Text> {submitLabel} </Text>
        }
    </Button>
)