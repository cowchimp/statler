[![npm](https://img.shields.io/npm/v/statler.svg)](https://www.npmjs.com/package/statler)

# statler

Yet another statistics helper library

## Usage

### Histogram

```javascript
import { Histogram } from 'statler';

const histogram = new Histogram(
  { multiple: 50 },
  [151, 98, 159]
);

console.log(histogram.toJSON());
// [
//   [ 100, 1 ],
//   [ 150, 2 ]
// ]
```

Alternatively, you can call `toCSV()`
(this is handy to write to file, open in Excel, and generate a graph quickly)

```javascript
const histogram = new Histogram(
  { multiple: 50 },
  [151, 98, 159]
);

console.log(histogram.toCSV());
// bucket,count
// 100,1
// 150,2
```

You can keep adding data to an existing histogram

```javascript
const histogram = new Histogram({
  multiple: 50,
}, [151]);
histogram.push([98, 159]);

console.log(histogram.toJSON());
// [
//   [ 100, 1 ],
//   [ 150, 2 ]
// ]
```

You can have multiple series (or categories)

```javascript
const histogram = new Histogram(
  { multiple: 50 },
  {
    cat1: [102, 149, 53],
    cat2: [98, 151, 159]
  }
);

console.log(histogram.toJSON());
// [
//   [ 50, { cat1: 1, cat2: 0 } ],
//   [ 100, { cat1: 1, cat2: 1 } ],
//   [ 150, { cat1: 1, cat2: 2 } ]
// ]
```

## Running tests

Run tests with `npm test`

## License

MIT
