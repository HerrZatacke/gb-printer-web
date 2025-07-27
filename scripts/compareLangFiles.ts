import fs from 'node:fs/promises';

interface Messages {
  [key: string]: Messages | string;
}

const compareCount = [
  {
    type: 'Single quotationmarks',
    characters: ['‚', '‘', '’', '‹', '›'],
  },
  {
    type: 'Double Quotationmarks',
    characters: ['„', '“', '”', '«', '»'],
  },
  {
    type: 'Curly Braces',
    characters: ['{', '}'],
  },
  {
    type: 'Round Braces',
    characters: ['(', ')'],
  },
];

let totalMismatches = 0;

function compareStrings(sourceValue: string, testValue: string, keyPath: string): void {
  let hasErrors = false;

  for (const charGroup of compareCount) {
    // Count occurrences of each character in the group for both strings
    let sourceTotal = 0;
    let testTotal = 0;

    for (const char of charGroup.characters) {
      // Count using split - number of parts minus 1 equals occurrences
      sourceTotal += sourceValue.split(char).length - 1;
      testTotal += testValue.split(char).length - 1;
    }

    // Check if totals match
    if (sourceTotal !== testTotal) {
      if (!hasErrors) {
        console.log(`Mismatch at ${keyPath}:`);
        console.log(`  Source: ${sourceValue}`);
        console.log(`  Test: ${testValue}`);
        hasErrors = true;
      }

      // const charList = charGroup.characters.map(c => `'${c}'`).join(', ');
      console.log(`  ${charGroup.type}: want=${sourceTotal}, found=${testTotal}`);
    }
  }

  if (hasErrors) {
    console.log('---');
    totalMismatches++;
  }
}

/**
 * Recursively traverse and compare nested message objects
 */
function deepCompare(source: Messages, test: Messages, keyPath: string = ''): void {
  // Get all unique keys from both objects
  const allKeys = new Set([...Object.keys(source), ...Object.keys(test)]);

  for (const key of allKeys) {
    const currentPath = keyPath ? `${keyPath}.${key}` : key;
    const sourceValue = source[key];
    const testValue = test[key];

    // Check if key exists in both objects
    if (!(key in source)) {
      console.log(`Missing key in source: ${currentPath}`);
      continue;
    }

    if (!(key in test)) {
      console.log(`Missing key in test: ${currentPath}`);
      continue;
    }

    // Both values are strings - compare them
    if (typeof sourceValue === 'string' && typeof testValue === 'string') {
      compareStrings(sourceValue, testValue, currentPath);
    }
    // Both values are objects - recurse deeper
    else if (typeof sourceValue === 'object' && typeof testValue === 'object') {
      deepCompare(sourceValue, testValue, currentPath);
    }
    // Type mismatch
    else {
      console.log(`Type mismatch at ${currentPath}:`);
      console.log(`  Source type: ${typeof sourceValue}`);
      console.log(`  Test type:   ${typeof testValue}`);
    }
  }
}

if (process.argv.length !== 4) {
  console.log('arguments: need two files');
  process.exit(1);
}

let source: Messages;
let test: Messages;

try {
  const sourceFileContent = await fs.readFile(process.argv[2], { encoding: 'utf-8' });
  const testFileContent = await fs.readFile(process.argv[3], { encoding: 'utf-8' });

  source = JSON.parse(sourceFileContent);
  test = JSON.parse(testFileContent);
} catch {
  console.log('cannot read/parse files');
  process.exit(1);
}

deepCompare(source, test);

if (totalMismatches) {
  console.log(`Total mismatched messages: ${totalMismatches}`);
}
