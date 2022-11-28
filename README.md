# Holocron

A document-based database ORM for TypeScript, inspired by [Prisma](https://github.com/prisma/prisma)

## Installation

```sh
# npm
npm install holocron-db

# yarn
yarn add holocron-db

# pnpm
pnpm install holocron-db
```

## Usage

```typescript
import { createCollection } from "holocron-db/firestore"

const db = {
    users: createCollection("users"),
    posts: createCollection("posts"),
}

let allUsers = await db.users.findMany()

let filteredPosts = await db.posts.findMany({
    where: {
        title: "Join us for Arbor Day 2023!",
    },
})

await db.users.create({
    data: {
        name: "Alice",
        email: "alice@gmail.com",
    },
})

await db.posts.update({
    where: { id: "42" },
    data: { published: true },
})
```

## License

Published under the [MIT License](./LICENSE).
