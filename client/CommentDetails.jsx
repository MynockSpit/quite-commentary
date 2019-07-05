/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, { useEffect } from 'react'
import { List } from 'antd';

import { getPostDetails, getPosts } from './service'

import { Store } from './store'

import PostComment from './PostComment'
import ListItem from './ListItem'
import { navigate } from '@reach/router';

export const CommentDetails = ({ postid }) => {
  const { user, posts, selectedPost, replies } = Store.use()

  useEffect(() => { getPosts() }, [])
  useEffect(() => { if (selectedPost) getPostDetails(selectedPost) }, [selectedPost])

  if (selectedPost !== postid) {
    Store.set({ selectedPost: postid })
    return null
  } else {
    if (!posts || posts.length === 0) {
      navigate('/')
      return null
    }
  }

  let selectedPostData = posts.find(post => post._id === selectedPost)

  return (
    <>
      <ListItem item={selectedPostData} noselect />
      {user ? <PostComment replyTo={selectedPost} /> : null}
      <List
        itemLayout="vertical"
        size="medium"
        css={css`
        padding: 20px;
      `}
        pagination={{ pageSize: 20 }}
        dataSource={replies[selectedPostData._id] || []}
        renderItem={item => <ListItem item={item} noselect />}
      />
    </>
  )
}

export default CommentDetails
