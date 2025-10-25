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
  // {
  //   type: 'Round Braces',
  //   characters: ['(', ')'],
  // },
];

// Find placeholders like {name} - handle nested brackets in pluralization
function extractPlaceholders(text: string): string[] {
  const placeholders: string[] = [];
  let i = 0;

  while (i < text.length) {
    if (text[i] === '{') {
      let braceCount = 1;
      let j = i + 1;

      // Find the matching closing brace, handling nested braces
      while (j < text.length && braceCount > 0) {
        if (text[j] === '{') braceCount++;
        if (text[j] === '}') braceCount--;
        j++;
      }

      if (braceCount === 0) {
        const fullPlaceholder = text.substring(i, j);
        // Extract just the variable name (first word after {)
        const match = fullPlaceholder.match(/^{\s*(\w+)/);
        if (match) {
          placeholders.push(`{${match[1]}`);
        }
      }
      i = j;
    } else {
      i++;
    }
  }

  return placeholders;
}

function isFalsePositive(keyPath: string, charGroupType: string, want: number, found: number): boolean {
 if (
   ['Remote.popup', 'StorageWarning.usageWarning'].includes(keyPath) &&
   charGroupType === 'Single quotationmarks' &&
   want === 1 &&
   found === 0
 ) {
   return true;
 }

 return false;
}

function compareStrings(sourceValue: string, testValue: string, keyPath: string): boolean {
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
    if (
      sourceTotal !== testTotal &&
      !isFalsePositive(keyPath, charGroup.type, sourceTotal, testTotal)
    ) {
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

  const sourcePlaceholders = extractPlaceholders(sourceValue);
  const testPlaceholders = extractPlaceholders(testValue);

  // Compare placeholder arrays
  const missingInTest = sourcePlaceholders.filter(p => !testPlaceholders.includes(p));
  const extraInTest = testPlaceholders.filter(p => !sourcePlaceholders.includes(p));

  if (missingInTest.length > 0 || extraInTest.length > 0) {
    if (!hasErrors) {
      console.log(`Mismatch at ${keyPath}:`);
      console.log(`  Source: ${sourceValue}`);
      console.log(`  Test: ${testValue}`);
      hasErrors = true;
    }

    if (missingInTest.length > 0) {
      console.log(`  Missing placeholders: ${missingInTest.join(', ')}`);
    }
    if (extraInTest.length > 0) {
      console.log(`  Extra placeholders: ${extraInTest.join(', ')}`);
    }
  }

  if (hasErrors) {
    console.log('---');
    return true;
  }

  return false;
}

/**
 * Recursively traverse and compare nested message objects
 */
function deepCompare(source: Messages, test: Messages, keyPath: string = '', totalMismatches: number = 0): number {
  // Get all unique keys from both objects
  const allKeys = new Set([...Object.keys(source), ...Object.keys(test)]);

  for (const key of allKeys) {
    const currentPath = keyPath ? `${keyPath}.${key}` : key;
    const sourceValue = source[key];
    const testValue = test[key];

    // Check if key exists in both objects
    if (!(key in source)) {
      console.log(`Missing key in source: ${currentPath}`);
      totalMismatches++;
      continue;
    }

    if (!(key in test)) {
      console.log(`Missing key in test: ${currentPath}`);
      totalMismatches++;
      continue;
    }

    // Both values are strings - compare them
    if (typeof sourceValue === 'string' && typeof testValue === 'string') {
      if (compareStrings(sourceValue, testValue, currentPath)) {
        totalMismatches++;
      }
    }
    // Both values are objects - recurse deeper
    else if (typeof sourceValue === 'object' && typeof testValue === 'object') {
      totalMismatches = deepCompare(sourceValue, testValue, currentPath, totalMismatches);
    }
    // Type mismatch
    else {
      console.log(`Type mismatch at ${currentPath}:`);
      console.log(`  Source type: ${typeof sourceValue}`);
      console.log(`  Test type:   ${typeof testValue}`);
      totalMismatches++;
    }
  }

  return totalMismatches;
}

const compareFiles = async (sourceFilePath: string, targetFilePath: string) => {
  console.log('\n\n---------------------------------');
  console.log(`comparing "${sourceFilePath}" with "${targetFilePath}"`);
  let source: Messages;
  let test: Messages;

  try {
    const sourceFileContent = await fs.readFile(sourceFilePath, { encoding: 'utf-8' });
    const testFileContent = await fs.readFile(targetFilePath, { encoding: 'utf-8' });

    source = JSON.parse(sourceFileContent);
    test = JSON.parse(testFileContent);
  } catch {
    console.log('cannot read/parse files');
    process.exit(1);
  }

  const totalMismatches = deepCompare(source, test);

  if (totalMismatches) {
    console.log(`Total mismatched messages: ${totalMismatches}`);
  } else {
    console.log('Messages match basic comparison!');
  }
};


let source: string;
let targets: string[];

if (process.argv.length !== 4) {
  source = './src/i18n/messages/en.json';
  targets = [
    './src/i18n/messages/de.json',
    './src/i18n/messages/es.json',
    './src/i18n/messages/fr.json',
    './src/i18n/messages/it.json',
    './src/i18n/messages/nl.json',
    './src/i18n/messages/no.json',
    './src/i18n/messages/pt.json',
    './src/i18n/messages/sv.json',
  ];
} else {
  source = process.argv[2];
  targets = [process.argv[3]];
}

for (const target of targets) {
  await compareFiles(source, target);
}
