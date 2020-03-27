module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: true,
  devServer: {
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/test': {
      }
    }    
  }
}