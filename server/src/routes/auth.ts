import { Hono } from 'hono'
import db from '../db/db'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'

const app_auth = new Hono()

app_auth.get('/healthcheck', (c) => {
  return c.json({ message: 'healthcheck' })
})

app_auth.post('/register', async (c) => {
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

app_auth.post('/login', async (c) => {
  const { username, password } = await c.req.json();
  const user_result = await db.select().from(users).where(eq(users.username, username))
  if (user_result.length > 0) {
    if (await bcrypt.compare(password, user_result[0].password)) {
      const alg = 'HS256'
      const jwt = await new jose.SignJWT({ userId: user_result[0].id })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(new TextEncoder().encode(process.env.SECRET!))

      return c.json({ message: 'Logged in succesfully', jwt }, 200)
    }
    else {
      return c.json({ message: 'Username or password incorrect' }, 401)
    }
  }
  else {
      return c.json({ message: 'Username or password incorrect' }, 401)
  }
})

export default app_auth
