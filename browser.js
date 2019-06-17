const assert = require('assert')

function ioctl(fd, request, data) {
  assert(0, 'ioctl(...) is not supported in the browser')
}

module.exports = ioctl
