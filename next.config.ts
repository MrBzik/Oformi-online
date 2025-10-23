import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-04efe95d45bd4146859f5d9a51d31283.r2.dev",
                pathname: "/**",
            },
        ],
    },
};

export default withPayload(nextConfig);
