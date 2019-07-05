import { Store } from './store'
import _cloneDeep from 'lodash/cloneDeep'
import _set from 'lodash/set'
import _get from 'lodash/get'

async function call(resource, init) {
   try {
      if (typeof init.body === 'object') {
         init.body = JSON.stringify(init.body)
      }
   } catch (e) {
   }
   let response = await fetch(resource, init)
   let responseBackup = response.clone()

   if (response.ok === false) {
      throw new Error(response)
   }

   let body

   try {
      body = await response.json()
   } catch (error) {
      body = await responseBackup.text()
   }

   return {
      body,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      redirected: response.redirected,
      ok: response.ok,
      url: response.url,
      response: response
   }
}

export async function register(username, password) {
   try {
      let { body } = await call('/register', {
         headers: {
            "content-type": "application/json"
         },
         credentials: "include",
         method: 'POST',
         body: username ? JSON.stringify({ username, password }) : undefined
      })

      Store.set({ user: body })
      localStorage.setItem('user', JSON.stringify(body))
   } catch (e) {
      Store.set({ user: null })
      localStorage.removeItem('user')
   }
}

export async function login(username, password) {
   try {
      let { body } = await call('/login', {
         headers: {
            "content-type": "application/json"
         },
         credentials: "include",
         method: 'POST',
         body: username ? JSON.stringify({ username, password }) : undefined
      })

      Store.set({ user: body })
      localStorage.setItem('user', JSON.stringify(body))
   } catch (e) {
      Store.set({ user: null })
      localStorage.removeItem('user')
   }
}

export async function logout() {
   await call('/logout')
   localStorage.removeItem('user')
   Store.set({ user: null })
}

export async function getPosts() {
   let posts = await (await fetch('/posts')).json()
   Store.set({ posts })
   return posts
}

export async function getPostDetails(postId) {
   let detailedPost = await (await fetch(`/posts/${postId}`)).json()

   Store.set(state => {
      let newState = Object.assign({}, state)

      newState.replies = {
         ...newState.replies,
         [postId]: detailedPost.replies
      }

      return newState
   })
   return detailedPost
}

export async function newPost(message) {
   let { user } = Store.get()

   let REPLACE_ME_ID = `REPLACE_ME_ID_${+new Date()}`

   Store.set(state => {
      return setUsing(_cloneDeep(state), `posts`, posts => {
         posts.unshift({ _id: REPLACE_ME_ID, message, author: user.username })
         return posts
      })
   })

   let { body: confirmedPost } = await call(`/posts`, {
      method: "POST",
      headers: {
         "content-type": "application/json"
      },
      body: { message }
   })

   Store.set(state => {
      return setUsing(_cloneDeep(state), `posts`, posts =>
         posts.map(post => (post._id === REPLACE_ME_ID) ? confirmedPost : post)
      )
   })
}

export async function replyToPost(message, replyTo) {
   let { user } = Store.get()

   let REPLACE_ME_ID = `REPLACE_ME_ID_${+new Date()}`

   Store.set(state => {
      return setUsing(_cloneDeep(state), `replies.${replyTo}`, replies => {
         replies.unshift({ _id: REPLACE_ME_ID, message, author: user.username })
         return replies
      })
   })

   let { body: confirmedPost } = await call(`/posts/${replyTo}`, {
      method: "POST",
      headers: {
         "content-type": "application/json"
      },
      body: { message }
   })


   Store.set(state => {
      return setUsing(_cloneDeep(state), `replies.${replyTo}`, replies =>
         replies.map(reply => (reply._id === REPLACE_ME_ID) ? confirmedPost : reply)
      )
   })
}

function setUsing(object, path, fn) {
   return _set(object, path, fn(_get(object, path)))
}