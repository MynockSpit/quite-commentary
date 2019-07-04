/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { useEffect, useState } from 'react'
import { List, Icon } from 'antd';
import 'antd/dist/antd.css';

import { getPosts } from './service'

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

export const CommentList = () => {
  const [posts, setPosts] = useState([])

  async function updatePosts() {
    const posts = await getPosts()
    setPosts(posts)
  }

  useEffect(() => { updatePosts() }, [])

  return (
    <List
      itemLayout="vertical"
      size="medium"
      css={css`
        padding: 20px;
      `}
      pagination={{ pageSize: 5 }}
      dataSource={posts}
      header={
        <>hi</>
      }
      footer={
        <div>
          <b>ant design</b> footer part
        </div>
      }
      renderItem={item => (
        <List.Item
          key={item.id}
          actions={[
            <IconText type="star-o" text="156" />,
            <IconText type="like-o" text="156" />,
            <IconText type="message" text="2" />,
          ]}
        >
          <List.Item.Meta
            title={<a href={item.href}>{item.author}</a>}
            description={item.message}
          />
        </List.Item>
      )}
    />
  )
}