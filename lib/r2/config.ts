import { S3Client } from "@aws-sdk/client-s3";

// Função para criar o client R2 sob demanda (lazy initialization)
function createR2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
  });
}

// Lazy singleton - criado apenas quando necessário
let _r2Client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!_r2Client) {
    _r2Client = createR2Client();
  }
  return _r2Client;
}

// Para manter compatibilidade, mas use getR2Client() quando possível
export const r2Client = {
  send: async (command: Parameters<S3Client["send"]>[0]) => {
    return getR2Client().send(command);
  },
};

// Getters para garantir que os valores são lidos no momento correto
export function getR2BucketName(): string {
  return process.env.R2_BUCKET_NAME || "";
}

export function getR2PublicUrl(): string {
  return process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
}

// Exportações para compatibilidade (serão avaliadas em runtime)
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
