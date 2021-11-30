#!/usr/bin/env node
import * as fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import * as path from 'path';
import { ProcessSvg } from './skiafy.js';
import { changeExtension, getSvgs } from './utils.js';
const { document } = (new JSDOM('')).window;
import { optimize } from 'svgo';



const inputdir = process.argv[2];
const outputdir = process.argv[3];

(async ()=>{
    console.log('Reading input dir:', path.resolve(inputdir));
    const all_content = await fs.readdir(inputdir);
    const filtered_content = getSvgs(all_content);
    console.log("SVGs: ", filtered_content);
    //
    // Create temporary svg
    const svgContainer = document.createElement('div');
    for(var fileName of filtered_content){
        const filePath = path.join(inputdir, fileName)
        const content = await fs.readFile(filePath);
        const optimizedContent = optimize(content, {
            // optional but recommended field
            path: filePath,
            // all config fields are also available here
            multipass: true,
          });
        svgContainer.innerHTML = optimizedContent.data;
        const svg = svgContainer.querySelector('svg');
        const skiaContent = ProcessSvg(svg, 1, 1, 0, 0, true);
        const skiaFileName = changeExtension(fileName, '.icon')
        const skiaFilePath = path.join(outputdir, skiaFileName);
        await fs.writeFile(skiaFilePath, skiaContent);
        console.log('Wrote file:', skiaFileName);
    }
    svgContainer.remove();
    //

})();
