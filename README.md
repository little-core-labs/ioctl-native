ioctl-native
============

A simple N-API native node module for the ioctl function

## Installation

```sh
$ npm install ioctl-native
```

## Usage

```js
const ioctl = require('ioctl-native'
rc = ioctl(fd, request, argp)
```

## API

### `rc = ioctl(fd, request, argp)`

Issue a request to a device specified by the file descriptor `fd` with
an argument poinrter `argp` that should be an instance of a `Buffer`.

_Below is an example request to **get the number of bytes in the
input buffer**:_

```js
const FIONREAD = 0x541b
const status = Buffer.alloc(4) // 32 bit int (little endian)
const fd = getSocketFileDescriptor()

assert(0 === ioctl(fd, FIONREAD, status))

const pendingReads = status.readInt32LE(0)
```

## Example

The following is an [example](example.js) that creates two sockets, one
that is bound to an address and port, and the other that writes a
`hello` message of length `5`. The example queries the pending number of
bytes in the input buffer for the _reader socket_ (`sockets.reader`) and
logs it out.

```js
const assert = require('assert')
const dgram = require('dgram')
const ioctl = require('ioctl-native')
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
```

## License

MIT
