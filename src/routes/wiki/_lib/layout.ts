export function getLayout(layoutName: string): WikiLayout {
  if (layoutName === 'hacks') {
    return {
      headerStyle: 'small'
    };
  }
  return {
    headerStyle: 'large'
  };
}

export interface WikiLayout {
  headerStyle: 'large' | 'small';
}
