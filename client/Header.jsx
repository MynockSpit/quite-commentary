/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { useState } from 'react'
import { Layout, Menu, Popover, Form, Input, Icon, Checkbox, Button } from 'antd'

const { Header } = Layout

import { login } from './service'

export default () => {
  const [state, setState] = useState({ current: '' })

  const handleClick = event => {
    setState({ current: event.key })
  }

  return (
    <Header style={{
      background: "#fff",
      borderBottom: "1px solid #e8e8e8"
    }}>
      <Menu
        onClick={handleClick}
        selectedKeys={[state.current]}
        mode="horizontal"
        style={{ lineHeight: '62px' }}
      >
        {/* <Menu.Item key="mail">
          <Icon type="mail" />
          Navigation One
        </Menu.Item> */}
        <Menu.Item key="login" style={{ float: "right" }} css={css`
          & span {
            display: block;
          }
        `}>
          <Popover
            placement="bottomRight"
            content={<LogIn />}
            trigger="click"
            visible={state.current === 'login'}
            style={{ display: 'block' }}
            onVisibleChange={visible => { if (visible === false) setState({ current: '' }) }}
          >Log In</Popover>
        </Menu.Item>
        <Menu.Item key="signup" style={{ float: "right" }} css={css`
          & span {
            display: block;
          }
        `}>
          <Popover
            placement="bottomRight"
            content={<SignUp />}
            trigger="click"
            visible={state.current === 'signup'}
            onVisibleChange={visible => { if (visible === false) setState({ current: '' }) }}
          >Sign Up</Popover>
        </Menu.Item>
      </Menu>
    </Header>
  )
}

const SignUp = () => {
  return (
    null
  )
}

const LogIn = Form.create({ name: 'normal_login' })(({ form }) => {
  const { getFieldDecorator } = form

  const [ validateStatus, setValidateStatus ] = useState({})

  const handleSubmit = event => {
    event.preventDefault()

    setValidateStatus(() => {})

    form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await login(values.username, values.password)
        } catch (e) {
          setValidateStatus({
            username: {
              validateStatus: "error", help: ""
            },
            password: {
              validateStatus: "error", help: "Invalid username or password!"
            }
          })
        }
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item {...(validateStatus && validateStatus.username || {})}>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!' }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />,
        )}
      </Form.Item>
      <Form.Item {...(validateStatus && validateStatus.password || {})}>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your Password!' }],
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" css={css`width: 100%`}>
          Log in
        </Button>
      </Form.Item>
    </Form>
  )
})