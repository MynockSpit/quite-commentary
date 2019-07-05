const express = require('express');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const { MongoClient, ObjectID } = require('mongodb')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const path = require('path')

const SafeObjectID = (id) => {
  try {
    return ObjectID(id)
  } catch (e) {
    id
  }
}

// the login code used when calling passport.authenticate('local')
passport.use(new Strategy(
  async function (username, password, cb) {
    let user = await db.collection('users').findOne({ username })

    // if there's no user, make sure the password CAN'T match
    let passwordHash = user && user.password || `${password}_fake`

    // still run this so we get constant time
    let correctPassword = await bcrypt.compare(password, passwordHash)

    if (user && correctPassword) {
      return cb(null, user)
    }

    return cb(null, false)
  }))


// for restoring from sessions
passport.serializeUser((user, cb) => cb(null, user._id))
passport.deserializeUser(async (id, cb) => {
  try {
    let user = await db.collection('users').findOne({ _id: SafeObjectID(id) })
    cb(null, user)
  } catch (e) {
    cb(null, false)
  }
})

const app = express()
let db // make the db variable

// body parser for actually getting the body b/c it's not default (ugh)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// for recalling from sessions
app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))

// now we init passport
app.use(passport.initialize())
app.use(passport.session())

// Define routes.

// register, then immediately log in
app.post('/register',
  async function (req, res, next) {
    let { username, password } = req.body

    let userExists = await db.collection('users').findOne({ username })

    if (userExists)
      return res.status(400).send('User already exists.')

    let passwordHash = await bcrypt.hash(password, 8)

    await db.collection('users').insertOne({ username, password: passwordHash })

    next()
  },
  passport.authenticate('local'),
  async function (req, res) {
    let user = await db.collection('users')
      .findOne({ _id: SafeObjectID(req.session.passport.user) })

    delete user.password

    return res.status(200).send(user)
  })

app.post('/login',
  passport.authenticate('local'),
  async function (req, res) {
    let user = await db.collection('users')
      .findOne({ _id: SafeObjectID(req.session.passport.user) })

    delete user.password

    return res.status(200).send(user)
  })

app.get('/logout',
  function (req, res) {
    req.logout()
    res.redirect('/')
  })

// app.post('/delete', 
//   passport.authenticate('local', { failureRedirect: '/login' }),
//   function (req, res) {
//     req.logout()
//     res.redirect('/')
//   })

// get all parent posts
app.get('/posts', async (req, res) => {
  let rootPosts = await db.collection('posts')
    .find({ parentId: { $exists: false } })
    .toArray()

  let authors = {}

  for (let i = rootPosts.length; i--;) {
    let post = rootPosts[i]
    let authorId = post.author
    if (!authors[authorId]) {
      let author = await db.collection('users').findOne({ _id: SafeObjectID(authorId) })
      authors[authorId] = author.username
    }
    post.author = authors[authorId]
  }

  res.status(200).send(rootPosts)
})

// create a new parent post
app.post('/posts',
  passport.authenticate('local', { failureRedirect: '/login' }),
  async (req, res) => {
    const { message } = req.body

    const post = {
      author: req.session.passport.user,
      message,
      time: new Date()
    }

    // interestingly, defining a variable and doing it this way modifies the object
    await db.collection('posts').insertOne(post)

    res.status(200).send(post)
  }
)

// get parent post and sub-posts
app.get('/posts/:postid', async (req, res) => {
  const { postid } = req.params

  const [rootPost, nestedPosts] = await Promise.all([
    db.collection('posts').findOne({ _id: SafeObjectID(postid) }),
    db.collection('posts').find({ parentId: { $eq: SafeObjectID(postid) } }).toArray()
  ])

  if (rootPost) {

    rootPost.replies = nestedPosts

    let authors = {}

    let allPosts = [].concat(rootPost, nestedPosts)

    for (let i = allPosts.length; i--;) {
      let post = allPosts[i]
      let authorId = post.author
      if (!authors[authorId]) {
        let author = await db.collection('users').findOne({ _id: SafeObjectID(authorId) })
        authors[authorId] = author.username
      }
      post.author = authors[authorId]
    }

    res.status(200).send(rootPost)
  } else {
    // res.status(400).send({ message: `Post w/ id (${postid}) doesn't exist.` })
    res.status(400).send(`Post w/ id (${postid}) doesn't exist.`)
  }
})

// create new subpost
app.post('/posts/:postid',
  passport.authenticate('local', { failureRedirect: '/login' }),
  async (req, res) => {
    const { message } = req.body
    const { postid } = req.params

    const post = {
      author: req.session.passport.user,
      message,
      time: new Date(),
      parentId: SafeObjectID(postid)
    }

    await db.collection('posts').insertOne(post)

    res.status(200).send(post)
  }
)

// anything to /dist should be passed to /dist
app.use('/dist', express.static('dist'))

// any other gets should be passed the index
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
})

// anything that doesn't fall into those categories should 404
app.use((req, res) => {
  // note: if you ever 403 on any resource, you probably never want to 404
  // that'll allow an attacker to find resources that don't exist
  // we're never (intentionally 403ing), so it doesn't matter
  res.sendStatus(404)
})

// app.use(function (req, res) {
//   console.log(path.resolve(__dirname, '../dist/index.html'))
//   let index = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'))

//   // res.set('Content-Type', 'text/html');
//   res.status(200).send(index)
// })

MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
  if (err) return console.log(err)

  db = client.db('heroku_nxstfg7q')

  app.listen(3000, () => {
    console.log('Listening on http://localhost:3000...')
  })
})
