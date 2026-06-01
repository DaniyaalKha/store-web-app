/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { // list of whitelisted image sources for adding to products
    remotePatterns: [
      // stock image providers
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },

      { protocol: 'https', hostname: 'upload.wikimedia.org' },

      // PC hardware manufacturers
      { protocol: 'https', hostname: '*.asus.com' },
      { protocol: 'https', hostname: '*.msi.com' },
      { protocol: 'https', hostname: '*.gigabyte.com' },
      { protocol: 'https', hostname: '*.corsair.com' },
      { protocol: 'https', hostname: '*.coolermaster.com' },
      { protocol: 'https', hostname: '*.nzxt.com' },
      { protocol: 'https', hostname: '*.evga.com' },
      { protocol: 'https', hostname: '*.intel.com' },
      { protocol: 'https', hostname: '*.amd.com' },
      { protocol: 'https', hostname: '*.nvidia.com' },

      // international retailers
      { protocol: 'https', hostname: '*.neweggimages.com' },
      { protocol: 'https', hostname: '*.newegg.com' },
      { protocol: 'https', hostname: '*.microcenter.com' },
      { protocol: 'https', hostname: '*.amazon.com' },
      { protocol: 'https', hostname: '*.pccasegear.com' },
      { protocol: 'https', hostname: '*.media-amazon.com' },

      // Australian PC retailers
      { protocol: 'https', hostname: '*.scorptec.com.au' },
      { protocol: 'https', hostname: '*.centrecom.com.au' },
      { protocol: 'https', hostname: '*.mwave.com.au' },
      { protocol: 'https', hostname: '*.umart.com.au' },
      { protocol: 'https', hostname: '*.ple.com.au' },
      { protocol: 'https', hostname: '*.computeralliance.com.au' },
      { protocol: 'https', hostname: '*.jw.com.au' },
      { protocol: 'https', hostname: '*.bpctech.com.au' },
      { protocol: 'https', hostname: '*.pcbyte.com.au' },
      { protocol: 'https', hostname: '*.cplonline.com.au' },
      { protocol: 'https', hostname: '*.shoppingexpress.com.au' },
      { protocol: 'https', hostname: '*.austin.net.au' },
      { protocol: 'https', hostname: '*.skycomp.com.au' },
      { protocol: 'https', hostname: '*.techfast.com.au' },
    ],
  },
};

export default nextConfig;