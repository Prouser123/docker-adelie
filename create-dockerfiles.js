// Docker platforms: linux/amd64,linux/arm64,linux/riscv64,linux/ppc64le,linux/s390x,linux/386,linux/arm/v7,linux/arm/v6

// Dist platforms: x86_64, pmmx (x86_32) ppc64, ppc, aarch64 (arm64), armv7

/*
Mapping:



linux/amd64 | x86_64

linux/386 | pmmx

linux/[unknown] ppc64

linux/[unknown] | ppc

linux/arm64 | aarch64

linux/arm/v7 | armv7

*/


const arch = process.env.CHOSEN_ARCH || "x86_64"

const fs = require("fs")
const fetch = require("node-fetch")

const url = `https://distfiles.adelielinux.org/adelie/1.0/iso/rc2/adelie-rootfs-mini-${arch}-1.0-rc2.txz`;

// Make a directory for the arch
if (!fs.existsSync(arch)) fs.mkdirSync(arch);


// Fetch the mini root fs
fetch(url).then(res => {
  if (!res.ok)
    throw new Error(
      "unexpected response while fetching rootfs!\n" + res.statusText
    );
  const filename = url.split("/").slice(-1)[0];
  const dest = fs.createWriteStream(`${arch}/${filename}`);
  res.body.pipe(dest);

  // Create the dockerfile
  const dockerfile = `FROM scratch\nADD ${filename} /\nCMD [\"/bin/sh\"]\n`;
  fs.writeFileSync(`${arch}/Dockerfile`, dockerfile);
})