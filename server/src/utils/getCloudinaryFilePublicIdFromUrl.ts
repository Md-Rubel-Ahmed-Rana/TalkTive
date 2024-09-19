const extractCloudinaryPublicId = (url: string) => {
  const regex = /public_id=([^?]+)/;
  const match: any = url.match(regex);
  if (match) {
    const public_id = match[1] as string;
    console.log(`Remove cloudinary file of public_id: ${public_id}`);
    return public_id;
  } else {
    console.log("This is not  cloudinary file");
    return null;
  }
};

export default extractCloudinaryPublicId;
