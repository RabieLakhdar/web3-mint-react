import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';

import Container from '@mui/material/Container';
import { BigNumber, ethers } from "ethers";
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Fade from "@mui/material/Fade"
import { NFTMinter__factory } from
  './typechain-types/factories/contracts/NFTMinter__factory'
import type { NFTMinter } from './typechain-types/contracts/NFTMinter';
import Backdrop from '@mui/material/Backdrop';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import logo from './metamask.svg';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function Demo() {

  const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  interface IWallet {
    iconColor: string;
    connectedWallet: string;
    contractAddress: string;
    contractSymbol: string;
    contractBaseTokenURI: string;
    contractOwnerAddress: string;
    contractPrice: string;
    isOwner: boolean;
  }

  interface IService {
    account: string;
    ethProvider?: ethers.providers.Web3Provider,
    contract?: NFTMinter;
    currentBalance: number;
    ethBalance: string;
    mintAmount: number;
  }

  const [state, setState] = React.useState<IWallet>({
    iconColor: "disabled",
    connectedWallet: "",
    contractSymbol: "",
    contractAddress: "",
    contractBaseTokenURI: "",
    contractOwnerAddress: "",
    contractPrice: "",
    isOwner: false
  });

  const [service, setService] = React.useState<IService>({
    account: "",
    currentBalance: 0,
    ethBalance: "",
    mintAmount: 0
  })
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [nftCollection, setNFTCollection] = React.useState<string[]>([]);

  const connectWallet = async () => {
    try {
      console.log("connect wallet");
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const contract = NFTMinter__factory.connect
        (contractAddress, provider.getSigner());
      //const contract = new ethers.Contract
      //(contractAddress, NFTCollectible__factory.abi, signer) as NFTCollectible;
      const ownerAddress = await contract.owner();
      const symbol = await contract.symbol();
      const baseTokenURI = await contract.baseTokenURI();
      const balance = await (await contract.balanceOf(accounts[0])).toNumber();
      const ethBalance = ethers.utils.formatEther
        (await provider.getBalance(accounts[0]));
      const isOwner = (ownerAddress.toLowerCase() === accounts[0].toLowerCase());
      const price = ethers.utils.formatEther(await contract.PRICE());
      setState({
        iconColor: "success",
        connectedWallet: accounts[0],
        contractSymbol: symbol,
        contractAddress: contract.address,
        contractBaseTokenURI: baseTokenURI,
        contractOwnerAddress: ownerAddress,
        contractPrice: `${price} ETH`,
        isOwner: isOwner
      });

      console.log("Connected", accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const loadNFTCollection = async () => {
    try {
      console.log("load NFT collection");
      let baseURI: string = state.contractBaseTokenURI;
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
  };

  const mintNFTs = async () => {
    try {
      console.log("mint NFTs", service);
      const address = service.account;
      const amount = service.mintAmount!;
      const contract = service.contract!;
      const price = await contract.PRICE();
      const ethValue = price.mul(BigNumber.from(amount));
      const signer = service.ethProvider!.getSigner();
      let txn = await contract.connect(signer!).mintNFTs(amount, { value: ethValue });
      await txn.wait();
      const balance = await contract.balanceOf(address);
      setService({ ...service, currentBalance: balance.toNumber(), mintAmount: 0 });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Stack direction="row" spacing={2}>
            <Typography variant="h3" component="div">
              Rabiel.dev NFT Mint
            </Typography>
            <Avatar alt="logo" src={logo} sx={{ width: 64, height: 64 }} />
          </Stack>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Button onClick={connectWallet}>connect wallet</Button>
      <Button onClick={loadNFTCollection}>Load NFTS</Button>
      <Button onClick={() => setOpen(true)}>Mint</Button>

      <div style={{ margin: "60px", display: "grid", height: "300px" }}>

        <Box sx={{ display: 'display', alignItems: 'flex-end' }}>
          <TextField id="wallet_address" label="Connected Account"
            sx={{ width: 300 }} variant="standard" value={state.connectedWallet}
            inputProps={{ readOnly: true, }}
          />
        </Box>
        <TextField id="contract_symbol" label="Contract Symbol"
          vari-ant="standard" value={state.contractSymbol}
          inputProps={{ readOnly: true, }}
        />
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <TextField id="contract_address" label="Contract Address"
            sx={{ width: 400 }} variant="standard" value={state.contractAddress}
            inputProps={{ readOnly: true, }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <TextField id="contract_baseURI" label="Contract Base Token URI"
            sx={{ width: 500 }} variant="standard" value={state.contractBaseTokenURI}
            inputProps={{ readOnly: true, }}
          />
        </Box>
      </div>

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

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Stack spacing={1} sx={{ width: 500 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <TextField id="mint_account" label="Account"
                  sx={{ width: 500 }} variant="standard" value={service.account}
                  inputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <TextField id="price" label="NFT Price"
                  sx={{ width: 500 }} variant="standard" value={state.contractPrice}
                  inputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <TextField id="balance" label="Balance"
                  sx={{ width: 500 }} variant="standard" value={service.currentBalance}
                  type="number" inputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <TextField id="mint_amount" type="number"
                  label="Mint Amount" sx={{ width: 500 }}
                  variant="standard" value={service.mintAmount}
                  onChange={event => {
                    const { value } = event.target;
                    const amount = parseInt(value);
                    setService({ ...service, mintAmount: amount });
                  }}
                />
              </Box>
              <Stack direction="row" spacing={2} sx={{ margin: 5 }}>
                <Button variant="outlined" onClick={mintNFTs}>Mint</Button>
                <Button variant="outlined" onClick={handleClose}>close</Button>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </React.Fragment>
  );
}

export default Demo;
