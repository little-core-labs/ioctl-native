const binding = require('node-gyp-build')(__dirname)
const assert = require('assert')

function ioctl(fd, request, argp) {
  assert('number' === typeof fd, 'Expecting fd to be a number')
  assert('number' === typeof request, 'Expecting request to be a number')
  assert(false === Number.isNaN(fd), 'fd cannot be NaN')
  assert(request >= 0, 'request must be >= 0')
  assert(Buffer.isBuffer(argp), 'argp must be a buffer')
  const rc = binding.ioctl(fd, request, argp)
  return rc
}

module.exports = ioctl
