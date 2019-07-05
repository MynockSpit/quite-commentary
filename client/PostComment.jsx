/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React, {  useState } from 'react'
import {  Input, Button } from 'antd';

import { newPost, replyToPost } from './service'

export const PostComment = ({ replyTo, placeholder = "Got something to say?", button = "Say it!" }) => {
  const [focused, setFocused] = useState(true)
  const [value, setValue] = useState('')

  return (
    <>
      <Input.TextArea
        rows={focused ? 4 : 1}
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
      {focused && (
        <div css={css`
          text-align: right;
          margin-top: 20px;
        `}>
          <Button
            type="primary"
            onClick={() => {
              if (replyTo)
                replyToPost(value, replyTo)
              else
                newPost(value)
              setValue('')
            }}
          >
            {button}
          </Button>
        </div>
      )}
    </>
  )
}

export default PostComment