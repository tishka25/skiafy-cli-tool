import * as path from 'path';

const IMAGE_EXTENSIONS = ['.svg'];

/**
 * 
 * @param {Array} input_files 
 * @returns 
 */
export function getSvgs(input_files) {
    return input_files.filter(el => {
        if (IMAGE_EXTENSIONS.includes(path.extname(el).toLowerCase())) {
            return el;
        }
    });
}

/**
 * 
 * @param {String} file 
 * @param {String} extension 
 * @returns 
 */
export function changeExtension(file, extension) {
    const basename = path.basename(file, path.extname(file))
    return path.join(path.dirname(file), basename + extension)
}