const s3PubEndpoint = "https://pub-04efe95d45bd4146859f5d9a51d31283.r2.dev/oformi-online/"

export function imageNameToSrc(imageName: string | null | undefined) {
    if(!imageName) return null;
    return s3PubEndpoint + imageName
}