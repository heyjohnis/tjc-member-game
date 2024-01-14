import { Form } from 'multiparty';
import { thumb } from 'node-thumbnail';
import jimp from 'jimp';
import path from 'path';

const pathDir = path.resolve('./resources/thumbnail');

const defaults = {
  prefix: '',
  suffix: '_thumb',
  digest: false,
  hashingType: 'sha1', // 'sha1', 'md5', 'sha256', 'sha512'
  width: 800,
  // concurrency: <num of cpus>,
  quiet: false, // if set to 'true', console.log status messages will be supressed
  overwrite: false,
  basename: undefined, // basename of the thumbnail. If unset, the name of the source file is used as basename.
  ignore: false, // Ignore unsupported files in "dest"
  logger: function(message) {
    console.log(message);
  }
};

export function thumbnail(req, res) {
  const form = new Form();
  form.parse(req, function( err, fields, files ) {
    if( err ){
      console.log(err);
    }

    Object.keys(fields).forEach(function(name) {
      console.log('got field named ' + name);
    });

    console.log("files:", files.null[0]);

    const fileInfo = files.null[0];
    const source = fileInfo.path;
    const basename = fields.fort_cust_no;
    const destination = pathDir;
    const extension = getExtentionName(fileInfo.originalFilename);
    thumb({
      basename,
      suffix:'_thumb',
      source,
      destination,
      width: 300,
      overwrite: true,
    }).then(function() {
      console.log('Success');
      convertPng2Jpg(basename, extension);
      res.sendStatus(200)
    }).catch(function(e) {
      console.log('Error', e.toString());
      res.sendStatus(500);
    });
  });
}

function getExtentionName(filename) {
  const ext = filename.split('.');
  return ext[ext.length -1];
}

function convertPng2Jpg(basename, extension) {
  console.log("convertPng2Jpg");
  jimp.read(`${pathDir}/${basename}_thumb.${extension}`, function( err, image) {
    image.write(`${pathDir}/${basename}_thumb.${extension == 'jpg' ? 'png' : 'jpg'}`);
  });
}
