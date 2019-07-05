import { Store } from './store'

async function call(...args) {
   let response = await fetch(...args)
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

   return posts
}