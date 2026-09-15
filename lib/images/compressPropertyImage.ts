export async function compressPropertyImage(
  file: File
): Promise<File> {
  const MAX_WIDTH = 1600;
  const MAX_HEIGHT = 1200;
  const QUALITY = 0.78;

  if (
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  const bitmap = await createImageBitmap(file);

  let width = bitmap.width;
  let height = bitmap.height;

  const scale = Math.min(
    1,
    MAX_WIDTH / width,
    MAX_HEIGHT / height
  );

  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    throw new Error("Unable to process property image.");
  }

  context.drawImage(bitmap, 0, 0, width, height);

  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
        } else {
          reject(
            new Error("Unable to compress property image.")
          );
        }
      },
      "image/webp",
      QUALITY
    );
  });

  const originalName = file.name.replace(/\.[^.]+$/, "");

  return new File(
    [blob],
    `${originalName}.webp`,
    {
      type: "image/webp",
      lastModified: Date.now(),
    }
  );
}