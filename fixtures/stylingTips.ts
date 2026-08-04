/** Static educational content, not personalized advice. */
export const stylingTips = [
  { id: 'front-tuck', title: 'Front tuck', body: 'Define the waist while keeping an easy drape.' },
  { id: 'layering', title: 'Layering', body: 'Let each layer add a distinct length or texture.' },
  { id: 'sleeves', title: 'Sleeve rolling', body: 'Use one consistent roll to reveal the wrist.' },
  { id: 'balance', title: 'Colour balance', body: 'Repeat one tone in a smaller accessory.' },
  { id: 'proportion', title: 'Proportion', body: 'Balance volume with one cleaner silhouette.' },
  { id: 'accessories', title: 'Accessory pairing', body: 'Choose one focal detail, then edit.' },
] as const;

export const quickStylingPrompts = [
  'What should I wear today?',
  'Style me for dinner',
  'Build a smart-casual outfit',
  'Create a travel outfit',
  'Style my favourite jacket',
] as const;
