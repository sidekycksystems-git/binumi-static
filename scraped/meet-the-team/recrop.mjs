// Throwaway: top-biased 4:5 crop of the square source headshots, so heads sit
// with normal headroom without the heavy zoom a centered crop forced.
// Tune TOP/BOT, re-run: `node scraped/meet-the-team/recrop.mjs`
import sharp from 'sharp';

const TOP = 0.13; // fraction of height removed from the top (the headroom)
const BOT = 0.01; // fraction removed from the bottom
const SRC = 'scraped/meet-the-team/images';
const OUT = 'public/team';
const files = [
  ['anthony_new', 'anthony'], ['alexander', 'alexander'], ['nils', 'nils'],
  ['markus', 'markus'], ['stefan', 'stefan'], ['matthew', 'matthew'],
  ['archie', 'archie'], ['jenni', 'jenni'], ['arm', 'thanayu'],
];

for (const [src, dest] of files) {
  const img = sharp(`${SRC}/${src}.png`);
  const { width: N } = await img.metadata();
  const cropH = Math.round((1 - TOP - BOT) * N);
  const cropW = Math.round(0.8 * cropH);
  const left = Math.round((N - cropW) / 2);
  const top = Math.round(TOP * N);
  await sharp(`${SRC}/${src}.png`)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(512, 640)
    .jpeg({ quality: 80 })
    .toFile(`${OUT}/${dest}.jpg`);
  console.log(`${dest}: N=${N} crop ${cropW}x${cropH} @${left},${top}`);
}
