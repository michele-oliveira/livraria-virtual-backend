export const getPublicImageUrl = (imageName: string) =>
  `${process.env.APP_URL}/images/${imageName}`;
