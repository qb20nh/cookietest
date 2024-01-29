import fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import { HTTP, equals } from '@/util'
import { allowedClientOrigins } from 'allowlist.json'

const server = fastify()

void server.register(cookie)

void server.register(cors, {
  origin: allowedClientOrigins,
  credentials: true
})

server.addHook('onRequest', (request, reply, done) => {
  const referer = request.headers.referer ?? ''
  if (referer === '') { return reply.code(HTTP.FORBIDDEN).send('⚠️ INVALID ORIGIN') }
  const refererUrl = new URL(referer)
  if (!allowedClientOrigins.some((allowedOrigin) => equals(allowedOrigin, refererUrl.origin))) { return reply.code(HTTP.FORBIDDEN).send('⚠️ INVALID ORIGIN') }
  done()
})

server.get('/login', async (request, reply) => {
  try {
    if ((request.cookies.token?.length ?? 0) > 0) {
      void reply.code(HTTP.CONFLICT).send('⚠️ Auth already set')
      return
    }

    const p = request.query as { httpOnly: 'true' | 'false', sameSite: 'lax' | 'strict' | 'none', secure: 'true' | 'false' }
    if (p.httpOnly === undefined || p.sameSite === undefined || p.secure === undefined) {
      void reply.code(HTTP.BAD_REQUEST).send('⚠️ Required fields missing')
      return
    }

    const httpOnly = JSON.parse(p.httpOnly)
    const sameSite = p.sameSite
    const secure = JSON.parse(p.secure)
    if (typeof httpOnly !== 'boolean' || !['lax', 'strict', 'none'].includes(sameSite) || typeof secure !== 'boolean') {
      void reply.code(HTTP.BAD_REQUEST).send('⚠️ Invalid flag value')
      return
    }

    void reply.code(HTTP.OK).cookie('token', 'secret', {
      httpOnly,
      sameSite,
      secure
    }).send('✅ Auth info set')
  } finally {
    void reply.code(HTTP.INTERNAL_SERVER_ERROR).send('❌ Internal server error')
  }
})

server.get('/verify', async (request, reply) => {
  if (request.cookies.token === 'secret') {
    void reply.code(HTTP.OK).send('✅✅✅ OK ✅✅✅')
  } else {
    void reply.code(HTTP.UNAUTHORIZED).send('❌❌❌ FAIL ❌❌❌')
  }
})

server.listen({ port: 8080 }, (err, address) => {
  if (err != null) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
