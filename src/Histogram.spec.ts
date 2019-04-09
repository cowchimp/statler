const {Histogram} = require('./Histogram');

describe('toJSON', () => {
  describe('single category', () => {
    it('should work with an array of numbers', () => {
      const data = [151, 98, 159];
      const expected = [
        [100, 1],
        [150, 2]
      ];

      const result = new Histogram(
        {multiple: 50},
        data
      ).toJSON();

      expect(result).toEqual(expected);
    });

    it('should work with an array of objects when passing a number selector', () => {
      const data = [{score: 151}, {score: 98}, {score: 159}];
      const expected = [
        [100, 1],
        [150, 2]
      ];

      const result = new Histogram(
        {
          multiple: 50,
          valueSelector: (x: { [score: string]: number }) => x.score
        },
        data
      ).toJSON();

      expect(result).toEqual(expected);
    });

    it('should let add values after construction', () => {
      const expected = [
        [100, 1],
        [150, 2]
      ];

      const histogram = new Histogram({
        multiple: 50,
      }, [151]);
      histogram.push([98, 159]);
      const result = histogram.toJSON();

      expect(result).toEqual(expected);
    });
  });

  describe('multiple categories', () => {
    it('should work with arrays of numbers', () => {
      const data = {
        cat1: [102, 149, 53],
        cat2: [98, 151, 159]
      };
      const expected = [
        [50, {cat1: 1, cat2: 0}],
        [100, {cat1: 1, cat2: 1}],
        [150, {cat1: 1, cat2: 2}]
      ];

      const result = new Histogram(
        {multiple: 50},
        data
      ).toJSON();

      expect(result).toEqual(expected);
    });

    it('should work with arrays of objects when passing a number selector', () => {
      const data = {
        cat1: [{score: 53}, {score: 102}, {score: 149}],
        cat2: [{score: 98}, {score: 151}, {score: 159}]
      };
      const expected = [
        [50, {cat1: 1, cat2: 0}],
        [100, {cat1: 1, cat2: 1}],
        [150, {cat1: 1, cat2: 2}]
      ];

      const result = new Histogram(
        {
          multiple: 50,
          valueSelector: (x: { [score: string]: number }) => x.score
        },
        data
      ).toJSON();

      expect(result).toEqual(expected);
    });

    it('should let add values after construction', () => {
      const expected = [
        [50, {cat1: 1, cat2: 0}],
        [100, {cat1: 1, cat2: 1}],
        [150, {cat1: 1, cat2: 2}]
      ];

      const histogram = new Histogram({
        multiple: 50,
      }, {
        cat1: [102],
        cat2: [98]
      });
      histogram.push({
        cat1: [149, 53],
        cat2: [151, 159]
      });
      const result = histogram.toJSON();

      expect(result).toEqual(expected);
    });
  });

  it('constructor without data should not explode', () => {
    const expected: [number, number][] = [];

    const result = new Histogram({
      multiple: 50
    }).toJSON();

    expect(result).toEqual(expected);
  });
});

describe('toCSV', () => {
  it('should work with single category', () => {
    const data = [151, 98, 159];
    const expected = `bucket,count
100,1
150,2`;

    const result = new Histogram(
      {multiple: 50},
      data
    ).toCSV();

    expect(result).toEqual(expected);
  });

  it('should work with multiple categories', () => {
    const data = {
      cat2: [98, 151, 159],
      cat1: [102, 149, 53]
    };
    const expected = `bucket,cat2,cat1
50,0,1
100,1,1
150,2,1`;

    const result = new Histogram(
      {multiple: 50},
      data
    ).toCSV();

    expect(result).toEqual(expected);
  });
});
