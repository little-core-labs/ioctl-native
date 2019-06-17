let include = ' -I /usr/local/include/node -I' . getcwd() . '/node_modules/napi-macros'
let g:ale_c_clang_options .= include
let g:ale_c_gcc_options .= include
