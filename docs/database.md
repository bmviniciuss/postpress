# Database
We're running on a Postgres database thought the Prisma ORM.

## Tables

### User
#### Fields
- id
- displayName `nullable`
- email `unique`
- password
- image `nullable`

### User
#### Fields
- id
- title
- content
- userId `relation to user (one-to-many, a post has a single user and a user can have multiple posts)`
- published `Date`
- updated `Date`


