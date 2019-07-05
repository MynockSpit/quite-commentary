# Quite Commentary

Yes, quite.

## Developing

1. Create a `.env` file and set the `MONGODB_URI` and `SESSION_SECRET` environment variables.
2. run `npm run dev-server`. This will start the development server w/ a reload each time a server file changes.
3. run `npm run dev-build` This will start parcel in watch mode, rebuilding the static assets each time a file referenced changes.

The local environment is hosted at [localhost:3000](http://localhost:3000).

## TODO

Service:
- Add SSL (b/c password over http is bad)

Code:
- Expand on users (profiles, name, image, bio, etc,.)
- Allow self-deletion of users
- Expand post capabilities (i.e. likes/reactions, images, links, markdown, threads)
  - [threads] Currently there's no difference internally between posts and replies. The UI only shows posts and their immediate replies. It is technically possible to reply to a reply, but that won't show up in the UI.
- Allow self-deletion of user's posts
- Searching posts
