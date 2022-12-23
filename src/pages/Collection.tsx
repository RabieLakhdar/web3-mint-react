/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';


const Collection = () => {

  const [nftCollection, setNFTCollection] = React.useState<string[]>([]);
  useEffect(() => {
    try {
      console.log("load NFT collection");
      let baseURI: any = process.env.REACT_APP_BASEURI;
      baseURI = baseURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
      setNFTCollection(
        [
          `${baseURI}/0001.png`,
          `${baseURI}/0002.png`,
          `${baseURI}/0003.png`,
          `${baseURI}/0004.png`,
          `${baseURI}/0005.png`,
          `${baseURI}/0006.png`,
          `${baseURI}/0007.png`,
          `${baseURI}/0008.png`,
        ]);
    } catch (error) {
      console.log(error);
    }
  }, [])

  return (
    <div>
      <ImageList  variant="woven" cols={3} gap={8}>
        {nftCollection.map((item) => (
          <ImageListItem key={item}>
            <img
              src={item}
            />
          </ImageListItem>
        ))}
      </ImageList>

    </div>
  );
}

export default Collection;
