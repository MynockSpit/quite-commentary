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

export function login(username, password) {
   return call('/login', {
      headers: {
         "content-type": "application/json"
      },
      method: 'POST', 
      body: JSON.stringify({ username, password }) 
   })
}

export async function getPosts() {
   let posts = await (await fetch('/posts')).json()

   return posts
}