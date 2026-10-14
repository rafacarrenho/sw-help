import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceDirectory = join(projectRoot, 'public/images/runes');
const outputDirectory = join(sourceDirectory, 'gold');
const excludedPrefixes = ['bg_', 'rune'];

const filenames = (await readdir(sourceDirectory))
  .filter(
    (filename) =>
      filename.endsWith('.png') &&
      !excludedPrefixes.some((prefix) => filename.startsWith(prefix)),
  )
  .sort();

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  for (const filename of filenames) {
    await page.goto(pathToFileURL(join(sourceDirectory, filename)).href);

    const dataUrl = await page.evaluate(() => {
      const image = document.querySelector('img');
      if (!(image instanceof HTMLImageElement)) {
        throw new Error('Rune set image was not loaded');
      }

      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas context is unavailable');

      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] === 0) continue;

        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
        if (luminance <= 70) continue;

        const blend = Math.min(1, Math.max(0, (luminance - 70) / 105));
        const shade = 0.58 + (luminance / 255) * 0.42;
        const gold = [245 * shade, 182 * shade, 54 * shade];

        pixels[index] = Math.round(red * (1 - blend) + gold[0] * blend);
        pixels[index + 1] = Math.round(green * (1 - blend) + gold[1] * blend);
        pixels[index + 2] = Math.round(blue * (1 - blend) + gold[2] * blend);
      }

      context.putImageData(imageData, 0, 0);
      return canvas.toDataURL('image/png');
    });

    await writeFile(
      join(outputDirectory, filename),
      Buffer.from(dataUrl.split(',')[1], 'base64'),
    );
  }
} finally {
  await browser.close();
}

console.log(`Generated ${filenames.length} gold rune set assets.`);
