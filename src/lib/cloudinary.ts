import "server-only";

import {
  v2 as cloudinary,
} from "cloudinary";

let configured = false;

function requireEnvironmentVariable(
  name: string,
) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} no está configurada`,
    );
  }

  return value;
}

export function getCloudinary() {
  if (configured) {
    return cloudinary;
  }

  cloudinary.config({
    cloud_name:
      requireEnvironmentVariable(
        "CLOUDINARY_CLOUD_NAME",
      ),

    api_key:
      requireEnvironmentVariable(
        "CLOUDINARY_API_KEY",
      ),

    api_secret:
      requireEnvironmentVariable(
        "CLOUDINARY_API_SECRET",
      ),

    secure: true,
  });

  configured = true;

  return cloudinary;
}

export function getCloudinaryPublicConfig() {
  return {
    cloudName:
      requireEnvironmentVariable(
        "CLOUDINARY_CLOUD_NAME",
      ),

    apiKey:
      requireEnvironmentVariable(
        "CLOUDINARY_API_KEY",
      ),
  };
}

export function signCloudinaryUpload(
  parameters: Record<
    string,
    string | number
  >,
) {
  const apiSecret =
    requireEnvironmentVariable(
      "CLOUDINARY_API_SECRET",
    );

  return getCloudinary()
    .utils.api_sign_request(
      parameters,
      apiSecret,
    );
}