module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '@/scss/_fonts.scss';
          @import '@/scss/_vars.scss';
          @import '@/scss/_root.scss';
        `,
      },
    },
  },
};
