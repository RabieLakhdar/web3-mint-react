/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react"

import { BigNumber, ethers } from "ethers";
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Fade from "@mui/material/Fade"
import { NFTMinter__factory } from
  '../typechain-types/factories/contracts/NFTMinter__factory'
import type { NFTMinter } from '../typechain-types/contracts/NFTMinter';

import Stack from '@mui/material/Stack';


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


const Mint = () => {

  const contractAddress: any = process.env.REACT_APP_CONTRACT_ADDRESS;

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
  const [loading, setLoading] = React.useState(false);
  const handleClose = () => setOpen(false);

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
      const contract = NFTMinter__factory.connect(contractAddress, provider.getSigner());
      //const contract = new ethers.Contract(contractAddress, NFTCollectible__factory.abi, signer) as NFTCollectible;
      const ownerAddress = await contract.owner();
      const symbol = await contract.symbol();
      const baseTokenURI = await contract.baseTokenURI();
      const balance = await (await contract.balanceOf(accounts[0])).toNumber();
      const ethBalance = ethers.utils.formatEther(await provider.getBalance(accounts[0]));
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

      setService({
        account: accounts[0],
        contract: contract,
        currentBalance: balance,
        ethBalance: `${ethBalance} ETH`,
        mintAmount: 0,
        ethProvider: provider
      });

      console.log("Connected", accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!service.account) {
      connectWallet()
    }
  }, [service])

  const mintNFTs = async () => {
    try {
      setOpen(false)
      setLoading(true)

      const address = service.account;
      const amount = service.mintAmount!;
      const contract = service.contract!;
      const price = await contract.PRICE();
      const ethValue = price.mul(BigNumber.from(amount));
      const signer = service.ethProvider!.getSigner();
      let txn = await contract.connect(signer!).mintNFTs(amount, { value: ethValue });
      await txn.wait();
      const balance = await contract.balanceOf(address);
      await setService({ ...service, currentBalance: balance.toNumber(), mintAmount: 0 });
      await setLoading(false)
      await alert(`Congratulations, ${amount} its Minted`)

    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  return (
    <React.Fragment>
      <div style={{ margin: "50px" }}>
        <h4 style={{ color: "#2076d2" }}> Your NFT balance: {`${service.currentBalance}`}</h4>
      </div>
      <div style={{ margin: "50px" }}>
        {
          loading ? <h3 style={{ color: "#2076d2" }}>"The transaction on progress ..."</h3> :
            <Button onClick={() => setOpen(true)}>Click to Mint</Button>
        }
      </div>



      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
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
                <TextField
                  id="balance"
                  label="Balance"
                  sx={{ width: 500 }}
                  variant="standard"
                  value={service.currentBalance}
                  type="number"
                  inputProps={{ readOnly: true }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <TextField id="mint_amount" type="number"
                  label="Mint Amount" sx={{ width: 500 }}
                  variant="standard" 
                  value={service.mintAmount || 1}
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

export default Mint;
