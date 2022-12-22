/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';


const Collection = () => {

  const [nftCollection, setNFTCollection] = React.useState<string[]>([]);
  console.log(process.env.REACT_APP_BASEURI)
  useEffect(() => {
    try {
      console.log("load NFT collection");
      let baseURI: any = process.env.REACT_APP_BASEURI;
      baseURI = baseURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/");
      setNFTCollection(
        [
          `${baseURI}0001.png`,
          `${baseURI}0002.png`,
          `${baseURI}0003.png`,
          `${baseURI}0004.png`,
        ]);
    } catch (error) {
      console.log(error);
    }
  }, [])

  return (
    <React.Fragment>
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {nftCollection.map((item) => (
          <ImageListItem key={item}>
            <img
              src={`${item}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>

    </React.Fragment>
  );
}

export default Collection;
