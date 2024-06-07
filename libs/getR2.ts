import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import S3 from "aws-sdk/clients/s3";

export const s3Client = new S3Client({
	region: process.env.REGION!,
	endpoint: `https://${process.env.ACCOUNT_CLOUDFLARE}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.ACCESS_KEY_ID!,
		secretAccessKey: process.env.SECRET_ACCESS_KEY!,
	},
});

export const getR2 = async ({ fileName }: { fileName: string }) => {
	const result = await getSignedUrl(
		s3Client,
		new GetObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: fileName }),
		{ expiresIn: 3600 }
	);

	return result;
};
