#include <napi-macros.h>
#include <node_api.h>
#include <string.h>
#include <stdio.h>
#include <errno.h>

#ifndef _WIN32
#include <sys/ioctl.h>
#endif

#define STRING(n) #n
#define CODE(n) ({        \
  char code[4];           \
  sprintf(code, "%d", n); \
  (code);                 \
})

NAPI_METHOD(napi_ioctl) {
  NAPI_ARGV(3);
  int rc = 0;

  if (argc < 3) {
    NAPI_STATUS_THROWS(napi_throw_error(
      env,
      NULL,
      "Unsufficient arguments provided. Expected " STRING(3)));
    return NULL;
  }

  NAPI_ARGV_INT32(fd, 0);
  NAPI_ARGV_UINT32(request, 1);
  NAPI_ARGV_BUFFER_CAST(void *, argp, 2);

#ifndef _WIN32
  rc = ioctl(fd, request, argp);
#endif

  if (-1 == rc) {
    NAPI_STATUS_THROWS(napi_throw_error(
      env,
      CODE(errno),
      (const char *) strerror(errno)));
  }

  NAPI_RETURN_INT32(rc);
}

NAPI_INIT() {
	napi_value napi_ioctl_function;

	NAPI_STATUS_THROWS(napi_create_function(
		env,
		"ioctl",
		NAPI_AUTO_LENGTH,
		napi_ioctl,
		NULL,
		&napi_ioctl_function));

	NAPI_STATUS_THROWS(napi_set_named_property(
    env,
    exports,
    "ioctl",
		napi_ioctl_function));
}
