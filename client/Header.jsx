/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { useState } from 'react'
import { navigate } from "@reach/router"
import { Layout, Menu, Popover, Form, Input, Icon, Button } from 'antd'

const { Header } = Layout

import { login, logout, register } from './service'
import { Store } from './store'

const menuItemCss = css`
float: right;

& span {
  display: block;
}
`

export default () => {
  const [state, setState] = useState({ current: '' })

  const handleClick = event => {
    setState({ current: event.key })
  }

  const { user, selectedPost } = Store.use()

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
        <Menu.Item key="back" style={{ display: selectedPost ? undefined : 'none' }} onClick={async () => {
          setState({ current: '' })
          await navigate(`/`)
          Store.set({ selectedPost: null })
        }}>
          <Icon type="arrow-left" />
        </Menu.Item>
        
        <Menu.Item key="logout" style={{ display: user ? undefined : 'none' }} onClick={logout} css={menuItemCss}>
          Log Out {user && user.username}
        </Menu.Item>
        <Menu.Item key="login" style={{ display: user ? 'none' : undefined }} css={menuItemCss}>
          <Popover
            placement="bottomRight"
            content={<LogIn />}
            trigger="click"
            visible={state.current === 'login'}
            style={{ display: 'block' }}
            onVisibleChange={visible => { if (visible === false) setState({ current: '' }) }}
          >Log In</Popover>
        </Menu.Item>
        <Menu.Item key="signup" style={{ display: user ? 'none' : undefined }} css={menuItemCss}>
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

const SignUp = Form.create({ name: 'signup' })(({ form }) => {
  const { getFieldDecorator } = form

  const handleSubmit = event => {
    event.preventDefault()

    form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await register(values.username, values.password)
        } catch (e) {
        }
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input a new username!' }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input a new password!' }],
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
          Sign up
        </Button>
      </Form.Item>
    </Form>
  )
})

const LogIn = Form.create({ name: 'login' })(({ form }) => {
  const { getFieldDecorator } = form

  const [validateStatus, setValidateStatus] = useState(null)

  const handleSubmit = event => {
    event.preventDefault()

    setValidateStatus(() => null)

    form.validateFields(async (err, values) => {
      if (!err) {
        try {
          await login(values.username, values.password)
        } catch (e) {
          setValidateStatus({
            username: { validateStatus: "error", help: "" },
            password: { validateStatus: "error", help: "Invalid username or password!" }
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