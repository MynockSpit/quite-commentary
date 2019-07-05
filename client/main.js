import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from "@reach/router"
import 'antd/dist/antd.css'

import { Layout } from 'antd'
const { Content, Footer } = Layout

import Header from './Header'
import CommentList from './CommentList'
import CommentDetail from './CommentDetails'

import { Store } from './store'

const App = () => {
  return <Store> 
    <Layout>
      <Header />
      <Content style={{ padding: '0 50px' }}>
        <Router>
          <CommentList path="/" />
          <CommentDetail path="/:postid" />
        </Router>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Quite Commentary ©2018 Nathaniel Hutchins</Footer>
    </Layout>
  </Store>
}

ReactDOM.render(
  <App />,
  document.querySelector('#root'),
)