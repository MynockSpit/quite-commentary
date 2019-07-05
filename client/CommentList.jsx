/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { useEffect } from 'react'
import { List } from 'antd';

import { getPosts } from './service'

import { Store } from './store'

import PostComment from './PostComment'
import ListItem from './ListItem'

export const CommentList = (props) => {
  async function updatePosts() {
    await getPosts()
  }

  useEffect(() => { updatePosts() }, [])

  const { user, posts } = Store.use() 

  return (
    <List
      itemLayout="vertical"
      size="medium"
      css={css`
        padding: 20px;
      `}
      pagination={{ pageSize: 20 }}
      dataSource={posts}
      header={user ? <PostComment /> : null}
      renderItem={item => <ListItem item={item} />}
    />
  )
}

export default CommentList
