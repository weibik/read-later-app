import { Hono } from 'hono'
import db from '../db/db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

const app = new Hono()

app.get('/healthcheck', (c) => {
  return c.json({ message: 'healthcheck' })
})

app.post('/register', async (c) => {
  const { username, password } = await c.req.json();
  const result = await db.select().from(users).where(eq(users.username, username))
  if (result.length === 0) {
    const hashed_password = await bcrypt.hash(password, 10);
    await db.insert(users).values({
      username: username,
      password: hashed_password
    })
    return c.json({ message: 'User successfully created' }, 201)
  }
  else {
    return c.json({ message: 'Username already exists' }, 409)
  }
})

app.post('login', async (c) => {
  const { username, password } = await c.req.json();
  const user_result = await db.select().from(users).where(eq(users.username, username))
  if (user_result.length > 0) {
    if (bcrypt.compare(password, hashed_password)) {
      return c.json({ message: 'Logged in succesfully' }, 200)
    }
    else {
      return c.json({ message: 'Username or password incorrect' }, 401)
    }
  }
  else {
      return c.json({ message: 'Username or password incorrect' }, 401)
  }
})

export default app
