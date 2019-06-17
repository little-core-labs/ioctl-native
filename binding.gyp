{
  'variables': {
    'target_arch%': '<!(node -pe "os.arch()")>'
  },

  'targets': [{
    'target_name': 'ioctl',

    'include_dirs' : [
      '<!(node -e \"require(\'napi-macros\')\")'
    ],

    'sources': [
      'index.c'
    ],

    'cflags': [ '-g', '-O3' ],

    'xcode_settings': {
      'OTHER_CFLAGS': [ '-g', '-O3' ]
    }
  }]
}
