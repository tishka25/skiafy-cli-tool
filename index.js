#!/usr/bin/env node


import * as fs from 'fs/promises';
import { JSDOM } from 'jsdom';
import * as path from 'path';
import { ProcessSvg } from './skiafy.js';
import { changeExtension, getSvgs } from './utils.js';
const { document } = (new JSDOM('')).window;


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
        svgContainer.innerHTML = content;
        const svg = svgContainer.querySelector('svg');
        const skiaContent = ProcessSvg(svg, 1, 1, 0, 0, true);
        const skiaFilePath = path.join(outputdir, changeExtension(fileName, '.icon'));
        await fs.writeFile(skiaFilePath, skiaContent);
    }
    svgContainer.remove();
    //

})();
