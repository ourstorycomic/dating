import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const maxDuration = 300; // 5 minutes max duration on Vercel Pro, ignored locally

export async function POST(req: Request) {
  try {
    const { componentKey, customData, quality } = await req.json();

    if (!componentKey || !customData) {
      return NextResponse.json({ error: "Missing componentKey or customData" }, { status: 400 });
    }

    // Determine absolute path to Remotion Root
    const rootPath = path.resolve(process.cwd(), "remotion/Root.tsx");
    if (!fs.existsSync(rootPath)) {
      return NextResponse.json({ error: "Remotion root not found" }, { status: 500 });
    }

    // Output directory
    const outputDir = path.resolve(process.cwd(), "public/renders");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Temp directory for props
    const tempDir = path.resolve(process.cwd(), "tmp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const uniqueId = crypto.randomBytes(8).toString("hex");
    const outputFileName = `render-${uniqueId}.mp4`;
    const outputPath = path.join(outputDir, outputFileName);
    const propsPath = path.join(tempDir, `props-${uniqueId}.json`);

    // Workaround for Remotion Webpack failing to serve filenames with spaces/UTF-8 on Windows
    let processedCustomData = { ...customData };
    const tmpAssetsDir = path.resolve(process.cwd(), "public/renders/tmp_assets");
    if (!fs.existsSync(tmpAssetsDir)) fs.mkdirSync(tmpAssetsDir, { recursive: true });

    const sanitizeUrls = (obj: any): any => {
      if (typeof obj === "string" && (obj.startsWith("/assets/") || obj.startsWith("/uploads/"))) {
        try {
          const decodedUrl = decodeURIComponent(obj);
          // If it contains spaces or non-ASCII characters
          if (/[^\x20-\x7E]/.test(decodedUrl) || decodedUrl.includes(" ")) {
            const sourcePath = path.join(process.cwd(), "public", decodedUrl.replace(/\//g, path.sep));
            if (fs.existsSync(sourcePath)) {
              const ext = path.extname(sourcePath);
              const safeName = crypto.randomBytes(8).toString("hex") + ext;
              const destPath = path.join(tmpAssetsDir, safeName);
              fs.copyFileSync(sourcePath, destPath);
              return `/renders/tmp_assets/${safeName}`;
            }
          }
        } catch (e) {
          console.error("Failed to sanitize URL", obj, e);
        }
        return obj;
      }
      if (Array.isArray(obj)) return obj.map(sanitizeUrls);
      if (typeof obj === "object" && obj !== null) {
        const newObj: any = {};
        for (const key in obj) newObj[key] = sanitizeUrls(obj[key]);
        return newObj;
      }
      return obj;
    };
    
    processedCustomData = sanitizeUrls(processedCustomData);

    // Write props to a file to avoid Windows escaping issues
    fs.writeFileSync(propsPath, JSON.stringify({ customData: processedCustomData }), "utf-8");

    console.log("Starting CLI render video...");
    
    // Run Remotion CLI
    let command = `npx remotion render "${rootPath}" ${componentKey} "${outputPath}" --props="${propsPath}"`;
    if (quality === "4K") {
      command += ` --scale=2 --jpeg-quality=100 --video-bitrate=20M`;
    } else {
      command += ` --jpeg-quality=90`; // Default to slightly better JPEG quality for FHD too
    }
    
    const { stdout, stderr } = await execAsync(command, { 
      maxBuffer: 1024 * 1024 * 10,
      env: {
        ...process.env,
        TMP: tempDir,
        TEMP: tempDir
      }
    }); // 10MB buffer for logs
    
    console.log("Render stdout:", stdout);
    if (stderr) {
      console.warn("Render stderr:", stderr);
    }

    // Cleanup props file
    try {
      fs.unlinkSync(propsPath);
    } catch (e) {
      // Ignore
    }

    console.log("Render completed:", outputPath);
    return NextResponse.json({ url: `/renders/${outputFileName}` });
  } catch (error: any) {
    console.error("Render error:", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
