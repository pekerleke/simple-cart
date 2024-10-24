import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        "name": "Simple Cart",
        "short_name": "SimpleCart",
        "description": "A simple way to manage sales",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#ffffff",
        "theme_color": "#000000",
        "icons": [
            {
                "src": "/192-logo.png",
                "sizes": "192x192",
                "type": "image/png"
            },
            {
                "src": "/512-logo.png",
                "sizes": "512x512",
                "type": "image/png"
            }
        ]
    }
}