const assert = require('assert')
const dgram = require('dgram')
const ioctl = require('./')
const fs = require('fs')

const FIONREAD = 0x541b
const hello = Buffer.from('hello')
const status = Buffer.alloc(4) // 32 bit int (little endian)
const sockets = {
  reader: dgram.createSocket('udp4'),
  writer: dgram.createSocket('udp4'),
}

sockets.reader.bind(0, (err) => {
  const { address, port } = sockets.reader.address()

  sockets.writer.send(hello, 0, hello.length, port, address, (err) => {
    assert(0 === ioctl(sockets.reader._handle.fd, FIONREAD, status))
    const pending = status.readInt32LE(0)

    console.log('> %d bytes pending in reader socket', pending) // pending == hello.length

    sockets.reader.close()
    sockets.writer.close()
  })
})
