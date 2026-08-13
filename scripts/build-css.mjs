import fs from 'fs';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const input = 'styles/globals.css';
const output = 'app/compiled.css';

const css = fs.readFileSync(input, 'utf8');

postcss([tailwindcss])
  .process(css, { from: input, to: output })
  .then(result => {
    fs.writeFileSync(output, result.css);
    console.log('✅ Tailwind CSS compiled successfully!');
  })
  .catch(err => {
    console.error('❌ Error compiling CSS:', err);
    process.exit(1);
  });
