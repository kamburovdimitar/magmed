const { withRNVNext } = require('@rnv/adapter');

/** @type {import('next').NextConfig} */
const config = {
    compress: false,

    experimental: {
        esmExternals: 'loose'
    },

    transpilePackages: [
        'react-native',
        'react-native-web',        
        'react-native-chart-kit',
        'react-native-svg'
    ],

    webpack: (config) => {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            'react-native$': 'react-native-web',
        };

        return config;
    }
};

module.exports = withRNVNext(config);