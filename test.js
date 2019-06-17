const dgram = require('dgram')
const ioctl = require('./')
const test = require('tape')
const fs = require('fs')

const FIONREAD = 0x541b

test('rc = ioctl(fd, request, argp)', (t) => {
  t.throws(() => ioctl(), Error)
  t.throws(() => ioctl(32), Error)
  t.throws(() => ioctl(32), Error)
  t.throws(() => ioctl(32, 0), Error)
  t.throws(() => ioctl(32, 0, null), Error)
  t.throws(() => ioctl(32, 0, Buffer.alloc(0)), Error)

  const hello = Buffer.from('hello')
  const status = Buffer.alloc(4) // 32 bit int (little endian)
  const sockets = {
    reader: dgram.createSocket('udp4'),
    writer: dgram.createSocket('udp4'),
  }

  sockets.reader.bind(0, (err) => {
    t.error(err)
    const { address, port } = sockets.reader.address()
    sockets.writer.send(hello, 0, hello.length, port, address, (err) => {
      t.error(err)
      try {
        t.equal(0, ioctl(sockets.reader._handle.fd, FIONREAD, status),
          'ioctl() return bad return code')
        t.equal(hello.length, status.readInt32LE(0))
        sockets.reader.close()
        sockets.writer.close()
        t.end()
      } catch (err) {
        t.error(err)
      }
    })
  })
})
