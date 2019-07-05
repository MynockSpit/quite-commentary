/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React from 'react'
import { List, Icon } from 'antd';

import { navigate } from "@reach/router"

import { getPostDetails } from './service'
import { Store } from './store'

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
)

export const ListItem = ({ item, noselect }) => (
  <List.Item
    key={item._id}
    actions={[
      item.replyCount ? <IconText type="message" text={item.replyCount} /> : null,
    ]}
    {...(noselect ? {} : {
      onClick: async () => {
        await getPostDetails(item._id)
        Store.set({ selectedPost: item._id })
        navigate(`/${item._id}`)
      }
    })}
  >
    <List.Item.Meta
      title={item.author}
      description={<span css={css`&:hover { cursor: pointer; }`}>{item.message}</span>}
    />
  </List.Item>
)

export default ListItem