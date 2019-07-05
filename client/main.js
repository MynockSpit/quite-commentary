import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css';

import { Layout } from 'antd';
const { Content, Footer } = Layout

import Header from './Header'
import { CommentList } from './CommentList'

const App = () => {
  return <> 
    <Layout>
      <Header />
      <Content style={{ padding: '0 50px' }}>
        <CommentList />
      </Content>
      <Footer style={{ textAlign: 'center' }}>Quite Commentary ©2018 Nathaniel Hutchins</Footer>
    </Layout>
  </>
}

ReactDOM.render(
  <App />,
  document.querySelector('#root'),
)