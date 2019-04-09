const DEFAULT_CATEGORY = 'count';

export class Histogram {
  private multiple: number;
  private valueSelector: (arg0: any) => number;
  private categories = new Set<string>();
  private map = new Map<number, {[p: string]: number}>();

  constructor({
      multiple,
      valueSelector = x => x
    } : {
      multiple: number,
      valueSelector?: (arg0: any) => number
    },
    data?: any[] | { [category: string]: any[] }
  ) {
    this.multiple = multiple;
    this.valueSelector = valueSelector;

    if(data) {
      this.push(data);
    }
  }

  public push(data: any[] | { [category: string]: any[] }): void {
    const categoriesData = Array.isArray(data) ? { [DEFAULT_CATEGORY]: data } : data;

    for (const [category, values] of Object.entries(categoriesData)) {
      this.categories.add(category);
      categoriesData[category] = values.map(this.valueSelector);
    }

    this.bucketize(categoriesData);
  }

  public toJSON(): [number, number | { [category: string]: number}][] {
    const arr = Array.from(this.map.entries());
    arr.sort((a, b) => a[0] - b[0]);

    if(!this.isSingleCategory()) {
      return arr;
    }
    return arr.map(([bucketValue, bucketCounter]) => {
      return [
        bucketValue,
        bucketCounter[DEFAULT_CATEGORY]
      ];
    });
  }

  public toCSV({ bucketTitle = 'bucket' }: { bucketTitle?: string } = {}): string {
    const arr = this.toJSON();
    return [
      [ bucketTitle, ...Array.from(this.categories) ].join(','),
      ...arr.map(([bucketValue, bucketCounter]) => [
        bucketValue,
        ...(typeof bucketCounter === 'number' ? [bucketCounter] : Object.values(bucketCounter))
      ].join(','))
    ].join('\n');
  }

  private isSingleCategory() {
    return this.categories.size === 1 && this.categories.has(DEFAULT_CATEGORY);
  }

  private bucketize(categoriesData: { [category: string]: number[] }): void {
    for (const [category, values] of Object.entries(categoriesData)) {
      for (const value of values) {
        const bucketValue = mround(value, this.multiple);
        const bucketCounter = this.getBucketCounter(bucketValue);
        bucketCounter[category] += 1;
      }
    }
  }

  private getBucketCounter(bucketValue: number): { [category: string]: number} {
    if (!this.map.has(bucketValue)) {
      this.map.set(
        bucketValue,
        Array.from(this.categories).reduce((acc: { [category: string]: number }, item) => {
          acc[item] = 0;
          return acc;
        }, {})
      );
    }

    return this.map.get(bucketValue) as { [category: string]: number}; //TODO: this should be implicit
  }
}

function mround(number: number, multiple: number) {
  if(Math.sign(number) != Math.sign(multiple)) {
    return NaN;
  }
  return number+(multiple/2) - (number+(multiple/2)) % multiple;
}
