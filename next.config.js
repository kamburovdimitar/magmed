const { withRNVNext } = require('@rnv/adapter');

/** @type {import('next').NextConfig} */
const config = {
    compress: false,

    experimental: {
        esmExternals: 'loose'
    },

    transpilePackages: [
        'react-native-chart-kit',
        'react-native-svg'
    ]
};

module.exports = withRNVNext(config);